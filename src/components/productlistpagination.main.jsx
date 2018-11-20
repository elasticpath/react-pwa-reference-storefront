
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

import './productlistpagination.less';

let paginationPreviousLinkVar = '';
let paginationNextLinkVar = '';
let searchUrlVar = false;

class ProductListPagination extends React.Component {
  static propTypes = {
    paginationDataProps: PropTypes.objectOf(PropTypes.any).isRequired,
    searchKeywordsProps: PropTypes.string,
    isTop: PropTypes.bool,
  }

  static defaultProps = {
    isTop: false,
    searchKeywordsProps: '',
  }

  constructor(props) {
    super(props);
    const { paginationDataProps } = this.props;
    this.state = {
      paginationData: paginationDataProps,
      paginationPreviousLink: '',
      paginationNextLink: '',
      searchUrl: false,
    };
  }

  componentDidMount() {
    paginationPreviousLinkVar = '';
    paginationNextLinkVar = '';
    searchUrlVar = false;
    const { paginationData } = this.state;
    console.log(paginationData)
    if (paginationData.self.type.includes('searches')) {
      searchUrlVar = true;
    }
    for (let i = 0; i < paginationData.links.length; i++) {
      if (paginationData.links[i].rel === 'previous') {
        const paginationSplit = paginationData.links[i].uri.split('/');
        paginationPreviousLinkVar = paginationSplit[paginationSplit.length - 1];
      }
      if (paginationData.links[i].rel === 'next') {
        const paginationSplit = paginationData.links[i].uri.split('/');
        paginationNextLinkVar = paginationSplit[paginationSplit.length - 1];
        console.log(paginationNextLinkVar)
      }
    }
    this.setState({
      paginationPreviousLink: paginationPreviousLinkVar,
      paginationNextLink: paginationNextLinkVar,
      searchUrl: searchUrlVar,
    });
  }

  componentWillReceiveProps(nextProps) {
    paginationPreviousLinkVar = '';
    paginationNextLinkVar = '';
    console.log(nextProps)
    for (let i = 0; i < nextProps.paginationDataProps.links.length; i++) {
      if (nextProps.paginationDataProps.links[i].rel === 'previous') {
        const paginationSplit = nextProps.paginationDataProps.links[i].uri.split('/');
        paginationPreviousLinkVar = paginationSplit[paginationSplit.length - 1];
      }
      if (nextProps.paginationDataProps.links[i].rel === 'next') {
        const paginationSplit = nextProps.paginationDataProps.links[i].uri.split('/');
        paginationNextLinkVar = paginationSplit[paginationSplit.length - 1];
      }
    }
    this.setState({
      paginationData: nextProps.paginationDataProps,
      paginationPreviousLink: paginationPreviousLinkVar,
      paginationNextLink: paginationNextLinkVar,
    });
  }

  render() {
    const {
      paginationData, paginationNextLink, paginationPreviousLink, searchUrl,
    } = this.state;
    const { isTop, searchKeywordsProps } = this.props;
    let searchKeywordsPropsUrl = '';
    let paginationFullUrl = false;
    let paginationNextLinkNewVar = paginationNextLink;
    let paginationPreviousLinkNewVar = paginationPreviousLink;
    if (searchKeywordsProps !== '') {
      searchKeywordsPropsUrl = searchKeywordsProps.concat('/');
    }
    console.log(searchKeywordsProps)
    if (searchKeywordsProps.includes('/')) {
      searchKeywordsPropsUrl = encodeURIComponent(searchKeywordsProps);
      paginationFullUrl = true;
      paginationNextLinkNewVar = '';
      paginationPreviousLinkNewVar = '';
    }
    if (paginationData.links.length > 0) {
      const urlPrefix = (searchUrl) ? ('search') : ('category');
      return (
        <div className="product-list-pagination-component" data-region="categoryPaginationRegion" style={{ display: 'block' }}>
          {
            isTop ? (
              <div className="total-results">
                <span className="total-results-value">
                  {paginationData.pagination.results}
                  &nbsp;
                  {intl.get('results')}
                </span>
                &nbsp;
                <span className="results-displayed-value">
                  (
                  {paginationData.pagination['results-on-page']}
                  &nbsp;
                  {intl.get('results-on-page')}
                  )
                </span>
              </div>
            ) : ('')}
          {!isTop && (paginationNextLinkNewVar !== '' || paginationPreviousLinkNewVar !== '' || paginationFullUrl)
            ? (
              <div className="pagination-navigation-container">
                {paginationPreviousLinkNewVar !== ''
                  ? (
                    <Link to={`/${urlPrefix}/${searchKeywordsPropsUrl}${encodeURIComponent(paginationPreviousLinkNewVar)}`} className="btn-pagination prev" role="button">
                      <span className="icon" />
                      {intl.get('previous')}
                    </Link>
                  )
                  : (
                    <div className="btn-pagination prev hide" />
                  )}
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
                {paginationNextLinkNewVar !== '' || paginationFullUrl
                  ? (
                    <Link to={`/${urlPrefix}/${searchKeywordsPropsUrl}${encodeURIComponent(paginationNextLinkNewVar)}`} className="btn-pagination next" role="button">
                      {intl.get('next')}
                      <span className="icon" />
                    </Link>
                  )
                  : (
                    <div className="btn-pagination next hide" />
                  )}
              </div>
            )
            : ('')}
        </div>);
    }

    return (<div className="loader" />);
  }
}

export default ProductListPagination;
