/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import { login } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import CartMain from '../components/cart.main';
import CheckoutSummaryList from '../components/checkout.summarylist';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultcart',
  'defaultcart:total',
  'defaultcart:discount',
  'defaultcart:appliedpromotions:element',
  'defaultcart:lineitems:element',
  'defaultcart:lineitems:element:total',
  'defaultcart:lineitems:element:price',
  'defaultcart:lineitems:element:availability',
  'defaultcart:lineitems:element:appliedpromotions:element',
  'defaultcart:lineitems:element:item',
  'defaultcart:lineitems:element:item:code',
  'defaultcart:lineitems:element:item:definition',
  'defaultcart:lineitems:element:item:definition:options:element',
  'defaultcart:lineitems:element:item:definition:options:element:value',
  'defaultcart:lineitems:element:item:definition:options:element:selector:choice',
  'defaultcart:lineitems:element:item:definition:options:element:selector:chosen',
  'defaultcart:lineitems:element:item:definition:options:element:selector:choice:description',
  'defaultcart:lineitems:element:item:definition:options:element:selector:chosen:description',
];

class CartPage extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      cartData: undefined,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchCartData();
  }

  fetchCartData() {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            cartData: res._defaultcart[0],
            isLoading: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleQuantityChange() {
    this.setState({ isLoading: true });
    this.fetchCartData();
  }

  checkout() {
    const { history } = this.props;
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      history.push('/checkout');
    } else {
      history.push('/signIn');
    }
  }

  renderDiscount() {
    const { cartData } = this.state;
    if (cartData._discount) {
      return (
        <li className="cart-discount">
          <label htmlFor="cart_summary_discount_label" className="cart-summary-label-col">
            {intl.get('discount-at-checkout')}
            :&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {cartData._discount[0].discount[0].display}
          </span>
        </li>
      );
    }
    return ('');
  }

  renderPromotions() {
    const { cartData } = this.state;
    if (cartData._appliedpromotions) {
      return (
        <li className="cart-applied-promotions" data-region="cartAppliedPromotionsRegion">
          <label htmlFor="cart_summary_promotion_label" className="cart-summary-label-col">
            {intl.get('applied-promotions')}
            :&nbsp;
          </label>
          <br />
          {cartData._appliedpromotions[0]._element.map(promotion => (
            <span className="cart-summary-value-col cart-applied-promotions" key={`_${Math.random().toString(36).substr(2, 9)}`} data-el-value="cart.appliedPromotions">&nbsp;&nbsp;
              {promotion['display-name']}
            </span>
          ))}
        </li>
      );
    }
    return ('');
  }

  render() {
    const { cartData, isLoading } = this.state;
    const { history } = this.props;
    return (
      <div>
        <AppHeaderMain />
        <div className="cart-container container">
          <div className="cart-container-inner">
            <div data-region="cartTitleRegion" className="cart-title-container" style={{ display: 'block' }}>
              <div>
                <h1 className="view-title">
                  {intl.get('shopping-cart')}
                </h1>
                <button className="btn-cmd-continue-shopping" type="button" onClick={() => { history.push('/'); }}>
                  {intl.get('continue-shopping')}
                </button>
              </div>
            </div>
            {cartData && !isLoading && (
              <div data-region="mainCartRegion" className="cart-main-container" style={{ display: 'block' }}>
                <CartMain empty={!cartData['total-quantity']} cartData={cartData} handleQuantityChange={() => { this.handleQuantityChange(); }} />
              </div>
            )}
            {cartData && !isLoading && (
              <div className="cart-sidebar" data-region="cartCheckoutMasterRegion" style={{ display: 'block' }}>
                <div>
                  <div className="cart-sidebar-inner">
                    <div data-region="cartSummaryRegion" className="cart-summary-container" style={{ display: 'inline-block' }}>
                      <CheckoutSummaryList data={cartData} />
                    </div>
                    <div data-region="cartCheckoutActionRegion" className="cart-checkout-container" style={{ display: 'block' }}>
                      <div>
                        <button className="btn-cmd-checkout" disabled={!cartData['total-quantity']} type="button" onClick={() => { this.checkout(); }}>
                          {intl.get('proceed-to-checkout')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(!cartData || isLoading) && (
              <div data-region="mainCartRegion" className="cart-main-container" style={{ display: 'block' }}>
                <div className="loader" />
              </div>
            )}
          </div>
        </div>
        <AppFooterMain />
      </div>
    );
  }
}

export default CartPage;
