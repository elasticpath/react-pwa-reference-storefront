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
import { searchLookup } from '../utils/CortexLookup';
import ProductListMain from './productlist.main';
import ProductListPagination from './productlistpagination.main';
import SearchFacetNavigationMain from './searchfacetnavigation.main';

import './searchresultsitems.main.less';

class SearchResultsItemsMain extends React.Component {
  static propTypes = {
    searchKeywordsProps: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    const { searchKeywordsProps } = this.props;
    this.state = {
      isLoading: true,
      searchResultsModel: { links: [] },
      searchKeywords: searchKeywordsProps,
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
    this.setState({
      isLoading: true,
      searchKeywords: searchKeywordsProps,
    });

    login().then(() => {
      let searchKeyword = searchKeywordsProps.match.params;
      if (!searchKeyword.keywords || searchKeyword.keywords === undefined) {
        searchKeyword = searchKeywordsProps.match.params[0];
      } else {
        searchKeyword = searchKeywordsProps.match.params.keywords;
      }
      searchLookup(searchKeyword)
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
  }

  render() {
    const { isLoading, searchResultsModel } = this.state;
    const products = searchResultsModel._items ? searchResultsModel._items[0] : searchResultsModel;
    const noProducts = !products || products.links.length === 0 || !products._element;
    const { searchKeywords } = this.state;
    const searchKeywordsString = '';

    return (
      <div className="category-items-container container-3">
        <div data-region="categoryTitleRegion">
          {
            (searchKeywordsString.includes('/')) ? (
              <h1 className="view-title">
                {intl.get('search-results')}
              </h1>
            ) : (
              <h1 className="view-title">
                {intl.get('search-results-for', { searchKeywordsString })}
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
                <SearchFacetNavigationMain productData={products} />
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
