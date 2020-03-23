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
import { navigationLookup, cortexFetchNavigationLookupForm } from '../utils/CortexLookup';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import ProductListMain from '../ProductList/productlist.main';
import SearchFacetNavigationMain from '../SearchFacetNavigation/searchfacetnavigation.main';
import FeaturedProducts from '../FeaturedProducts/featuredproducts.main';
import ProductListPagination from '../ProductListPagination/productlistpagination.main';
import ProductListLoadMore from '../ProductListLoadmore/productlistloadmore';

import './categoryitems.main.less';
import SortProductMenu from '../SortProductMenu/sortproductmenu.main';

let Config: IEpConfig | any = {};

const zoomArray = [
  'chosen',
  'chosen:description',
  'offersearchresult',
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

interface CategoryItemsMainProps {
  /** category props */
  categoryProps: {
    [key: string]: any
  },
  /** handle product facet selection */
  onProductFacetSelection?: (...args: any[]) => any,
  /** product links */
  productLinks?: {
    [key: string]: any
  },
}

interface CategoryItemsMainState {
    isLoading: boolean,
    categoryModel: any,
    loadSortedProduct: boolean,
    categoryModelDisplayName: any,
    categoryModelParentDisplayName: any,
    categoryModelId: any,
}

class CategoryItemsMain extends Component<CategoryItemsMainProps, CategoryItemsMainState> {
  static defaultProps = {
    onProductFacetSelection: () => {},
    productLinks: {
      itemDetail: '',
      productsCompare: '',
      productSearch: '',
      productCategory: '',
    },
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      isLoading: true,
      categoryModel: { links: [] },
      loadSortedProduct: false,
      categoryModelDisplayName: undefined,
      categoryModelParentDisplayName: undefined,
      categoryModelId: undefined,
    };

    this.handleProductsChange = this.handleProductsChange.bind(this);
    this.handleSortSelection = this.handleSortSelection.bind(this);
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
  }

  componentDidMount() {
    const { categoryProps } = this.props;
    this.getCategoryData(categoryProps);
  }

  componentWillReceiveProps(nextProps) {
    const { categoryProps } = nextProps;
    this.getCategoryData(categoryProps);
  }

  getCategoryData(categoryProps) {
    this.setState({ isLoading: true });
    let categoryId = categoryProps.match.params;
    let categoryUrl = '';
    if (!categoryId['0'] || categoryId['0'] === undefined) {
      categoryId = categoryProps.match.params.id;
    } else {
      categoryId = categoryProps.match.params.id;
      categoryUrl = categoryProps.match.params['0'];
    }
    login().then(() => {
      cortexFetchNavigationLookupForm()
        .then(() => navigationLookup(categoryId)
          .then((res) => {
            this.setState({
              categoryModel: res,
              categoryModelDisplayName: res['display-name'],
              categoryModelParentDisplayName: res._parent ? res._parent[0]['display-name'] : '',
              categoryModelId: categoryId,
            });
          })
          .then(() => {
            if (categoryUrl !== '') {
              navigationLookup(categoryUrl)
                .then((res) => {
                  const { categoryModel } = this.state;
                  const productNode = (categoryModel._offers) ? ('_offers') : ('_items');
                  this.setState(prevState => ({
                    categoryModel: {
                      ...prevState.categoryModel,
                      [productNode]: [res],
                    },
                    isLoading: false,
                  }));
                });
            } else {
              this.setState({
                isLoading: false,
              });
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          }))
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          // eslint-disable-next-line no-console
          console.error(err.message);
        });
    });
  }

  handleSortSelection(event) {
    const { categoryModel } = this.state;
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
          const productNode = (categoryModel._offers) ? ('_offers') : ('_items');
          this.setState(prevState => ({
            categoryModel: {
              ...prevState.categoryModel,
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
    const { categoryModel } = this.state;
    const productNode = (categoryModel._offers) ? ('_offers') : ('_items');
    this.setState(prevState => ({
      categoryModel: {
        ...prevState.categoryModel,
        [productNode]: [products],
      },
    }));
  }

  handleFacetSelection(res) {
    const { categoryModelId } = this.state;
    const { onProductFacetSelection } = this.props;
    onProductFacetSelection(res, categoryModelId);
  }

  render() {
    const {
      isLoading, categoryModel, categoryModelId, categoryModelDisplayName, categoryModelParentDisplayName, loadSortedProduct,
    } = this.state;
    const { productLinks } = this.props;
    let products: { [key: string]: any } = {};
    let productList = '';
    let noProducts = true;
    let featuredOffers = {};
    if (categoryModel._offers) {
      [products] = categoryModel._offers;
      [productList] = categoryModel._offers;
    } else {
      products = categoryModel._items ? categoryModel._items[0] : categoryModel;
      productList = categoryModel._items ? categoryModel._items[0] : categoryModel;
    }

    if (categoryModel._featuredoffers) {
      [featuredOffers] = categoryModel._featuredoffers;
    }
    const categoryModelIdString = categoryModelId;
    noProducts = !products || !products._element || !products.pagination;
    const propCompareButton = true;

    return (
      <div className="category-items-container container-3">
        <div data-region="categoryTitleRegion">
          {(() => {
            if (isLoading) {
              return (<div className="loader" />);
            }

            if (noProducts) {
              return (
                <h3 className="view-title">
                  {intl.get('no-products-found')}
                </h3>
              );
            }

            return (
              <div>
                <div className="menu-history">
                  {categoryModelParentDisplayName}
                  {categoryModelParentDisplayName && (
                    <span className="arrow">
                      &nbsp;﹥&nbsp;
                    </span>
                  )}
                  {categoryModelDisplayName}
                  <h1 className="category-title">
                    {categoryModelDisplayName}
                  </h1>
                </div>
                <SearchFacetNavigationMain productData={products} onFacetSelection={this.handleFacetSelection} />
                <div className="products-container">
                  <FeaturedProducts productData={featuredOffers} itemDetailLink={productLinks.itemDetail} />
                  <SortProductMenu handleSortSelection={this.handleSortSelection} categoryModel={categoryModel} />
                  <ProductListPagination paginationDataProps={products} titleString={categoryModelIdString} isTop productListPaginationLinks={productLinks} />
                  <div className={`${loadSortedProduct ? 'loading-product' : ''}`}>
                    <div className={`${loadSortedProduct ? 'sort-product-loader' : ''}`} />
                    <ProductListMain productData={productList} productListLinks={productLinks} showCompareButton={propCompareButton} />
                  </div>
                  <ProductListLoadMore dataProps={products} handleDataChange={this.handleProductsChange} onLoadMore={navigationLookup} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}

export default CategoryItemsMain;
