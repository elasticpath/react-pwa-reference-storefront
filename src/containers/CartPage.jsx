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
import { login } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import CartMain from '../components/cart.main';
import CheckoutSummaryList from '../components/checkout.summarylist';

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
  'defaultcart:lineitems:element:item:definition:options:element:selector:choice:selector',
  'defaultcart:lineitems:element:item:definition:options:element:selector:chosen:selector',
  'defaultcart:lineitems:element:item:definition:options:element:selector:choice:selectaction',
  'defaultcart:lineitems:element:item:definition:options:element:selector:chosen:selectaction',
];

class CartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartData: undefined,
      isLoading: false,
    };
  }

  fetchCartData() {
    login().then(() => {
      fetch(`${Config.cortexApi.path}/?zoom=${zoomArray.join()}`, {
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
          console.log(error);
        });
    });
  }

  componentDidMount() {
    this.fetchCartData();
  }

  handleQuantityChange() {
    this.setState({ isLoading: true });
    this.fetchCartData();
  }

  renderPromotions() {
    if (this.state.cartData._appliedpromotions) {
      return (
        <li className="cart-applied-promotions" data-region="cartAppliedPromotionsRegion">
          <label className="cart-summary-label-col">
Applied Promotions:&nbsp;
          </label>
          <br />
          {this.state.cartData._appliedpromotions[0]._element.map(promotion => (
            <span className="cart-summary-value-col cart-applied-promotions" key={`_${Math.random().toString(36).substr(2, 9)}`} data-el-value="cart.appliedPromotions">&nbsp;&nbsp;
              {promotion['display-name']}
            </span>
          ))}
        </li>
      );
    }
  }

  renderDiscount() {
    if (this.state.cartData._discount) {
      return (
        <li className="cart-discount">
          <label className="cart-summary-label-col">
Discount at Checkout:&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {this.state.cartData._discount[0].discount[0].display}
          </span>
        </li>
      );
    }
  }

  checkout() {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      this.props.history.push('/checkout');
    } else {
      this.props.history.push('/signIn');
    }
  }

  render() {
    if (this.state.cartData) {
      return (
        <div>
          <AppHeaderMain />
          <div className="cart-container container">
            <div className="cart-container-inner">
              <div data-region="cartTitleRegion" className="cart-title-container" style={{ display: 'block' }}>
                <div>
                  <h1 className="view-title">
Shopping Cart
                  </h1>
                  <button className="btn-cmd-continue-shopping" onClick={() => { this.props.history.push('/'); }}>
Continue Shopping
                  </button>
                </div>
              </div>
              <div data-region="mainCartRegion" className="cart-main-container" style={{ display: 'block' }}>
                <CartMain empty={!this.state.cartData['total-quantity']} cartData={this.state.cartData} isLoading={this.state.isLoading} handleQuantityChange={() => { this.handleQuantityChange(); }} />
              </div>
              <div className="cart-sidebar" data-region="cartCheckoutMasterRegion" style={{ display: 'block' }}>
                <div>
                  <div className="cart-sidebar-inner">
                    <div data-region="cartSummaryRegion" className="cart-summary-container" style={{ display: 'inline-block' }}>
                      <CheckoutSummaryList data={this.state.cartData} isLoading={this.state.isLoading} />
                    </div>
                    <div data-region="cartCheckoutActionRegion" className="cart-checkout-container" style={{ display: 'block' }}>
                      <div>
                        <button className="btn-cmd-checkout" disabled={!this.state.cartData['total-quantity']} onClick={() => { this.checkout(); }}>
Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AppFooterMain />
        </div>
      );
    }

    return (
      <div>
        <AppHeaderMain />
        <div className="loader" />
        <AppFooterMain />
      </div>
    );
  }
}

export default CartPage;
