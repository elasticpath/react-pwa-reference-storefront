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
import Papa from 'papaparse';
import BarcodeScanner from '../BarcodeScanner/barcodescanner';
import { login } from '../utils/AuthService';
import { cortexFetchItemLookupForm, itemLookup, searchLookup } from '../utils/CortexLookup';
import QuickOrderForm from '../QuickOrderForm/quickorderform';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './bulkorder.main.less';

let Config: IEpConfig | any = {};
let intl = { get: (str, ...args: any[]) => str };

interface BulkOrderProps {
  cartData?: {
    [key: string]: any
  },
  isBulkModalOpened: boolean,
  handleClose: (...args: any[]) => any,
  onUpdate: (...args: any[]) => any
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
  bulkOrderDuplicatedErrorMessage: string,
  isBarcodeScannerOpen: boolean
  isBarcodeScannerLoading: boolean
  barcodeScannerError: string
}

export class BulkOrder extends React.Component<BulkOrderProps, BulkOrderState> {
  static defaultProps = {
    cartData: undefined,
  };

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
      isBarcodeScannerOpen: false,
      isBarcodeScannerLoading: false,
      barcodeScannerError: '',
    };
    this.addAllToCart = this.addAllToCart.bind(this);
    this.quickFormSubmit = this.quickFormSubmit.bind(this);
    this.handleBarcodeClick = this.handleBarcodeClick.bind(this);
    this.handleBarcodeModalClose = this.handleBarcodeModalClose.bind(this);
    this.handleBarcodeScanned = this.handleBarcodeScanned.bind(this);
  }

  addAllToCart(orderItems, isQuickOrder, isBatchAddToCart) {
    if (!orderItems) return; // "\f02a"
    const { cartData, onUpdate } = this.props;
    const { defaultItemsCount, defaultItem } = this.state;
    this.setState({ isLoading: true });
    const arrayItems = orderItems
      .filter(item => item.code !== '')
      .map(item => ({ code: item.code, quantity: item.quantity, configuration: item.configuration }));
    login().then(() => {
      const addToCartLink = cartData._additemstocartform[0].links.find(link => link.rel === 'additemstocartaction');
      const body: { [key: string]: any } = {};
      if (arrayItems) {
        if (isBatchAddToCart) {
          body['configurable-items'] = arrayItems;
        } else {
          body.items = arrayItems;
        }
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
        .then((res) => {
          if (res.status === 201) {
            this.setState({
              isLoading: false,
              items: Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })),
              csvText: '',
              bulkOrderErrorMessage: '',
              quickOrderErrorMessage: '',
              bulkOrderDuplicatedErrorMessage: '',
            });
            onUpdate();
          }
          if (res.status >= 400) {
            let debugMessages = '';
            res.json().then((json) => {
              for (let i = 0; i < json.messages.length; i++) {
                debugMessages = debugMessages.concat(`\n${json.messages[i]['debug-message']} \n `);
              }
            }).then(() => {
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

  handleBarcodeClick() {
    this.setState({ isBarcodeScannerOpen: true });
  }

  handleBarcodeModalClose() {
    this.setState({ isBarcodeScannerOpen: false });
  }

  handleBarcodeScanned(barcode) {
    this.setState({ isBarcodeScannerLoading: true, barcodeScannerError: '' });
    login().then(() => {
      searchLookup(barcode)
        .then((res) => {
          const foundItem = res._element[0];
          const { code } = foundItem._items[0]._element[0]._code[0];
          cortexFetchItemLookupForm()
            .then(() => itemLookup(code, false))
            .then((product) => {
              if (foundItem) {
                this.setState((state) => {
                  const emptyItem = state.items.find(item => item.code === '');
                  const isDuplicated = Boolean(state.items.find(item => item.code === code));
                  const updatedItems = state.items.map((item) => {
                    if (item.key === emptyItem.key) {
                      return {
                        ...item,
                        code,
                        product,
                        isDuplicated,
                      };
                    }
                    return item;
                  });
                  return { ...state, items: updatedItems, isBarcodeScannerLoading: false };
                });
              } else {
                this.setState({ isBarcodeScannerLoading: false, barcodeScannerError: intl.get('no-results-found') });
              }
            });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          this.setState({ isBarcodeScannerLoading: false, barcodeScannerError: intl.get('no-results-found') });
        });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  processCSV(file) {
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        encoding: 'utf-8',
        skipEmptyLines: true,
        // eslint-disable-next-line func-names
        complete: ((results) => {
          // eslint-disable-next-line no-console
          console.log(results.data);
          this.createItems(results.data);
        }),
      });
    }
  }

  createItems(data) {
    const items = data.map((item) => {
      const configuration = {};
      Object.keys(item).filter(key => key !== 'code' && key !== 'quantity').forEach((key) => {
        configuration[key] = item[key];
      });
      return (
        {
          code: item.code,
          quantity: item.quantity,
          configuration,
        }
      );
    });

    this.addAllToCart(items, false, true);
  }

  render() {
    const { isBulkModalOpened, handleClose, cartData } = this.props;
    const {
      items,
      bulkOrderItems,
      csvText,
      isLoading,
      bulkOrderErrorMessage,
      quickOrderErrorMessage,
      bulkOrderDuplicatedErrorMessage,
      isBarcodeScannerOpen,
      isBarcodeScannerLoading,
      barcodeScannerError,
    } = this.state;
    const isValid = Boolean(items.find(item => (item.code !== '' && item.isValidField === false)));
    const isEmpty = Boolean(items.find(item => (item.code !== '' && item.isValidField === true)));
    const duplicatedFields = Boolean(items.find(item => (item.code !== '' && item.isDuplicated === true)));
    const isDisabledButton = (!Config.b2b.enable || (isValid || !isEmpty || duplicatedFields));
    const batchAddToCartAccelerator = cartData && cartData._additemstocartform && cartData._additemstocartform[0]['configurable-items'];
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
            <li className="nav-item">
              <a className="nav-link" id="batch-add-to-cart-tab" data-toggle="tab" href="#batch-add-to-cart" role="tab" aria-selected="false">
                {intl.get('batch-add-to-cart-title')}
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
                  onClick={() => { this.addAllToCart(items, true, batchAddToCartAccelerator); }}
                >
                  {intl.get('add-all-to-cart')}
                </button>
                {
                  BarcodeScanner.checkAvailability()
                  && (
                    <button
                      className="ep-btn primary small btn-itemdetail-addtocart barcode-scanner"
                      type="button"
                      disabled={isBarcodeScannerLoading}
                      onClick={this.handleBarcodeClick}
                    >
                      {
                        (isBarcodeScannerLoading)
                          ? <span className="miniLoader" />
                          : (
                            <div>
                              <span className="scan-barcode-title">{intl.get('scan-barcode')}</span>
                              <span className="glyphicon glyphicon-barcode" />
                            </div>
                          )
                      }
                    </button>
                  )
                }
                {barcodeScannerError && <div className="bulk-order-error-message">{barcodeScannerError}</div>}
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
                  onClick={() => { this.addAllToCart(bulkOrderItems, false, batchAddToCartAccelerator); }}
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
              {
                (batchAddToCartAccelerator) ? (
                  <div>
                    <hr />
                    <div className="batch-add-to-cart-btn">
                      <input type="file" className="btn-batch-csv-hidden" onChange={(e) => { this.processCSV(e.target.files[0]); e.target.value = null; }} name="file" id="batch-csv" accept=".csv" />
                      <label className="ep-btn primary small btn-batch-csv" htmlFor="batch-csv">{intl.get('upload-csv')}</label>
                    </div>
                    <div className="tab-batch-add-to-cart">
                      <p>{intl.get('upload-csv-desc')}</p>
                      <p>{intl.get('upload-csv-header')}</p>
                      <p>{intl.get('upload-csv-row')}</p>
                    </div>
                  </div>
                ) : ''
              }
            </div>
          </div>
        </div>
        {isBarcodeScannerOpen && <BarcodeScanner isModalOpen={isBarcodeScannerOpen} handleModalClose={this.handleBarcodeModalClose} handleCodeFound={this.handleBarcodeScanned} />}
      </div>
    );
  }
}

export default BulkOrder;
