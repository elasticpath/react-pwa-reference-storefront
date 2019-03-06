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
import ProductListMain from './productlist.main';
import SearchFacetNavigationMain from './searchfacetnavigation.main';
import ProductListPagination from './productlistpagination.main';
import ProductListLoadMore from './productlistloadmore';

import './categoryitems.main.less';

class CategoryItemsMain extends React.Component {
  static propTypes = {
    categoryProps: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categoryModel: { links: [] },
    };

    this.handleProductsChange = this.handleProductsChange.bind(this);
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
                  this.setState({
                    isLoading: false,
                    categoryModel: res,
                  });
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

  handleProductsChange(products) {
    this.setState({ categoryModel: products });
  }

  render() {
    const {
      isLoading, categoryModel, categoryModelId, categoryModelDisplayName, categoryModelParentDisplayName,
    } = this.state;
    let products = '';
    if (categoryModel._offers) {
      [products] = categoryModel._offers;
    } else {
      products = categoryModel._items ? categoryModel._items[0] : categoryModel;
    }
    const noProducts = !products || !products.links || products.links.length === 0 || !products.pagination;
    const categoryModelIdString = categoryModelId;

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
                  <ProductListPagination paginationDataProps={products} titleString={categoryModelIdString} isTop />
                  <ProductListMain productData={products} />
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
