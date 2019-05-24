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
import { login } from '../utils/AuthService';
import { searchLookup } from '../utils/CortexLookup';
import { getConfig } from '../utils/ConfigProvider';
import ProductListMain from './productlist.main';
import ProductListPagination from './productlistpagination.main';
import SearchFacetNavigationMain from './searchfacetnavigation.main';
import ProductListLoadMore from './productlistloadmore';

import './searchresultsitems.main.less';

let Config = {};
let intl = { get: str => str };

class SearchResultsItemsMain extends React.Component {
  static propTypes = {
    searchKeywordsProps: PropTypes.objectOf(PropTypes.any).isRequired,
    onProductFacetSelection: PropTypes.func,
  }

  static defaultProps = {
    onProductFacetSelection: () => {},
  }

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    const { searchKeywordsProps } = this.props;
    this.state = {
      isLoading: true,
      searchResultsModel: { links: [] },
      searchKeywords: searchKeywordsProps,
    };

    this.handleProductsChange = this.handleProductsChange.bind(this);
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
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
    const { isLoading, searchResultsModel, searchKeywords } = this.state;
    const products = searchResultsModel._items ? searchResultsModel._items[0] : searchResultsModel;
    const noProducts = !products || products.links.length === 0 || !products._element;
    const searchKeywordString = searchKeywords;
    const propCompareButton = false;
    return (
      <div className="category-items-container container-3">
        <div data-region="categoryTitleRegion">
          {
            ((typeof searchKeywords === 'object' || searchKeywords instanceof Object) || ((typeof searchKeywords === 'string' || searchKeywords instanceof String) && searchKeywords.includes('/') && searchKeywords.includes(Config.cortexApi.scope))) ? (
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
                  <ProductListPagination paginationDataProps={products} titleString={searchKeywordString} isTop />
                  <ProductListMain productData={products} showCompareButton={propCompareButton} />
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
