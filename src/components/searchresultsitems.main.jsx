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
import { searchProducts } from '../utils/AuthService';
import ProductListMain from './productlist.main';
import ProductListPagination from './productlistpagination.main';

class SearchResultsItemsMain extends React.Component {
  static propTypes = {
    searchKeywordsProps: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      searchResultsModel: { links: [] },
    };
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
    this.setState({ isLoading: true });

    searchProducts(searchKeywordsProps)
      .then((res) => {
        this.setState({
          isLoading: false,
          searchResultsModel: res,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  render() {
    const { isLoading, searchResultsModel } = this.state;
    const products = searchResultsModel._items ? searchResultsModel._items[0] : searchResultsModel;
    const noProducts = !products || products.links.length === 0;
    const { searchKeywordsProps } = this.props;

    return (
      <div className="category-items-container container-3">
        <div data-region="categoryTitleRegion">
          <h1 className="view-title">
            {intl.get('search-results-for', { searchKeywords: searchKeywordsProps })}
          </h1>
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
                <div className="products-container">
                  <ProductListPagination paginationDataProps={products} isTop />
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

export default SearchResultsItemsMain;
