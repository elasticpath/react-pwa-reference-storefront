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
import intl from 'react-intl-universal';
import { ReactComponent as ArrowLeft } from '../../../images/icons/arrow_left.svg';
import './pagination.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { cortexFetch } from '../../../utils/Cortex';

let Config: IEpConfig | any = {};

interface SelfUri {
  self: {
    uri: string;
  }
}

interface PaginationProps {
  /** pagination object */
  pagination: {
    current: number;
    'page-size': number;
    pages: number;
    results: number;
    'results-on-page': number;
  },
  /** previous page data */
  previous?: SelfUri[] | undefined;
  /** next page data */
  next?: SelfUri[] | undefined;
  /** on page change */
  onPageChange: (pageRequest) => any;
  /** show items count */
  showItemsCount?: boolean;
  /** zoom array */
  zoom?: string[];
}

function Pagination(props: PaginationProps) {
  const {
    pagination, next, previous, onPageChange, showItemsCount, zoom,
  } = props;
  Config = getConfig().config;
  const pageStart = pagination['page-size'] * (pagination.current - 1);

  const handlePagination = (page) => {
    const listUri = page[0].self.uri;
    const pageRequest = cortexFetch(`${listUri}?zoom=${zoom.sort().join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    });
    onPageChange(pageRequest);
  };

  return (
    <div className="pagination">
      {showItemsCount && (<span className="pagination-txt">{intl.get('pagination-item-count', { range: `${pageStart || 1} - ${pageStart + pagination['results-on-page']}`, allItems: pagination.results })}</span>)}
      <div className="pagination-btn-wrap">
        <button type="button" className="pagination-btn prev-btn" onClick={() => { handlePagination(previous); }} disabled={!previous}>
          <ArrowLeft className="arrow-left-icon" />
        </button>
        <span className="pagination-txt">
          {intl.get('pagination-message', { current: pagination.current, pages: pagination.pages })}
        </span>
        <button type="button" className="pagination-btn next-btn" onClick={() => { handlePagination(next); }} disabled={!next}>
          <ArrowLeft className="arrow-left-icon" />
        </button>
      </div>
    </div>);
}

Pagination.defaultProps = {
  previous: undefined,
  next: undefined,
  showItemsCount: true,
  zoom: [],
};

export default Pagination;
