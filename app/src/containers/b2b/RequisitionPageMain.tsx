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
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';

import './RequisitionPageMain.less';

interface RequisitionPageMainProps {
}
interface RequisitionPageMainState {
  isLoading: boolean,
}

class RequisitionPageMain extends Component<RequisitionPageMainProps, RequisitionPageMainState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  render() {
    const { isLoading } = this.state;
    const products = {
      list: [
        { name: 'January 2020' }, { name: 'February 2020' }, { name: 'March 2020' }, { name: 'April 2020' }, { name: 'May 2020' }, { name: 'June 2020' }, { name: 'July 2020' }, { name: 'August 2020' }, { name: 'September 2020' }, { name: 'October 2020' }, { name: 'November 2020' }, { name: 'December 2020' },
      ],
    };
    return (
      <div className="requisition-component">
        {isLoading ? (
          <div className="loader" />
        ) : (
          <div>
            <div className="requisition-header">
              <Link className="back-link" to="/b2b">
                <div className="back-arrow" />
                {intl.get('back-to-lists')}
              </Link>
              <div className="name-container">
                <Link className="back-link-mobile" to="/b2b">
                  <div className="back-arrow" />
                  {intl.get('back-to-lists')}
                </Link>
                <div className="name">
                  Vancouver
                </div>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link to="#" href="/" className="edit-name">
                  {intl.get('edit')}
                </Link>
              </div>
            </div>
            <div className="header-container">
              <button type="button" className="ep-btn primary wide add-to-list-button">Add product to list</button>
              <div className="add-to-cart-dropdown">
                <div className="dropdown-sort-field">
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {intl.get('add-to-cart-2')}
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      {(products.list[0]) ? products.list.map(sortChoice => (
                        <button type="button" className="dropdown-item" key={sortChoice.name} id={`product_display_item_sku_option_${sortChoice.name}`} value={sortChoice.name}>
                          {sortChoice.name}
                        </button>
                      )) : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RequisitionPageMain;
