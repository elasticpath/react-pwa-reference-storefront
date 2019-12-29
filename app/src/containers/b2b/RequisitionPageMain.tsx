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
import { B2bAddProductsModal } from '@elasticpath/store-components';

import './RequisitionPageMain.less';
import { ReactComponent as AngleLeftIcon } from '../../images/icons/outline-chevron_left-24px.svg';

interface RequisitionPageMainProps {
}
interface RequisitionPageMainState {
  isLoading: boolean,
  addProductModalOpened: boolean,
}

class RequisitionPageMain extends Component<RequisitionPageMainProps, RequisitionPageMainState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      addProductModalOpened: false,
    };
    this.handleAddProductsModalClose = this.handleAddProductsModalClose.bind(this);
    this.handleAddProductsModalOpen = this.handleAddProductsModalOpen.bind(this);
  }

  handleAddProductsModalClose() {
    this.setState({
      addProductModalOpened: false,
    });
  }

  handleAddProductsModalOpen() {
    const { addProductModalOpened } = this.state;
    this.setState({
      addProductModalOpened: !addProductModalOpened,
    });
  }

  render() {
    const { isLoading, addProductModalOpened } = this.state;
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
              <Link className="back-link" to="/b2b/requisition-lists">
                <AngleLeftIcon />
                {intl.get('back-to-lists')}
              </Link>
              <div className="name-container">
                <h2 className="name">
                  Vancouver
                </h2>
                <button type="button" className="edit-name">
                  {intl.get('edit')}
                </button>
              </div>
            </div>
            <div className="add-to-cart-dropdown-wrap">
              <button type="button" className="ep-btn primary add-to-list-button" onClick={this.handleAddProductsModalOpen}>
                {intl.get('add-products-to-list')}
              </button>
              <div className="add-to-cart-dropdown">
                <div className="dropdown-sort-field">
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {intl.get('add-to-cart-2')}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      {(products.list[0]) ? products.list.map(sortChoice => (
                        <li className="dropdown-item" key={sortChoice.name} id={`product_display_item_sku_option_${sortChoice.name}`} value={sortChoice.name}>
                          {sortChoice.name}
                        </li>
                      )) : ''}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {addProductModalOpened ? (
          <B2bAddProductsModal
            isBulkModalOpened={addProductModalOpened}
            handleClose={this.handleAddProductsModalClose}
          />
        ) : ''}
      </div>
    );
  }
}

export default RequisitionPageMain;
