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
import { login } from '../utils/AuthService';
import QuickOrderForm from '../QuickOrderForm/quickorderform';
import { cortexFetch } from '../utils/Cortex';
import { ClientContext } from '../ClientContext';

import './bulkorder.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};
let intl = { get: (str, ...args: any[]) => str };

interface BulkOrderProps {
  cartData?: {
    [key: string]: any
  },
  isBulkModalOpened: boolean,
  handleClose: (...args: any[]) => any
}

interface BulkOrderState {
  items: any[],
  bulkOrderItems: any[],
  defaultItemsCount: number,
  defaultItem: {
    code: string,
    quantity: number,
    product: {},
    isValidField: boolean,
    isDuplicated: boolean
  },
  isLoading: boolean,
  csvText: string,
  bulkOrderErrorMessage: string,
  quickOrderErrorMessage: string,
  bulkOrderDuplicatedErrorMessage: string
}

export class BulkOrder extends React.Component<BulkOrderProps, BulkOrderState> {
  static contextType = ClientContext;

  static defaultProps = {
    cartData: undefined,
  };

  client: cortex.IClient;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = getConfig());
    const defaultItem = {
      code: '', quantity: 1, product: {}, isValidField: false, isDuplicated: false,
    };
    const defaultItemsCount = 10;

    this.state = {
      items: Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })),
      bulkOrderItems: [],
      defaultItemsCount,
      defaultItem,
      isLoading: false,
      csvText: '',
      bulkOrderErrorMessage: '',
      quickOrderErrorMessage: '',
      bulkOrderDuplicatedErrorMessage: '',
    };
    this.addAllToCart = this.addAllToCart.bind(this);
    this.quickFormSubmit = this.quickFormSubmit.bind(this);
  }

  componentDidMount() {
    this.client = this.context;
  }

  async addAllToCart(orderItems, isQuickOrder) {
    if (!orderItems) return;
    const { cartData } = this.props;
    const { defaultItemsCount, defaultItem } = this.state;
    this.setState({ isLoading: true });
    const arrayItems = orderItems
      .filter(item => item.code !== '')
      .map(item => ({ code: item.code, quantity: item.quantity }));
    const body: { [key: string]: any } = {};
    if (arrayItems) {
      body.items = arrayItems;
    }
    try {
      const addItemsToCartFormRes = await cartData.additemstocartform({ body }).fetch({});
      this.setState({
        isLoading: false,
        items: Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })),
        csvText: '',
        bulkOrderErrorMessage: '',
        quickOrderErrorMessage: '',
        bulkOrderDuplicatedErrorMessage: '',
      });
    } catch (error) {
      const debugMessages = error.messages;
      if (isQuickOrder) {
        this.setState({
          isLoading: false,
          quickOrderErrorMessage: `${debugMessages}`,
        });
      } else {
        this.setState({
          isLoading: false,
          bulkOrderErrorMessage: `${debugMessages}`,
        });
      }
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }

  parseCsvText() {
    const { csvText } = this.state;
    const bulkOrderItems = csvText
      .split('\n')
      .filter(l => l.trim().length)
      .map(l => l.split(/[ ,;]+/))
      // eslint-disable-next-line no-restricted-globals, radix
      .map(p => ({ code: p[0] || '', quantity: isNaN(parseInt(p[1])) ? 1 : parseInt(p[1]) }));
    this.setState({ bulkOrderItems }, () => this.checkDuplication());
  }

  handleCsvChange(newCsvValue) {
    this.setState({ csvText: newCsvValue, bulkOrderErrorMessage: '', bulkOrderDuplicatedErrorMessage: '' }, () => this.parseCsvText());
  }

  quickFormSubmit(updatedItem, index) {
    const { items } = this.state;
    let duplicatedField = false;
    if (updatedItem.code !== '') {
      const itemIndex = items.findIndex(item => item.code === updatedItem.code);
      if (itemIndex !== index && itemIndex !== -1) {
        duplicatedField = true;
      }
    }
    const submittedItems = items.map((stateItem, i) => (index === i ? { ...stateItem, ...updatedItem, isDuplicated: duplicatedField } : stateItem));
    this.setState({
      items: submittedItems,
      bulkOrderErrorMessage: '',
      quickOrderErrorMessage: '',
    });
  }

  checkDuplication() {
    const { bulkOrderItems } = this.state;
    let isDuplicated = false;
    const arrayItems = bulkOrderItems.map(item => item.code).sort();
    const results = [];
    for (let i = 0; i < arrayItems.length - 1; i++) {
      if (arrayItems[i] !== '' && arrayItems[i + 1] === arrayItems[i]) {
        if (results.indexOf(arrayItems[i]) === -1) {
          results.push(arrayItems[i]);
        }
        isDuplicated = true;
      }
    }
    const SKUCodes = results.join(', ');
    if (isDuplicated) {
      this.setState({ bulkOrderDuplicatedErrorMessage: `${intl.get('duplicated-error-message', { SKUCodes })}` });
    }
  }

  render() {
    const { isBulkModalOpened, handleClose } = this.props;
    const {
      items,
      bulkOrderItems,
      csvText,
      isLoading,
      bulkOrderErrorMessage,
      quickOrderErrorMessage,
      bulkOrderDuplicatedErrorMessage,
    } = this.state;
    const isValid = Boolean(items.find(item => (item.code !== '' && item.isValidField === false)));
    const isEmpty = Boolean(items.find(item => (item.code !== '' && item.isValidField === true)));
    const duplicatedFields = Boolean(items.find(item => (item.code !== '' && item.isDuplicated === true)));
    const isDisabledButton = (!Config.b2b.enable || (isValid || !isEmpty || duplicatedFields));
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
                  id="add_to_cart_quick_order_button"
                  disabled={isDisabledButton}
                  type="submit"
                  onClick={() => { this.addAllToCart(items, true); }}
                >
                  {intl.get('add-all-to-cart')}
                </button>
                {
                  (isLoading) ? (<div className="miniLoader" />) : ''
                }
              </div>
              {
                (quickOrderErrorMessage !== '') ? (<div className="bulk-order-error-message"><p>{quickOrderErrorMessage}</p></div>) : ''
              }
              <div className="quickOrderRegion" data-region="quickOrderRegion">
                {items.map((item, i) => (
                  <QuickOrderForm item={item} key={item.key} onItemSubmit={updatedItem => this.quickFormSubmit(updatedItem, i)} />
                ))}
              </div>
            </div>
            <div className="tab-pane fade" id="bulk-order" role="tabpanel" aria-labelledby="bulk-order-tab">
              <div className="form-content form-content-submit col-sm-offset-4">
                <button
                  className="ep-btn primary small btn-itemdetail-addtocart"
                  id="add_to_cart_bulk_order_button"
                  type="submit"
                  disabled={!Config.b2b.enable || (!csvText || bulkOrderDuplicatedErrorMessage !== '' || bulkOrderErrorMessage !== '')}
                  onClick={() => { this.addAllToCart(bulkOrderItems, false); }}
                >
                  {intl.get('add-all-to-cart')}
                </button>
                {
                  (isLoading) ? (<div className="miniLoader" />) : ''
                }
              </div>
              {
                (bulkOrderErrorMessage !== '') ? (<div className="bulk-order-error-message"><p>{bulkOrderErrorMessage}</p></div>) : ''
              }
              {
                (bulkOrderDuplicatedErrorMessage !== '') ? (<div className="bulk-order-error-message"><p>{bulkOrderDuplicatedErrorMessage}</p></div>) : ''
              }
              <div className="tab-bulk-order" id="bulkOrderRegion" data-region="bulkOrderRegion">
                <p>{intl.get('enter-product-sku-and-quantity')}</p>
                <p>{intl.get('item-#1-qty')}</p>
                <p>{intl.get('item-#2-qty')}</p>
                <p className="bulk-text-area-title"><b>{intl.get('enter-product-sku-and-quantity-in-input')}</b></p>
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
