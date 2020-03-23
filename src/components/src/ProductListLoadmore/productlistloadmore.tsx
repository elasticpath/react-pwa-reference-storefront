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
import { login } from '../utils/AuthService';

import './productlistloadmore.less';

interface ProductListLoadMoreProps{
  /** product data */
  dataProps: {
    [key: string]: any
  },
  /** handle product data change */
  handleDataChange: any,
  /** handle load more */
  onLoadMore: any,
}

interface ProductListLoadMoreState {
  canLoadMore: boolean,
  isLoading: boolean,
}

class ProductListLoadMore extends Component<ProductListLoadMoreProps, ProductListLoadMoreState> {
  constructor(props) {
    super(props);

    const nextLink = props.dataProps._next && props.dataProps._next[0];

    this.state = {
      canLoadMore: Boolean(nextLink),
      isLoading: false,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { dataProps } = nextProps;
    const nextLink = dataProps._next && dataProps._next[0];
    this.setState({ canLoadMore: Boolean(nextLink) });
  }

  loadMore() {
    const { dataProps, handleDataChange, onLoadMore } = this.props;
    this.setState({ isLoading: true });
    login().then(() => {
      const nextRel = dataProps._next[0].self;
      if (nextRel) {
        onLoadMore(nextRel.uri)
          .then((res) => {
            const { _element, links, pagination } = dataProps;
            const updatedLinks = links.filter(link => link.rel === 'element');
            const resultsOnPage = pagination['results-on-page'] + res.pagination['results-on-page'];
            const updatedPagination = pagination;
            updatedPagination['results-on-page'] = resultsOnPage;
            const updatedItems = {
              links: updatedLinks.concat(res.links),
              messages: res.messages,
              pagination: updatedPagination,
              self: res.self,
              _element: _element.concat(res._element),
              _sortattributes: res._sortattributes,
              _facets: res._facets,
              _next: res._next,
            };
            handleDataChange(updatedItems);
            this.setState({ isLoading: false });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      }
    });
  }

  render() {
    const { canLoadMore, isLoading } = this.state;
    const nextBtn = (
      <button className="ep-btn primary wide btn-load-more" type="button" onClick={() => { this.loadMore(); }}>
        {intl.get('load-more')}
      </button>
    );

    return [
      <div className="product-list-load-more-component" key="load-more">
        {canLoadMore && !isLoading ? nextBtn : ''}
        {isLoading ? (<div className="loader" />) : ''}
      </div>,
    ];
  }
}

export default ProductListLoadMore;
