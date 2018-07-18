
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
import { Link } from 'react-router-dom';

let paginationPreviousLinkVar = '';
let paginationNextLinkVar = '';

class ProductListPaginationBottom extends React.Component {
  static propTypes = {
    paginationDataProps: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    const { paginationDataProps } = this.props;
    this.state = {
      paginationData: paginationDataProps,
      paginationPreviousLink: '',
      paginationNextLink: '',
    };
  }

  componentDidMount() {
    paginationPreviousLinkVar = '';
    paginationNextLinkVar = '';
    const { paginationData } = this.state;
    for (let i = 0; i < paginationData.links.length; i++) {
      if (paginationData.links[i].rel === 'previous') {
        paginationPreviousLinkVar = paginationData.links[i].uri;
      }
      if (paginationData.links[i].rel === 'next') {
        paginationNextLinkVar = paginationData.links[i].uri;
      }
    }
    this.setState({
      paginationPreviousLink: paginationPreviousLinkVar,
      paginationNextLink: paginationNextLinkVar,
    });
  }

  componentWillReceiveProps(nextProps) {
    paginationPreviousLinkVar = '';
    paginationNextLinkVar = '';
    for (let i = 0; i < nextProps.paginationDataProps.links.length; i++) {
      if (nextProps.paginationDataProps.links[i].rel === 'previous') {
        paginationPreviousLinkVar = nextProps.paginationDataProps.links[i].uri;
      }
      if (nextProps.paginationDataProps.links[i].rel === 'next') {
        paginationNextLinkVar = nextProps.paginationDataProps.links[i].uri;
      }
    }
    this.setState({
      paginationData: nextProps.paginationDataProps,
      paginationPreviousLink: paginationPreviousLinkVar,
      paginationNextLink: paginationNextLinkVar,
    });
  }

  render() {
    const { paginationData, paginationNextLink, paginationPreviousLink } = this.state;
    if (paginationData.links.length > 0) {
      return (
        <div data-region="categoryPaginationBottomRegion" style={{ display: 'block' }}>
          <div className="pagination-container">
            <div className="paging-total-results">
              <span className="pagination-value pagination-total-results-value">
                {paginationData.pagination.results}
              </span>
              <label htmlFor="pagination_total_results_label" className="pagination-label pagination-total-results-label">
                &nbsp;results&nbsp;
              </label>
              (&nbsp;
              <span className="pagination-value pagination-results-displayed-value">
                {paginationData.pagination['results-on-page']}
              </span>
              <label htmlFor="pagination_label" className="pagination-label">
                &nbsp;results on page
              </label>
              {' '}
              )
            </div>
            {paginationNextLink !== '' || paginationPreviousLink !== ''
              ? (
                <div className="pagination-navigation-container">
                  {paginationPreviousLink !== ''
                    ? (
                      <Link to={`/category/${encodeURIComponent(paginationPreviousLink)}`} className="btn-pagination btn-pagination-prev pagination-link pagination-link-disabled" id="category_items_listing_pagination_previous_bottom_link" role="button">
                        <span className="icon" />
                        Previous
                      </Link>
                    )
                    : ('')}
                  <span className="pagestate-summary">
                    <label htmlFor="pagination_curr_page_label" className="pagination-label">
                      page&nbsp;
                    </label>
                    <span className="pagination-value pagination-curr-page-value">
                      {paginationData.pagination.current}
                    </span>
                    <label htmlFor="pagination_total_pages_label" className="pagination-label">
                      &nbsp;of&nbsp;
                    </label>
                    <span className="pagination-value pagination-total-pages-value">
                      {paginationData.pagination.pages}
                    </span>
                  </span>
                  {paginationNextLink !== ''
                    ? (
                      <Link to={`/category/${encodeURIComponent(paginationNextLink)}`} className="btn-pagination btn-pagination-next pagination-link pagination-link-disabled" id="category_items_listing_pagination_next_bottom_link" role="button">
                        Next
                        <span className="icon" />
                      </Link>
                    )
                    : ('')}
                </div>
              )
              : ('')}
          </div>
        </div>);
    }

    return (<div className="loader" />);
  }
}

export default ProductListPaginationBottom;
