/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { login } from '../utils/AuthService';
import ProductListMain from './productlist.main';
import ProductListPaginationTop from './productlistpaginationtop.main';
import ProductListPaginationBottom from './productlistpaginationbottom.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'element',
  'element:availability',
  'element:definition',
  'element:definition:assets:element',
  'element:price',
  'element:rate',
  'element:code',
];

let searchForm;

class SearchResultsItemsMain extends React.Component {
  static propTypes = {
    searchKeywordsProps: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const { searchKeywordsProps } = this.props;
    this.state = {
      searchResultsModel: { links: [] },
      searchKeywords: searchKeywordsProps,
    };
  }

  componentDidMount() {
    const { searchKeywordsProps } = this.props;
    this.getSearchData(searchKeywordsProps);
  }

  componentWillReceiveProps(nextProps) {
    const { searchKeywords } = this.state;
    if (searchKeywords !== nextProps.searchKeywordsProps) {
      this.getSearchData(nextProps.searchKeywordsProps);
    }
  }

  getSearchData() {
    const { searchKeywordsProps } = this.props;
    login().then(() => {
      cortexFetch(`${Config.cortexApi.path}/?zoom=searches:keywordsearchform`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          searchForm = res._searches[0]._keywordsearchform[0].links.find(link => link.rel === 'itemkeywordsearchaction').href;
        }).then(() => {
          cortexFetch(`${searchForm}?zoom=${zoomArray.join()}&followlocation`,
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
              body: JSON.stringify({
                keywords: searchKeywordsProps,
              }),
            })
            .then(res => res.json())
            .then((res) => {
              this.setState({
                searchResultsModel: res,
                searchKeywords: searchKeywordsProps,
              });
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error);
            });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  render() {
    const { searchKeywordsProps } = this.props;
    const { searchResultsModel, searchKeywords } = this.state;
    if (searchResultsModel.links.length > 0 && searchKeywords === searchKeywordsProps) {
      return (
        <div className="category-items-container container">
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="view-title">
                Search Results
              </h1>
            </div>
          </div>
          <ProductListPaginationTop paginationDataProps={searchResultsModel._items ? searchResultsModel._items[0] : searchResultsModel} />
          <ProductListMain productData={searchResultsModel._items ? searchResultsModel._items[0] : searchResultsModel} />
          <ProductListPaginationBottom paginationDataProps={searchResultsModel._items ? searchResultsModel._items[0] : searchResultsModel} />
        </div>
      );
    }
    if (searchResultsModel.links.length === 0 && searchResultsModel.pagination && searchKeywords === searchKeywordsProps) {
      return (
        <div className="category-items-container container">
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="view-title">
                Search Results
              </h1>
            </div>
          </div>
          <br />
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h3>
                No results found
              </h3>
            </div>
          </div>
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default SearchResultsItemsMain;
