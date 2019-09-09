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
import React from 'react';
import * as cortex from '@elasticpath/cortex-client';
import { withRouter } from 'react-router';
import { getConfig } from '../utils/ConfigProvider';
import { ClientContext } from '../ClientContext';

import './productlistloadmore.less';

let intl = { get: str => str };

interface ProductListLoadMoreProps{
    dataProps: {
        [key: string]: any
    },
    handleDataChange: (...args: any[]) => any,
    itemsZoom: cortex.NavigationFetch
}
interface ProductListLoadMoreState {
    canLoadMore: boolean,
    isLoading: boolean,
}
class ProductListLoadMore extends React.Component<ProductListLoadMoreProps, ProductListLoadMoreState> {
  static contextType = ClientContext;

  constructor(props) {
    super(props);
    ({ intl } = getConfig());
    this.state = {
      canLoadMore: Boolean(props.dataProps.next),
      isLoading: false,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  client: cortex.IClient;

  componentWillReceiveProps(nextProps) {
    this.setState({ canLoadMore: Boolean(nextProps.dataProps.next) });
  }

  async loadMore() {
    const {
      dataProps, itemsZoom, handleDataChange,
    } = this.props;
    if (dataProps.next) {
      this.setState({ isLoading: true });
      try {
        const nextPage = await dataProps.next(itemsZoom);
        const { elements, pagination } = dataProps;
        const resultsOnPage = pagination.resultsOnPage + nextPage.pagination.resultsOnPage;
        const updatedPagination = { ...pagination, resultsOnPage };
        const updatedElements = [...elements, ...nextPage.elements];
        const updatedItems = {
          ...nextPage,
          elements: updatedElements,
          pagination: updatedPagination,
          next: nextPage.next,
        };
        handleDataChange(updatedItems);
        this.setState({ isLoading: false });
      } catch (error) {
        this.setState({ isLoading: false });
        // eslint-disable-next-line no-console
        console.error(error.message);
      }
    }
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

export default withRouter(ProductListLoadMore);
