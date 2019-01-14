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
import { login } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';
import {
  isAnalyticsConfigured, trackAddItemAnalytics, setAddAnalytics, sendAddToCartAnalytics,
} from '../utils/Analytics';
import cortexFetch from '../utils/Cortex';
import './quickorder.main.less';

const Config = require('Config');

class QuickOrderMain extends React.Component {
  static propTypes = {
    onAddToCart: PropTypes.func,
    isBuyItAgain: PropTypes.bool,
    productIdProps: PropTypes.string,
  }

  static defaultProps = {
    onAddToCart: () => { },
    isBuyItAgain: false,
    productIdProps: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      failedSubmit: false,
      productData: undefined,
      productId: '',
      itemQuantity: 1,
      addToCartFailedMessage: '',
      isLoading: false,
      itemConfiguration: {},
    };
    const { productIdProps } = this.props;
    if (productIdProps !== '') {
      this.state = {
        productId: productIdProps,
      };
    }
    this.addToCart = this.addToCart.bind(this);
  }

  addToCart(event) {
    const { onAddToCart } = this.props;
    const {
      productData, itemQuantity, itemConfiguration, productId,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetchItemLookupForm()
        .then(() => itemLookup(productId)
          .then((res) => {
            const addToCartLink = res._addtocartform[0].links.find(link => link.rel === 'addtodefaultcartaction');
            const body = {};
            body.quantity = itemQuantity;
            if (itemQuantity === undefined) {
              body.quantity = 1;
            }
            if (itemConfiguration) {
              body.configuration = itemConfiguration;
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
              .then((resAddToCart) => {
                if (resAddToCart.status === 200 || resAddToCart.status === 201) {
                  if (isAnalyticsConfigured()) {
                    const categoryTag = (productData._definition[0].details) ? (productData._definition[0].details.find(detail => detail['display-name'] === 'Tag')) : '';
                    trackAddItemAnalytics(productData.self.uri.split(`/items/${Config.cortexApi.scope}/`)[1], productData._definition[0]['display-name'], productData._code[0].code, productData._price[0]['purchase-price'][0].display, (categoryTag !== undefined && categoryTag !== '') ? categoryTag['display-value'] : '', itemQuantity);
                    setAddAnalytics();
                    sendAddToCartAnalytics();
                  }
                  this.setState({
                    isLoading: false,
                    productId: '',
                    itemQuantity: 1,
                  });
                  onAddToCart();
                } else {
                  let debugMessages = '';
                  resAddToCart.json().then((json) => {
                    for (let i = 0; i < json.messages.length; i++) {
                      debugMessages = debugMessages.concat(`- ${json.messages[i]['debug-message']} \n `);
                    }
                  }).then(() => this.setState({ addToCartFailedMessage: debugMessages }));
                }
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error.message);
              });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          }));
    });
    event.preventDefault();
  }

  render() {
    const {
      failedSubmit, isLoading, addToCartFailedMessage, productId, itemQuantity,
    } = this.state;
    const { isBuyItAgain } = this.props;
    if (isBuyItAgain) {
      return (
        <button className="ep-btn small buy-it-again-btn" type="button" onClick={this.addToCart}>
          {intl.get('buy-it-again')}
        </button>
      );
    }
    return (
      <div className="quick-order-container" style={{ display: 'block' }}>
        <div>
          <h2 className="quick-order-title">
            {intl.get('quick-order-title')}
          </h2>
          <form className="form-horizontal" onSubmit={this.addToCart}>
            <div data-region="componentQuickOrderFormRegion">
              <div className="quick-order-form-container">
                <div className="feedback-label quick-order-form-feedback-container" data-region="componentQuickOrderFeedbackRegion">
                  {failedSubmit ? intl.get('failed-to-save-message') : ''}
                </div>
                <div className="form-group quick-order-forms">
                  <div className="quick-order-form-input">
                    <input id="quick_order_form_sku" className="form-control" type="text" placeholder={intl.get('quick-order-sku-title')} value={productId} onChange={e => this.setState({ productId: e.target.value })} />
                  </div>
                  <div className="quantity-col">
                    <input id="quick_order_form_quantity" className="quantity-select form-control" type="number" step="1" min="1" max="9999" placeholder="1" value={itemQuantity} onChange={e => this.setState({ itemQuantity: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group quick-order-btn-container quick-order-btn-container">
              <button className="ep-btn primary wide quick-order-add-to-cart" data-el-label="quickOrderForm.save" type="submit">
                {intl.get('add-to-cart')}
              </button>
            </div>
          </form>
          <div className="auth-feedback-container" id="product_display_item_add_to_cart_feedback_container" data-i18n="">
            {addToCartFailedMessage}
          </div>
          {
            (isLoading) ? (<div className="miniLoader" />) : ''
          }
        </div>
      </div>
    );
  }
}

export default withRouter(QuickOrderMain);
