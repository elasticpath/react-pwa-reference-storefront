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
import intl from 'react-intl-universal';
import { bloomreachKeywordSearchLookup } from '../utils/Bloomreach/BloomreachSearchService';
import BloomreachProductListMain from '../BloomreachProductListMain/bloomreach.productlist.main';
import BloomreachSearchFacetNavigationMain from '../BloomreachSearchFacetNavigation/bloomreach.searchfacetnavigation.main';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { BloomreachKeywordSearchLookupResponse, BloomreachSearchResultsItemsMainProps, BloomreachSearchResultsItemsMainState } from './types/bloomreach.searchresultsitems.main';

let Config: IEpConfig | any = {};

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
      searchQueryParams: null,
    };

    this.onFacetSelected = this.onFacetSelected.bind(this);
  }

  componentDidMount() {
    const { searchKeywordsProps } = this.props;
    this.getSearchData(searchKeywordsProps, undefined);
  }

  componentWillReceiveProps(nextProps) {
    const { searchKeywordsProps } = nextProps;
    this.getSearchData(searchKeywordsProps, undefined);
  }

  async getSearchData(searchKeywordsProps, searchQueryParams) {
    this.setState({
      isLoading: true,
      searchKeywords: searchKeywordsProps,
    });

    const searchKeyword = searchKeywordsProps.match.params;
    const queryParams = (searchQueryParams == undefined) ? searchKeywordsProps.location.search : searchQueryParams;
    
    const res: BloomreachKeywordSearchLookupResponse = await bloomreachKeywordSearchLookup(searchKeyword, queryParams);

    this.setState({
        isLoading: false,
        searchResultsModel: res,
        searchKeywords: searchKeyword,
    });
  }

  onFacetSelected(queryParams) {
    const { searchKeywordsProps } = this.props;
    this.getSearchData(searchKeywordsProps, window.location.search);
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
                <BloomreachSearchFacetNavigationMain productData={facets} titleString={searchKeywords} categoryMap={categoryMap} onFacetSelected={this.onFacetSelected}/>
                <div className="products-container">
                  <BloomreachProductListMain productData={products} showCompareButton={propCompareButton} />
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
