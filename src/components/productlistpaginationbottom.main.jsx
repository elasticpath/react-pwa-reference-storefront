
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
                &nbsp;
                {intl.get('results')}
                &nbsp;
              </label>
              (&nbsp;
              <span className="pagination-value pagination-results-displayed-value">
                {paginationData.pagination['results-on-page']}
              </span>
              <label htmlFor="pagination_label" className="pagination-label">
                &nbsp;
                {intl.get('results-on-page')}
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
                        {intl.get('previous')}
                      </Link>
                    )
                    : ('')}
                  <span className="pagestate-summary">
                    <label htmlFor="pagination_curr_page_label" className="pagination-label">
                      {intl.get('page')}
                      &nbsp;
                    </label>
                    <span className="pagination-value pagination-curr-page-value">
                      {paginationData.pagination.current}
                    </span>
                    <label htmlFor="pagination_total_pages_label" className="pagination-label">
                      &nbsp;
                      {intl.get('of')}
                      &nbsp;
                    </label>
                    <span className="pagination-value pagination-total-pages-value">
                      {paginationData.pagination.pages}
                    </span>
                  </span>
                  {paginationNextLink !== ''
                    ? (
                      <Link to={`/category/${encodeURIComponent(paginationNextLink)}`} className="btn-pagination btn-pagination-next pagination-link pagination-link-disabled" id="category_items_listing_pagination_next_bottom_link" role="button">
                        {intl.get('next')}
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
