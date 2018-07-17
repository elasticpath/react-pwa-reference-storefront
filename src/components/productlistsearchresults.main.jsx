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
import ProductListItemMain from './productlistitem.main';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArraySearchForm = [
  'searches:keywordsearchform',
];
const zoomArray = [
  'element',
  'element:availability',
  'element:definition',
  'element:definition:assets:element',
  'element:price',
  'element:rate',
  'element:code',
];

class ProductListSearchResultsMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResultsModel: {},
      searchResultsUrl: this.props.searchResultsUrl,
      searchKeywords: this.props.searchKeywords,
    };
  }

  componentDidMount() {
    this.getSearchData(this.props.searchKeywords);
  }

  componentDidUpdate(prevProps) {
    if (this.state.searchKeywords !== this.props.searchKeywords) {
      this.getSearchData(this.props.searchKeywords);
    }
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
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  getSearchData(event) {
    login().then(() => {
      fetch(Config.cortexApi.path + zoomArraySearchForm.join(),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          fetch(`${res._searches[0]._keywordsearchform.self.href}?followlocation`,
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
              this.props.history.push(`/search/${this.props.searchKeywords}`);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  renderProducts() {
    return this.state.searchResultsModel.links.map(product => (
      <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
        <ProductListItemMain productUrl={product.href} />
      </li>
    ));
  }

  render() {
    if (this.state.searchResultsModel.links) {
      return (
        <div className="category-items-container container">
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="view-title">
                {this.state.searchResultsModel['display-name']}
              </h1>
            </div>
          </div>
          <div data-region="categoryPaginationTopRegion" style={{ display: 'block' }}>
            <div className="pagination-container">
              <div className="paging-total-results">
                <span className="pagination-value pagination-total-results-value">
                  {this.state.searchResultsModel.pagination.results}
                </span>
                <label className="pagination-label pagination-total-results-label">
results
                </label>
            (
                {' '}
                <span className="pagination-value pagination-results-displayed-value">
                  {this.state.searchResultsModel.pagination['results-on-page']}
                </span>
                <label className="pagination-label">
results on page
                </label>
                {' '}
)

              </div>

              <div className="pagination-navigation-container">
                <a className="btn-pagination btn-pagination-prev pagination-link pagination-link-disabled" id="category_items_listing_pagination_previous_top_link" data-i18n="category.prev">
                  {' '}
                  <span className="icon" />
Previous
                </a>
                <span className="pagestate-summary">
                  <label className="pagination-label">
page
                  </label>
                  <span className="pagination-value pagination-curr-page-value">
                    {this.state.searchResultsModel.pagination.current}
                  </span>
                  <label className="pagination-label">
of
                  </label>
                  <span className="pagination-value pagination-total-pages-value">
                    {this.state.searchResultsModel.pagination.pages}
                  </span>

                </span>

                <a className="btn-pagination btn-pagination-next pagination-link pagination-link-disabled" id="category_items_listing_pagination_next_top_link" data-i18n="category.next">
Next
                  <span className="icon" />
                </a>
              </div>
            </div>
          </div>
          <div data-region="categoryBrowseRegion" style={{ display: 'block' }}>
            <ul className="category-items-listing equalize" id="category_search_results_items_listing">
              {this.renderProducts()}
            </ul>
          </div>
          <div data-region="categoryPaginationBottomRegion" style={{ display: 'block' }}>
            <div className="pagination-container">
              <div className="paging-total-results">
                <span className="pagination-value pagination-total-results-value">
                  {this.state.searchResultsModel.pagination.results}
                </span>
                <label className="pagination-label pagination-total-results-label">
results
                </label>
            (
                {' '}
                <span className="pagination-value pagination-results-displayed-value">
                  {this.state.searchResultsModel.pagination['results-on-page']}
                </span>
                <label className="pagination-label">
results on page
                </label>
                {' '}
)

              </div>

              <div className="pagination-navigation-container">
                <a className="btn-pagination btn-pagination-prev pagination-link pagination-link-disabled" id="category_items_listing_pagination_previous_bottom_link" data-i18n="category.prev">
                  {' '}
                  <span className="icon" />
Previous
                </a>
                <span className="pagestate-summary">
                  <label className="pagination-label">
page
                  </label>
                  <span className="pagination-value pagination-curr-page-value">
                    {this.state.searchResultsModel.pagination.current}
                  </span>
                  <label className="pagination-label">
of
                  </label>
                  <span className="pagination-value pagination-total-pages-value">
                    {this.state.searchResultsModel.pagination.pages}
                  </span>

                </span>

                <a className="btn-pagination btn-pagination-next pagination-link pagination-link-disabled" id="category_items_listing_pagination_next_bottom_link" data-i18n="category.next">
Next
                  <span className="icon" />
                </a>
              </div>
            </div>
          </div>
        </div>);
    }

    return (<div className="loader" />);
  }
}

export default ProductListSearchResultsMain;
