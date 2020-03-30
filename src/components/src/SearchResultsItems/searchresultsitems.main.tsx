/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { login } from '../utils/AuthService';
import { searchLookup } from '../utils/CortexLookup';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import ProductListMain from '../ProductList/productlist.main';
import ProductListPagination from '../ProductListPagination/productlistpagination.main';
import SearchFacetNavigationMain from '../SearchFacetNavigation/searchfacetnavigation.main';
import ProductListLoadMore from '../ProductListLoadmore/productlistloadmore';
import SortProductMenu from '../SortProductMenu/sortproductmenu.main';

import './searchresultsitems.main.less';

let Config: IEpConfig | any = {};

const zoomArray = [
  'chosen',
  'chosen:description',
  'offersearchresult',
  'offersearchresult:offers',
  'offersearchresult:offers:element',
  'offersearchresult:offers:element:code',
  'offersearchresult:offers:element:availability',
  'offersearchresult:offers:element:definition',
  'offersearchresult:offers:element:definition:assets:element',
  'offersearchresult:offers:element:pricerange',
  'offersearchresult:offers:element:items',
  'offersearchresult:offers:element:items:element',
  'offersearchresult:offers:element:items:element:availability',
  'offersearchresult:offers:element:items:element:definition',
  'offersearchresult:offers:element:items:element:definition:assets:element',
  'offersearchresult:offers:element:items:element:price',
  'offersearchresult:offers:element:items:element:rate',
  'offersearchresult:offers:element:items:element:code',
  'offersearchresult:offers:element:rate',
  'offersearchresult:element',
  'offersearchresult:element:availability',
  'offersearchresult:element:definition',
  'offersearchresult:element:price',
  'offersearchresult:element:rate',
  'offersearchresult:element:code',
  'offersearchresult:element:pricerange',
  'offersearchresult:element:items',
  'offersearchresult:element:items:element',
  'offersearchresult:element:items:element:availability',
  'offersearchresult:element:items:element:definition',
  'offersearchresult:element:items:element:price',
  'offersearchresult:element:items:element:rate',
  'offersearchresult:element:items:element:code',
  'offersearchresult:facets',
  'offersearchresult:facets:element',
  'offersearchresult:facets:element:facetselector',
  'offersearchresult:facets:element:facetselector:choice:description',
  'offersearchresult:facets:element:facetselector:choice:selector',
  'offersearchresult:facets:element:facetselector:choice:selectaction',
  'offersearchresult:facets:element:facetselector:chosen:description',
  'offersearchresult:facets:element:facetselector:chosen:selector',
  'offersearchresult:facets:element:facetselector:chosen:selectaction',
  'offersearchresult:sortattributes',
  'offersearchresult:sortattributes:choice',
  'offersearchresult:sortattributes:choice:description',
  'offersearchresult:sortattributes:choice:selectaction',
  'offersearchresult:sortattributes:chosen',
  'offersearchresult:sortattributes:chosen:description',
  'offersearchresult:sortattributes:chosen:selectaction',
];

interface SearchResultsItemsMainProps {
  /** search keywords */
  searchKeywordsProps: {
    [key: string]: any
  },
  /** handle product facet selection */
  onProductFacetSelection?: (...args: any[]) => any,
  /** product links */
  productLinks?: {
    [key: string]: string
  }
}

interface SearchResultsItemsMainState {
  isLoading: boolean,
  searchResultsModel: {
    [key: string]: any
  },
  loadSortedProduct: boolean,
  searchKeywords: any
}

class SearchResultsItemsMain extends Component<SearchResultsItemsMainProps, SearchResultsItemsMainState> {
  static defaultProps = {
    onProductFacetSelection: () => {},
    productLinks: {
      itemDetail: '',
      productsCompare: '',
      productSearch: '',
      productCategory: '',
    },
  }

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
    const { searchKeywordsProps } = this.props;

    this.state = {
      isLoading: true,
      searchResultsModel: { links: [] },
      loadSortedProduct: false,
      searchKeywords: searchKeywordsProps,
    };

