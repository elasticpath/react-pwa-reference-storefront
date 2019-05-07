/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { login } from '../utils/AuthService';
import { navigationLookup, cortexFetchNavigationLookupForm } from '../utils/CortexLookup';
import { cortexFetch } from '../utils/Cortex';
import ProductListMain from './productlist.main';
import SearchFacetNavigationMain from './searchfacetnavigation.main';
import FeaturedProducts from './featuredproducts.main';
import ProductListPagination from './productlistpagination.main';
import ProductListLoadMore from './productlistloadmore';

import './categoryitems.main.less';

const Config = require('Config');

const zoomArray = [
  'chosen',
  'chosen:description',
  'offersearchresult:element',
  'offersearchresult:element:availability',
  'offersearchresult:element:definition',
  'offersearchresult:element:definition:assets:element',
  'offersearchresult:element:price',
  'offersearchresult:element:rate',
  'offersearchresult:element:code',
  'offersearchresult:element',
  'offersearchresult:element:availability',
  'offersearchresult:element:definition',
  'offersearchresult:element:definition:assets:element',
  'offersearchresult:element:pricerange',
  'offersearchresult:element:items',
  'offersearchresult:element:items:element',
  'offersearchresult:element:items:element:availability',
  'offersearchresult:element:items:element:definition',
  'offersearchresult:element:items:element:definition:assets:element',
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
  'offersearchresult:offersearchresult:facets:element:facetselector:chosen:selector',
  'offersearchresult:facets:element:facetselector:chosen:selectaction',
];

class CategoryItemsMain extends React.Component {
  static propTypes = {
    categoryProps: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categoryModel: { links: [] },
      productData: [],
      loadSortedProduct: false,
    };

    this.handleProductsChange = this.handleProductsChange.bind(this);
    this.handleSortSelection = this.handleSortSelection.bind(this);
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
          }));
    });
  }

  handleSortSelection(event) {
    const selfUri = event.target.value;
    this.setState({
      loadSortedProduct: true,
    });
    login().then(() => {
      cortexFetch(`${selfUri}?followlocation&zoom=${zoomArray.sort().join()}`,
        // cortexFetch(`${selfUri}?followlocation=true&zoom=${zoomArray.sort().join()}`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            productData: res,
            loadSortedProduct: false,
          });
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

  renderSortSelection() {
    const { categoryModel, productData } = this.state;
    let products = '';
    if (categoryModel._offers) {
      [products] = categoryModel._offers;
    } else {
      products = categoryModel._items ? categoryModel : categoryModel;
    }
    if (products._sortattributes) {
      const chosenSelect = productData._chosen ? productData._chosen[0]._description[0]['display-name'] : products._sortattributes[0]._chosen[0]._description[0]['display-name'];

      return (
        <div className="dropdown-sort-field">
          <p className="sort-title">Sort By</p>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {chosenSelect}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {(products._sortattributes[0]._choice) ? products._sortattributes[0]._choice.map(sortChoice => (
                <button type="button" onClick={this.handleSortSelection} className="dropdown-item" key={sortChoice._description[0]['display-name']} id={`product_display_item_sku_option_${sortChoice._description[0]['display-name']}`} value={(sortChoice._selectaction) ? sortChoice._selectaction[0].self.uri : ''}>
                  {sortChoice._description[0]['display-name']}
                </button>
              )) : ''}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      isLoading, categoryModel, categoryModelId, categoryModelDisplayName, categoryModelParentDisplayName, productData, loadSortedProduct,
    } = this.state;
    let products = '';
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

    if (productData._offersearchresult && productData._offersearchresult[0]._element) {
      [productList] = productData._offersearchresult;
    }
    const categoryModelIdString = categoryModelId;
    noProducts = !products || !products._facets || !products._element || !products.pagination;

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
                <SearchFacetNavigationMain productData={products} titleString={categoryModelIdString} />
                <div className="products-container">
                  <div className="sort-product-menu">
                    {this.renderSortSelection()}
                  </div>
                  <FeaturedProducts productData={featuredOffers} />
                  <ProductListPagination paginationDataProps={products} titleString={categoryModelIdString} isTop />
                  <div className={`${loadSortedProduct ? 'loader' : ''}`} />
                  <div className={`${loadSortedProduct ? 'loading-product' : ''}`}>
                    <ProductListMain productData={productList} />
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
