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
import { withRouter } from 'react-router';
import Modal from 'react-responsive-modal';
import CartLineItem from './cart.lineitem';
import './reorder.main.less';

class ReorderMain extends React.Component {
  static propTypes = {
    productsData: PropTypes.objectOf(PropTypes.any),
  };

  static defaultProps = {
    productsData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };

    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
  }

  reorderAll(items) {
    const bulkOrderItems = items.map(item => ({
      sku: item._item[0]._code[0].code,
      quantity: item.quantity,
    }));
    console.warn(bulkOrderItems, this);
  }

  handleModalOpen() {
    this.setState({ openModal: true });
  }

  handleModalClose() {
    this.setState({ openModal: false });
  }

  render() {
    const { openModal } = this.state;
    const { productsData } = this.props;

    return (
      <div>
        <button className="ep-btn reorder-btn" type="button" onClick={this.handleModalOpen}>
          {intl.get('reorder')}
        </button>
        <Modal open={openModal} onClose={this.handleModalClose} classNames={{ modal: 'buy-it-again-modal-content' }}>
          <div id="buy-it-again-modal">
            <div className="modal-content" id="simplemodal-container">
              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('buy-it-again')}
                </h2>
              </div>
              {productsData._lineitems[0]._element.map((item) => {
                const { quantity, _code } = item._item[0];
                return (
                  <CartLineItem
                    key={_code[0].code}
                    item={item._item[0]}
                    itemQuantity={quantity}
                    hideAddToBagButton
                    handleQuantityChange={() => { }}
                    hideRemoveButton
                    handleErrorMessage={(e) => { console.warn(e); }}
                  />
                );
              })}
            </div>
            <button
              className="ep-btn reorder-btn"
              type="button"
              onClick={() => { this.reorderAll(productsData._lineitems[0]._element); }}
            >
              {intl.get('reorder')}
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(ReorderMain);
