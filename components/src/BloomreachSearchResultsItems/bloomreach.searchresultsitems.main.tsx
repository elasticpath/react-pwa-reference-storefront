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
import { bloomreachKeywordSearchLookup } from '../utils/BloomreachSearchService';
import BloomreachProductListMain from '../BloomreachProductListMain/bloomreach.productlist.main';
import BloomreachSearchFacetNavigationMain from '../BloomreachSearchFacetNavigation/bloomreach.searchfacetnavigation.main';

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
    searchKeywords: any,
    searchQueryParams: any,
}

interface BloomreachKeywordSearchLookupResponse {
    response:     Response;
    facet_counts: FacetCounts;
    category_map: CategoryMap;
    did_you_mean: any[];
}

interface CategoryMap {
    VESTRI_BM_APPAREL:   string;
    VESTRI_APPAREL_MENS: string;
}

interface FacetCounts {
    facet_ranges:  Facet;
    facet_fields:  FacetFields;
    facet_queries: Facet;
}

interface FacetFields {
    category:     Category[];
    sizes:        AgeGroup[];
    brand:        any[];
    colors:       AgeGroup[];
    color_groups: any[];
    color:        AgeGroup[];
    gender:       AgeGroup[];
    material:     AgeGroup[];
    apparel_type: AgeGroup[];
    age_group:    AgeGroup[];
}

interface AgeGroup {
    count: number;
    name:  string;
}

interface Category {
    count:     number;
    crumb:     string;
    cat_name:  string;
    parent:    string;
    cat_id:    string;
    tree_path: string;
}

interface Facet {
}

interface Response {
    numFound: number;
    start:    number;
    docs:     Doc[];
}

interface Doc {
    sale_price:       number;
    price:            number;
    description:      string;
    title:            string;
    url:              string;
    brand:            string;
    pid:              string;
    thumb_image:      string;
    sale_price_range: number[];
    price_range:      number[];
    variants:         Variant[];
}

interface Variant {
    sku_swatch_images: string[];
    sku_thumb_images:  string[];
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
