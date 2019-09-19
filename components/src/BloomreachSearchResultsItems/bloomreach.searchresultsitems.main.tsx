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
// import { bloomreachSuggestionSearch } from '../utils/BloomreachSearchService';
// import BloomreachProductListMain from './bloomreach.productlist.main';
// import BloomreachSearchFacetNavigationMain from './bloomreach.searchfacetnavigation.main';

// import '../searchresultsitems.main.less';

import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};



interface BloomreachSearchResultsItemsMainProps {
    searchKeywordsProps: {
      [key: string]: any
    },
    onProductFacetSelection?: (...args: any[]) => any,
    productLinks?: {
      [key: string]: string
    }
  }
  
interface BloomreachSearchResultsItemsMainState {
    isLoading: boolean,
    searchResultsModel: {
      [key: string]: any
    },
    loadSortedProduct: boolean,
    searchKeywords: any
}

class BloomreachSearchResultsItemsMain extends React.Component<BloomreachSearchResultsItemsMainProps, BloomreachSearchResultsItemsMainState> {

  constructor(props) {
    super(props);
    const { searchKeywordsProps } = this.props;
    const epConfig = getConfig();
    Config = epConfig.config;
    this.state = {
      isLoading: true,
      searchResultsModel: {},
      loadSortedProduct: false,
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

    const searchKeyword = searchKeywordsProps.match.params;
    const searchQueryParams = searchKeywordsProps.location.search;

    // bloomreachKeywordSearchLookup(searchKeyword, searchQueryParams)
    //   .then((res) => {
    //     this.setState({
    //       isLoading: false,
    //       searchResultsModel: res,
    //       searchKeywords: searchKeyword,
    //       searchQueryParams,
    //     });
    //   })
    //   .catch((error) => {
    //     // eslint-disable-next-line no-console
    //     console.error(error.message);
    //   });
  }

  render() {
    const {
      isLoading,
      searchResultsModel,
      searchKeywords,
    } = this.state;
    const products = searchResultsModel.response ? searchResultsModel.response.docs : [];
    const facets = searchResultsModel.facet_counts ? searchResultsModel.facet_counts.facet_fields : searchResultsModel;
    const categoryMap = searchResultsModel.category_map;
    const propCompareButton = false;

    console.log('rendering bloomreach search results items');

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

            if (products.length === 0) {
              return (
                <h3>
                  {intl.get('no-products-found')}
                </h3>
              );
            }

            return (
              <div>
                {/* <BloomreachSearchFacetNavigationMain productData={facets} titleString={searchKeywords} currentFacets={searchQueryParams} categoryMap={categoryMap} /> */}
                <div className="products-container">
                  {/* <BloomreachProductListMain productData={products} showCompareButton={propCompareButton} /> */}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}

export default BloomreachSearchResultsItemsMain;
