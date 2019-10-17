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
import { withRouter } from 'react-router';
import Modal from 'react-responsive-modal';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import CartLineItem from '../CartLineItem/cart.lineitem';
import { cortexFetch } from '../utils/Cortex';
import { login } from '../utils/AuthService';
import './reorder.main.less';

let Config: IEpConfig | any = {};
let intl = { get: (str, ...args: any[]) => str };

interface ReorderMainProps {
  productsData?: {
    [key: string]: any
  },
  onReorderAll?: (...args: any[]) => any,
  itemDetailLink?: string
}

interface ReorderMainState {
  openModal: boolean,
  errorMessages: {},
  isLoading: boolean
}

class ReorderMain extends React.Component<ReorderMainProps, ReorderMainState> {
  static defaultProps = {
    productsData: {},
    onReorderAll: () => {},
    itemDetailLink: '',
  };

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      openModal: false,
      errorMessages: {},
      isLoading: false,
    };

    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleError = this.handleError.bind(this);
    this.reorderAll = this.reorderAll.bind(this);
  }

  reorderAll() {
    const { productsData, onReorderAll } = this.props;
    const bulkOrderItems = productsData._lineitems[0]._element.map(item => ({
      code: item._item[0]._code[0].code,
      quantity: item.quantity,
    }));
    if (productsData._defaultcart) {
      this.setState({ isLoading: true });
      login().then(() => {
        const addToCartLink = productsData._defaultcart[0]._additemstocartform[0].links.find(link => link.rel === 'additemstocartaction');
        const body: { [key: string]: any } = {};
        if (bulkOrderItems) {
          body.items = bulkOrderItems;
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
            this.setState({ isLoading: false });
            if (res.status !== 201) {
              res.json().then((json) => {
                const code = json.messages[0].data['item-code'];
                this.handleError(code, json.messages[0]['debug-message']);
              });
            } else {
              onReorderAll();
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    }
  }

  handleModalOpen() {
    const { productsData } = this.props;
    productsData._lineitems[0]._element.forEach((product) => {
      const SKUCode = product._item[0]._code[0].code;
      const isConfigurable = product._item[0]._definition[0].links.find(link => link.rel === 'options');

      if (isConfigurable) {
        this.handleError(SKUCode, intl.get('configurable-product-message', { SKUCode }));
      }

      if (product._item[0]._availability[0].state !== 'AVAILABLE') {
        this.handleError(SKUCode, intl.get('out-of-stock-product-message', { SKUCode }));
      }
    });

    this.setState({ openModal: true });
  }

  handleModalClose() {
    this.setState({ openModal: false });
  }

  handleError(code, message) {
    const { errorMessages } = this.state;
    this.setState({ errorMessages: { ...errorMessages, [code]: message } });
  }

  render() {
    const { openModal, errorMessages, isLoading } = this.state;
    const { productsData, itemDetailLink } = this.props;

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
                  <div>
                    <CartLineItem
                      key={_code[0].code}
                      item={item._item[0]}
                      itemQuantity={quantity}
                      hideAddToCartButton
                      handleQuantityChange={() => { }}
                      hideRemoveButton
                      handleErrorMessage={(error) => { this.handleError(_code[0].code, error.message); }}
                      itemDetailLink={itemDetailLink}
                    />
                    { errorMessages[_code[0].code]
                      ? <div className="feedback-label">{ errorMessages[_code[0].code] }</div>
                      : ''
                    }
                  </div>
                );
              })}
            </div>
            {isLoading
              ? <div className="loader" />
              : (
                <button
                  className="ep-btn reorder-btn"
                  type="button"
                  disabled={Boolean(Object.keys(errorMessages).length)}
                  onClick={() => {
                    this.reorderAll();
                  }}
                >
                  {intl.get('reorder')}
                </button>
              )
            }
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(ReorderMain);
