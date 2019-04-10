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
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { login } from '../utils/AuthService';
import QuickOrderForm from './quickorderform';
import { cortexFetch } from '../utils/Cortex';

import './bulkorder.main.less';

const Config = require('Config');

export class BulkOrder extends React.Component {
  static propTypes = {
    cartData: PropTypes.objectOf(PropTypes.any).isRequired,
    isBulkModalOpened: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const defaultItem = { code: '', quantity: 1, product: {} };
    const defaultItemsCount = 10;

    this.state = {
      items: Array(defaultItemsCount).fill(defaultItem),
      bulkOrderItems: {},
      defaultItemsCount,
      defaultItem,
      csvText: '',
    };
    this.addAllToCart = this.addAllToCart.bind(this);
    this.quickFormSubmit = this.quickFormSubmit.bind(this);
  }

  addAllToCart(orderItems) {
    const { cartData } = this.props;
    const { defaultItemsCount, defaultItem } = this.state;
    const arrayItems = orderItems
      .filter(item => item.code !== '')
      .map(item => ({ code: item.code, quantity: item.quantity }));
    login().then(() => {
      const addToCartLink = cartData._additemstocartform[0].links.find(link => link.rel === 'additemstocartaction');
      const body = {};
      if (arrayItems) {
        body.items = arrayItems;
      }
      cortexFetch(addToCartLink.uri,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify(body),
        })
        .then(() => {
          this.setState({
            items: Array(defaultItemsCount).fill(defaultItem),
            csvText: '',
          });
        })
        .catch((error) => {
          console.error(error.message);
        });
    });
  }

  parseCsvText() {
    const { csvText } = this.state;
    const bulkOrderItems = csvText
      .split('\n')
      .filter(l => l.trim().length)
      .map(l => l.split(/[ ,;]+/))
      // eslint-disable-next-line no-restricted-globals, radix
      .map(p => ({ code: p[0] || '', quantity: isNaN(parseInt(p[1])) ? 1 : parseInt(p[1]) }));
    this.setState({ bulkOrderItems });
  }

  handleCsvChange(newCsvValue) {
    this.setState({ csvText: newCsvValue }, () => this.parseCsvText());
  }

  quickFormSubmit(updatedItem, index) {
    const { defaultItem, items } = this.state;
    const submittedItems = items.map((stateItem, i) => (index === i ? { ...stateItem, ...updatedItem } : stateItem));
    const emptyItem = submittedItems.find(item => item.code === '');
    if (!emptyItem) submittedItems.push(defaultItem);
    this.setState({ items: submittedItems });
  }

  render() {
    const { isBulkModalOpened, handleClose } = this.props;
    const {
      items,
      bulkOrderItems,
      csvText,
    } = this.state;


    return (
      <div className={`bulk-order-component ${(isBulkModalOpened === false) ? 'hideModal' : ''}`}>
        <div role="presentation" className="bulk-order-close-button" onClick={() => { handleClose(); }}>
          <p className="bulk-order-hide">{intl.get('hide')}</p>
        </div>
        <div className="bulk-modal">
          <p className="view-title">{intl.get('order-form')}</p>
          <ul className="nav nav-tabs itemdetail-tabs" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="quick-order-tab" data-toggle="tab" href="#quick-order" role="tab" aria-selected="true">
                {intl.get('quick-order-title')}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="bulk-order-tab" data-toggle="tab" href="#bulk-order" role="tab" aria-selected="false">
                {intl.get('bulk-order-title')}
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="quick-order" role="tabpanel" aria-labelledby="quick-order-tab">
              <div className="form-content form-content-submit col-sm-offset-4">
                <button
                  className="ep-btn primary small btn-itemdetail-addtocart"
                  id="product_display_item_add_to_cart_button"
                  type="submit"
                  onClick={() => { this.addAllToCart(items); }}
                >
                  {intl.get('add-all-to-cart')}
                </button>
              </div>
              <div className="quickOrderRegion" data-region="quickOrderRegion">
                {items.map((item, i) => (
                  <QuickOrderForm item={item} index={i} onItemSubmit={updatedItem => this.quickFormSubmit(updatedItem, i)} />
                ))}
              </div>
            </div>
            <div className="tab-pane fade" id="bulk-order" role="tabpanel" aria-labelledby="bulk-order-tab">
              <div className="form-content form-content-submit col-sm-offset-4">
                <button
                  className="ep-btn primary small btn-itemdetail-addtocart"
                  id="product_display_item_add_to_cart_button"
                  type="submit"
                  onClick={() => { this.addAllToCart(bulkOrderItems); }}
                >
                  {intl.get('add-all-to-cart')}
                </button>
              </div>
              <div className="tab-bulk-order" id="bulkOrderRegion" data-region="bulkOrderRegion">
                <p>{intl.get('copy-and-paste-a-product-sku-and-quantity')}</p>
                <p>{intl.get('item-#1-qty')}</p>
                <p>{intl.get('item-#2-qty')}</p>
                <p className="bulk-text-area-title"><b>{intl.get('copy-and-paste-in-input-below')}</b></p>
                <textarea className="bulk-csv" rows={5} value={csvText} onChange={e => this.handleCsvChange(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BulkOrder;