    this.handleProductsChange = this.handleProductsChange.bind(this);
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
    this.handleSortSelection = this.handleSortSelection.bind(this);
  }

  componentDidMount() {
    const { searchKeywordsProps } = this.props;
    this.getSearchData(searchKeywordsProps);
  }

  componentWillReceiveProps(nextProps) {
    const { searchKeywordsProps } = nextProps;
    this.getSearchData(searchKeywordsProps);
  }

  getSearchData(searchKeywordsProps) {
    this.setState({
      isLoading: true,
      searchKeywords: searchKeywordsProps,
    });
    if (searchKeywordsProps.match.params.keywords) {
      login().then(() => {
        let searchKeyword = searchKeywordsProps.match.params;
        let searchUrl = '';
        if (!searchKeyword['0'] || searchKeyword['0'] === undefined) {
          searchKeyword = searchKeywordsProps.match.params.keywords;
        } else {
          searchKeyword = searchKeywordsProps.match.params.keywords;
          searchUrl = searchKeywordsProps.match.params['0'];
        }
        searchLookup((searchUrl === '') ? searchKeyword : searchUrl)
          .then((res) => {
            this.setState({
              isLoading: false,
              searchResultsModel: res,
              searchKeywords: searchKeyword,
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    } else {
      this.setState({
        isLoading: false,
        searchResultsModel: {},
        searchKeywords: ' ',
      });
    }
  }

  handleSortSelection(event) {
    const { searchResultsModel } = this.state;
    const selfUri = event.target.value;
    this.setState({
      loadSortedProduct: true,
    });
    login().then(() => {
      cortexFetch(`${selfUri}?followlocation&zoom=${zoomArray.sort().join()}`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          const productNode = (searchResultsModel._offers) ? ('_offers') : ('_items');
          this.setState(prevState => ({
            searchResultsModel: {
              ...prevState.searchResultsModel,
              [productNode]: [res._offersearchresult[0]],
            },
            loadSortedProduct: false,
          }));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          this.setState({
            loadSortedProduct: false,
          });
        });
    });
  }

  handleProductsChange(products) {
    this.setState({ searchResultsModel: products });
  }

  handleFacetSelection(res) {
    const { searchKeywords } = this.state;
    const { onProductFacetSelection } = this.props;
    onProductFacetSelection(res, searchKeywords);
  }

  render() {
    const {
      isLoading, searchResultsModel, searchKeywords, loadSortedProduct,
    } = this.state;
    const { productLinks } = this.props;
    const products = searchResultsModel._items ? searchResultsModel._items[0] : searchResultsModel;
    const noProducts = !products._element;
    const searchKeywordString = searchKeywords;
    const propCompareButton = true;
    return (
      <div className="category-items-container container-3">
        <div data-region="categoryTitleRegion">
          {
            ((typeof searchKeywords === 'object' || searchKeywords instanceof Object) || ((typeof searchKeywords === 'string' || searchKeywords instanceof String) && searchKeywords.includes('/') && searchKeywords.includes(Config.cortexApi.scope.toLowerCase()))) ? (
              <h1 className="view-title">
                {intl.get('search-results')}
              </h1>
            ) : (
              <h1 className="view-title">
                {intl.get('search-results-for', { searchKeywords })}
              </h1>
            )}
          {(() => {
            if (isLoading) {
              return (<div className="loader" />);
            }

            if (noProducts) {
              return (
                <h3>
                  {intl.get('no-products-found')}
                </h3>
              );
            }
            return (
              <div>
                <SearchFacetNavigationMain onFacetSelection={this.handleFacetSelection} productData={products} />
                <div className="products-container">
                  <SortProductMenu handleSortSelection={this.handleSortSelection} categoryModel={searchResultsModel} />
                  <ProductListPagination paginationDataProps={products} titleString={searchKeywordString} isTop productListPaginationLinks={productLinks} />
                  <div className={`${loadSortedProduct ? 'loading-product' : ''}`}>
                    <div className={`${loadSortedProduct ? 'sort-product-loader' : ''}`} />
                    <ProductListMain productData={products} showCompareButton={propCompareButton} productListLinks={productLinks} />
                  </div>
                  <ProductListLoadMore dataProps={products} handleDataChange={this.handleProductsChange} onLoadMore={searchLookup} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}

export default SearchResultsItemsMain;
