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

import React from 'react';
import * as cortex from '@elasticpath/cortex-client';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import ProductListMain from '../ProductList/productlist.main';
import ProductListPagination from '../ProductListPagination/productlistpagination.main';
import SearchFacetNavigationMain from '../SearchFacetNavigation/searchfacetnavigation.main';
import ProductListLoadMore from '../ProductListLoadmore/productlistloadmore';
import SortProductMenu from '../SortProductMenu/sortproductmenu.main';
import { ClientContext } from '../ClientContext';

import './searchresultsitems.main.less';

let Config: IEpConfig | any = {};
let intl = { get: (str, ...args: any[]) => str };

const navigationZoom = {
  element: {
    availability: {},
    definition: {},
    code: {},
    price: {},
  },
};

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
  searchKeywordsProps: {
    [key: string]: any
  },
  onProductFacetSelection?: (...args: any[]) => any,
  productLinks?: {
    [key: string]: string
  }
}

interface SearchResultsItemsMainState {
  isLoading: boolean,
  searchResultsModel: cortex.KeywordSearchResult,
  loadSortedProduct: boolean,
  searchKeywords: any
}

class SearchResultsItemsMain extends React.Component<SearchResultsItemsMainProps, SearchResultsItemsMainState> {
  static contextType = ClientContext;

  static defaultProps = {
    onProductFacetSelection: () => {},
    productLinks: {
      itemDetail: '',
      productsCompare: '',
      productSearch: '',
      productCategory: '',
    },
  };

  client: cortex.IClient;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
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

  async componentDidMount() {
    this.client = this.context;
    const { searchKeywordsProps } = this.props;
    await this.getSearchData(searchKeywordsProps);
  }

  async componentWillReceiveProps(nextProps) {
    const { searchKeywordsProps } = nextProps;
    await this.getSearchData(searchKeywordsProps);
  }

  async getSearchData(searchKeywordsProps) {
    this.setState({
      isLoading: true,
      searchKeywords: searchKeywordsProps,
    });
    let searchKeyword = searchKeywordsProps.match.params;
    let searchUrl = '';
    if (!searchKeyword['0'] || searchKeyword['0'] === undefined) {
      searchKeyword = searchKeywordsProps.match.params.keywords;
    } else {
      searchKeyword = searchKeywordsProps.match.params.keywords;
      searchUrl = searchKeywordsProps.match.params['0'];
    }
    const requestPaylod = (searchUrl === '') ? searchKeyword : searchUrl;
    const body = { keywords: requestPaylod, pageSize: 5 };
    try {
      const fetchFormshRes = await this.client.root().fetch({
        searches: {
          offersearchform: {},
          keywordsearchform: {},
        },
      });
      const searchDataRes = await fetchFormshRes.searches.keywordsearchform(body).fetch(navigationZoom);
      this.setState({
        isLoading: false,
        searchResultsModel: searchDataRes,
        searchKeywords: searchKeyword,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
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
    const products = searchResultsModel.items ? searchResultsModel.items : searchResultsModel;
    const noProducts = !products || !products.elements;
    const propCompareButton = false;
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
                  <ProductListPagination paginationDataProps={products} />
                  <div className={`${loadSortedProduct ? 'loading-product' : ''}`}>
                    <div className={`${loadSortedProduct ? 'sort-product-loader' : ''}`} />
                    <ProductListMain productData={products} showCompareButton={propCompareButton} productListLinks={productLinks} />
                  </div>
                  <ProductListLoadMore itemsZoom={navigationZoom} dataProps={products} handleDataChange={this.handleProductsChange} />
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
