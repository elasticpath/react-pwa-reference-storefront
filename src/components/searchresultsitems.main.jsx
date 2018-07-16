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
import { login } from '../utils/AuthService';
import ProductListMain from './productlist.main';
import ProductListPaginationTop from './productlistpaginationtop.main';
import ProductListPaginationBottom from './productlistpaginationbottom.main';

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

class SearchResultsItemsMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResultsModel: { links: [] },
      searchResultsUrl: this.props.searchResultsUrl,
      searchKeywords: this.props.searchKeywords,
    };
  }

  getSearchResults(searchResultsUrl) {
    login().then(() => {
      fetch(`${searchResultsUrl}?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            searchResultsUrl,
            searchResultsModel: res,
            searchKeywords: this.props.searchKeywords,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  getSearchData(event) {
    login().then(() => {
      fetch(`${Config.cortexApi.path}/searches/${Config.cortexApi.scope}/keywords/form?followlocation`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({
            keywords: this.props.searchKeywords,
          }),
        })
        .then(res => res.json())
        .then((res) => {
          this.getSearchResults(res.self.href);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  componentDidMount() {
    this.getSearchData(this.props.searchKeywords);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.searchKeywords !== nextProps.searchKeywords) {
      this.getSearchData(nextProps.searchKeywords);
    }
  }

  render() {
    if (this.state.searchResultsModel.links.length > 0 && this.state.searchKeywords == this.props.searchKeywords) {
      return (
        <div className="category-items-container container">
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="view-title">
Search Results
              </h1>
            </div>
          </div>
          <ProductListPaginationTop paginationData={this.state.searchResultsModel._items ? this.state.searchResultsModel._items[0] : this.state.searchResultsModel} />
          <ProductListMain productData={this.state.searchResultsModel._items ? this.state.searchResultsModel._items[0] : this.state.searchResultsModel} />
          <ProductListPaginationBottom paginationData={this.state.searchResultsModel._items ? this.state.searchResultsModel._items[0] : this.state.searchResultsModel} />
        </div>
      );
    }
    if (this.state.searchResultsModel.links.length == 0 && this.state.searchResultsModel.pagination && this.state.searchKeywords == this.props.searchKeywords) {
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
