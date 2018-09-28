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
import ProductListMain from './productlist.main';
import ProductListPagination from './productlistpagination.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

class CategoryItemsMain extends React.Component {
  static propTypes = {
    categoryUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categoryModel: { links: [] },
    };
  }

  componentDidMount() {
    const { categoryUrl } = this.props;
    this.setState({ isLoading: true });
    login().then(() => cortexFetch(`${categoryUrl}?zoom=items`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }))
      .then(res => res.json())
      .then((res) => {
        this.setState({
          isLoading: false,
          categoryModel: res,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isLoading: true });
    login().then(() => {
      cortexFetch(`${nextProps.categoryUrl}?zoom=items`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            isLoading: false,
            categoryModel: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  render() {
    const { isLoading, categoryModel } = this.state;
    const products = categoryModel._items ? categoryModel._items[0] : categoryModel;
    const noProducts = !products || products.links.length === 0;

    return (
      <div className="category-items-container container-3">
        <div data-region="categoryTitleRegion">
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
                <h1 className="view-title">
                  {categoryModel['display-name']}
                </h1>
                <div className="products-container">
                  <ProductListPagination paginationDataProps={products} />
                  <ProductListMain productData={products} />
                  <ProductListPagination paginationDataProps={products} />
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
