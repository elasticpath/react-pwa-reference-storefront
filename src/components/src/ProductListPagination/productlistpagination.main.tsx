
/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';

import './productlistpagination.less';

let paginationPreviousLinkVar = '';
let paginationNextLinkVar = '';
let searchUrlVar = true;

interface ProductListPaginationProps {
  /** pagination data */
  paginationDataProps: { [key: string]: any },
  /** title */
  titleString: string,
  /** is top */
  isTop?: boolean,
  /** product list pagination links */
  productListPaginationLinks?: { [key: string]: any },
}

interface ProductListPaginationState {
  paginationData: { [key: string]: any },
  paginationPreviousLink: string,
  paginationNextLink: string,
  searchUrl: boolean,
}

class ProductListPagination extends Component<ProductListPaginationProps, ProductListPaginationState> {
  static defaultProps = {
    isTop: false,
    productListPaginationLinks: {
      search: '',
      category: '',
    },
  }

  constructor(props) {
    super(props);

    const { paginationDataProps } = this.props;

    this.state = {
      paginationData: paginationDataProps,
      paginationPreviousLink: '',
      paginationNextLink: '',
      searchUrl: true,
    };
  }

  componentDidMount() {
    paginationPreviousLinkVar = '';
    paginationNextLinkVar = '';
    searchUrlVar = true;
    const { paginationData } = this.state;
    if (paginationData.self.type.includes('navigation')) {
      searchUrlVar = false;
    }
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
      searchUrl: searchUrlVar,
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
    const {
      paginationData, paginationNextLink, paginationPreviousLink, searchUrl,
    } = this.state;
    const { isTop, titleString, productListPaginationLinks } = this.props;
    const { productSearch, productCategory } = productListPaginationLinks;
    if (paginationData.pagination) {
      const urlPrefix = searchUrl ? productSearch : productCategory;
      return (
        <div className="product-list-pagination-component" data-region="categoryPaginationRegion">
          {
            isTop ? (
              <div className="total-results">
                <span className="total-results-value">
                  {intl.get('viewing')}
                  &nbsp;
                  {paginationData.pagination['results-on-page']}
                </span>
                &nbsp;
                <span className="results-displayed-value">
                  {intl.get('of')}
                  &nbsp;
                  {paginationData.pagination.results}
                  &nbsp;
                  {intl.get('products')}
                </span>
              </div>
            ) : ('')}
          {!isTop && (paginationNextLink !== '' || paginationPreviousLink !== '')
            ? (
              <div className="pagination-navigation-container">
                {paginationPreviousLink !== ''
                  ? (
                    <Link to={`${urlPrefix}/${titleString}${paginationPreviousLink}`} className="btn-pagination prev" role="button">
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
                {paginationNextLink !== ''
                  ? (
                    <Link to={`${urlPrefix}/${titleString}${paginationNextLink}`} className="btn-pagination next" role="button">
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
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProductListPagination;
