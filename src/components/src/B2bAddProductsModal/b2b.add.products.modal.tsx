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
import QuickOrderForm from '../QuickOrderForm/quickorderform';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './b2b.add.products.modal.less';
// eslint-disable-next-line import/order
import Modal from 'react-responsive-modal';

let Config: IEpConfig | any = {};

interface AddProductsModalProps {
  /** cart data */
  cartData?: {
    [key: string]: any
  },
  /** is bulk modal opened */
  isBulkModalOpened: boolean,
  /** handle close */
  handleClose: (...args: any[]) => any,
  /** Uri for Adding Items To Item List */
  addItemsToItemListUri: string,
  /** Updating products list on adding items */
  onAddItem: any,
}

interface AddProductsModalState {
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
  bulkOrderDuplicatedErrorMessage: string,
  isFormTab: boolean,
}

class AddProductsModal extends Component<AddProductsModalProps, AddProductsModalState> {
  static defaultProps = {
    cartData: undefined,
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    const defaultItem = {
      code: '', quantity: 1, product: {}, isValidField: false, isDuplicated: false,
    };

    const defaultItemsCount = 5;

    this.state = {
      items: Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })),
      bulkOrderItems: [],
      defaultItemsCount,
      defaultItem,
      isLoading: false,
      csvText: '',
      bulkOrderErrorMessage: '',
      bulkOrderDuplicatedErrorMessage: '',
      isFormTab: true,
    };

    this.addAllToList = this.addAllToList.bind(this);
    this.handleBulkTab = this.handleBulkTab.bind(this);
    this.handleFormTab = this.handleFormTab.bind(this);
    this.quickFormSubmit = this.quickFormSubmit.bind(this);
    this.addMoreLine = this.addMoreLine.bind(this);
  }

  addAllToList() {
    const { addItemsToItemListUri, onAddItem } = this.props;
    const {
      items, bulkOrderItems, isFormTab, defaultItem, defaultItemsCount,
    } = this.state;
    const dataItems = isFormTab ? items : bulkOrderItems;
    this.setState({ isLoading: true });
    const arrayItems = dataItems
      .filter(item => item.code !== '')
      .map(item => ({ code: item.code, quantity: item.quantity }));
    let totalQuantity = 0;
    arrayItems.forEach((item) => {
      totalQuantity += item.quantity;
    });
    login().then(() => {
      const body: { [key: string]: any } = {};
      if (arrayItems) {
        body.items = arrayItems;
      }
      cortexFetch(addItemsToItemListUri,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify(body),
        })
        .then((res) => {
          if (res.status === 201) {
            onAddItem(true);
            this.setState({
              isLoading: false,
              items: Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })),
              csvText: '',
              bulkOrderErrorMessage: '',
              bulkOrderDuplicatedErrorMessage: '',
            });
          }
          if (res.status >= 400) {
            let debugMessages = '';
            res.json().then((json) => {
              for (let i = 0; i < json.messages.length; i++) {
                debugMessages = debugMessages.concat(`\n${json.messages[i]['debug-message']} \n `);
              }
            }).then(() => {
              if (isFormTab) {
                this.setState({
                  isLoading: false,
                });
              } else {
                this.setState({
                  isLoading: false,
                  bulkOrderErrorMessage: `${debugMessages}`,
                });
              }
            });
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          // eslint-disable-next-line no-console
          console.error('error.message:', error.message);
        });
    });
  }

  handleBulkTab() {
    this.setState({
      isFormTab: false,
    });
  }

  handleFormTab() {
    this.setState({
      isFormTab: true,
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
    });
  }

  addMoreLine() {
    const { items, defaultItem } = this.state;
    const incrementItems = [...items, defaultItem];
    this.setState({
      items: incrementItems,
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
      csvText,
      isLoading,
      bulkOrderErrorMessage,
      bulkOrderDuplicatedErrorMessage,
      isFormTab,
    } = this.state;

    const isAddProducts = true;
    const isValid = Boolean(items.find(item => (item.code !== '' && item.isValidField === false)));
    const isEmpty = Boolean(items.find(item => (item.code !== '' && item.isValidField === true)));
    const duplicatedFields = Boolean(items.find(item => (item.code !== '' && item.isDuplicated === true)));
    const quickOrderDisabledButton = (!Config.b2b.enable || (isValid || !isEmpty || duplicatedFields));
    const bulkOrderDisabledButton = !Config.b2b.enable || (!csvText || bulkOrderDuplicatedErrorMessage !== '' || bulkOrderErrorMessage !== '');
    return (
      <Modal open={isBulkModalOpened || false} onClose={handleClose} classNames={{ modal: 'add-product-to-list-modal' }}>
        <div className="add-products-component">
          <div className="add-product-modal">
            <p className="view-title">{intl.get('add-products-to-list')}</p>
            <ul className="nav nav-tabs itemdetail-tabs" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="item-form-tab" data-toggle="tab" href="#item-form" role="tab" onClick={this.handleFormTab} aria-selected={isFormTab}>
                  {intl.get('add-by-form')}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="copy-paste-tab" data-toggle="tab" href="#copy-paste" role="tab" onClick={this.handleBulkTab} aria-selected={!isFormTab}>
                  {intl.get('add-by-copy-paste')}
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="item-form" role="tabpanel" aria-labelledby="item-form-tab">
                <div className="itemFormRegion" data-region="itemFormRegion">
                  {items.map((item, i) => (
                    <QuickOrderForm item={item} isAddProducts={isAddProducts} key={item.key} onItemSubmit={updatedItem => this.quickFormSubmit(updatedItem, i)} />
                  ))}
                </div>
                <div className="add-more-lines-button-wrap">
                  <button type="button" className="add-more-lines-button" onClick={this.addMoreLine}>
                    {intl.get('add-more-lines')}
                  </button>
                </div>
              </div>
              <div className="tab-pane fade" id="copy-paste" role="tabpanel" aria-labelledby="copy-paste-tab">
                {
                (bulkOrderDuplicatedErrorMessage !== '') ? (<div className="bulk-order-error-message">{bulkOrderDuplicatedErrorMessage}</div>) : ''
                }
                <div className="tab-bulk-order" id="bulkOrderRegion" data-region="bulkOrderRegion">
                  <p>{intl.get('enter-product-sku-and-quantity')}</p>
                  <div className="bulk-items-example">
                    <p>{intl.get('item-#1-qty')}</p>
                    <p>{intl.get('item-#2-qty')}</p>
                  </div>
                  <p className="bulk-text-area-title"><b>{intl.get('enter-product-sku-and-quantity-in-input')}</b></p>
                  <textarea className="bulk-csv" rows={5} value={csvText} onChange={e => this.handleCsvChange(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
          <div className="dialog-footer">
            <button className="cancel" type="button" onClick={handleClose}>{intl.get('cancel')}</button>
            <button className="save-btn" type="submit" disabled={isFormTab ? quickOrderDisabledButton : bulkOrderDisabledButton} onClick={this.addAllToList}>
              {isLoading ? (
                <div className="miniLoader" />
              ) : (
                <span>
                  {intl.get('add-products-to-list')}
                </span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AddProductsModal;
