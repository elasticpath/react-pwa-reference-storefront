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
import * as intl from 'react-intl-universal';
import { RouteComponentProps } from 'react-router-dom';
import {
  CartMain,
  CheckoutSummaryList,
  AddPromotionContainer,
  CartCreate,
} from '@elasticpath/store-components';
import Config from '../ep.config.json';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import './CartPage.less';

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultcart',
  'defaultcart:total',
  'defaultcart:discount',
  'defaultcart:appliedpromotions:element',
  'defaultcart:order:couponinfo:coupon',
  'defaultcart:order:couponinfo:couponform',
  'defaultcart:lineitems:element',
  'defaultcart:lineitems:element:total',
  'defaultcart:lineitems:element:price',
  'defaultcart:lineitems:element:availability',
  'defaultcart:lineitems:element:appliedpromotions',
  'defaultcart:lineitems:element:appliedpromotions:element',
  'defaultcart:lineitems:element:item',
  'defaultcart:lineitems:element:item:code',
  'defaultcart:lineitems:element:item:definition',
  'defaultcart:lineitems:element:item:definition:item',
  'defaultcart:lineitems:element:item:definition:details',
  'defaultcart:lineitems:element:dependentoptions:element:definition',
  'defaultcart:lineitems:element:dependentlineitems:element:item:definition',
  'defaultcart:lineitems:element:item:definition:options:element',
  'defaultcart:lineitems:element:item:definition:options:element:value',
  'defaultcart:lineitems:element:item:definition:options:element:selector:choice',
  'defaultcart:lineitems:element:item:definition:options:element:selector:chosen',
  'defaultcart:lineitems:element:item:definition:options:element:selector:choice:description',
  'defaultcart:lineitems:element:item:definition:options:element:selector:chosen:description',
  'carts',
  'carts:element',
  'carts:element:total',
  'carts:element:discount',
  'carts:element:descriptor',
  'carts:element:appliedpromotions:element',
  'carts:element:order:couponinfo:coupon',
  'carts:element:order:couponinfo:couponform',
  'carts:element:lineitems:element',
  'carts:element:lineitems:element:total',
  'carts:element:lineitems:element:price',
  'carts:element:lineitems:element:availability',
  'carts:element:lineitems:element:appliedpromotions',
  'carts:element:lineitems:element:appliedpromotions:element',
  'carts:element:lineitems:element:item',
  'carts:element:lineitems:element:item:code',
  'carts:element:lineitems:element:item:definition',
  'carts:element:lineitems:element:item:definition:item',
  'carts:element:lineitems:element:item:definition:details',
  'carts:element:lineitems:element:dependentoptions:element:definition',
  'carts:element:lineitems:element:dependentlineitems:element:item:definition',
  'carts:element:lineitems:element:item:definition:options:element',
  'carts:element:lineitems:element:item:definition:options:element:value',
  'carts:element:lineitems:element:item:definition:options:element:selector:choice',
  'carts:element:lineitems:element:item:definition:options:element:selector:chosen',
];

interface CartPageState {
  cartData: any,
  cartsData: any,
  isLoading: boolean,
  invalidPermission: boolean,
  multiCartsAvailable: boolean,
  openModal: boolean,
  selectedCartNumber: number,
}

class CartPage extends React.Component<RouteComponentProps, CartPageState> {
  constructor(props) {
    super(props);
    this.state = {
      cartData: undefined,
      cartsData: undefined,
      isLoading: false,
      multiCartsAvailable: false,
      invalidPermission: false,
      openModal: false,
      selectedCartNumber: -1,
    };
    this.handleItemConfiguratorAddToCart = this.handleItemConfiguratorAddToCart.bind(this);
    this.handleItemMoveToCart = this.handleItemMoveToCart.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleCartSelect = this.handleCartSelect.bind(this);
    this.handleCartElementSelect = this.handleCartElementSelect.bind(this);
  }

  componentDidMount() {
    this.fetchCartData();
  }

  componentWillReceiveProps() {
    this.fetchCartData();
  }

  fetchCartData() {
    const { selectedCartNumber } = this.state;
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          if (res._carts) {
            const defaultCart = selectedCartNumber >= 0 ? res._carts[0]._element[selectedCartNumber] : res._carts[0]._element.find(cart => cart._descriptor[0].default === 'true');
            this.setState({
              cartsData: res._carts[0],
              cartData: defaultCart,
              isLoading: false,
              multiCartsAvailable: true,
            });
          } else {
            this.setState({
              cartData: res._defaultcart[0],
              isLoading: false,
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleQuantityChange() {
    const { history } = this.props;
    this.setState({ isLoading: true });
    this.fetchCartData();
    history.push(window.location.pathname);
  }

  checkout() {
    const { history } = this.props;
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      history.push('/checkout');
    } else {
      history.push('/signIn');
    }
  }

  checkPermissions() {
    const { invalidPermission, cartData, isLoading } = this.state;
    if (Config.b2b.enable && invalidPermission) {
      return (
        <div className="message-permission">
          <h2>{intl.get('permission-message')}</h2>
        </div>
      );
    }
    return (
      (!cartData || isLoading) && (
        <div className="loader-container">
          <div className="loader" />
        </div>
      )
    );
  }

  handleItemConfiguratorAddToCart() {
    const { history } = this.props;
    history.push('/mycart');
  }

  handleItemMoveToCart() {
    const { history } = this.props;
    history.push('/mycart');
  }

  handleItemRemove() {
    const { history, location } = this.props;
    history.push(location.pathname);
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

  handleModalOpen() {
    this.setState({
      openModal: true,
    });
  }

  handleModalClose() {
    this.setState({
      openModal: false,
    });
  }

  handleCartSelect(cartData) {
    this.setState({ cartData });
  }

  handleCartElementSelect(index) {
    const { cartsData } = this.state;
    this.setState({ cartData: cartsData._element[index], selectedCartNumber: index });
  }

  render() {
    const {
      cartData, cartsData, isLoading, openModal, multiCartsAvailable,
    } = this.state;
    const itemDetailLink = '/itemdetail';
    const cartName = cartData && cartData._descriptor && cartData._descriptor[0].default !== 'true' ? cartData._descriptor[0].name : intl.get('default');
    return (
      <div className="cart-container container">
        <div className="cart-container-inner">
          <div data-region="cartTitleRegion" className="cart-title-container" style={{ display: 'block' }}>
            <div className="cart-title-wrap">
              {cartData && !isLoading && (
                <h1 className="view-title">
                  {multiCartsAvailable ? `${cartName} ${intl.get('cart')}` : `${intl.get('shopping-cart')} (${cartData['total-quantity']})`}
                </h1>
              )}
              {cartsData && !isLoading && multiCartsAvailable && (
                <div className="cart-create-btn-wrap">
                  <button className="ep-btn open-modal-btn" type="button" onClick={this.handleModalOpen}>{intl.get('change')}</button>
                  <CartCreate handleModalClose={this.handleModalClose} openModal={openModal} handleCartsUpdate={() => { this.fetchCartData(); }} handleCartElementSelect={this.handleCartElementSelect} />
                </div>
              )}
            </div>
          </div>
          {cartData && !isLoading && (
            <div data-region="mainCartRegion" className="cart-main-container" style={{ display: 'block' }}>
              <CartMain
                empty={!cartData['total-quantity'] || cartData._lineitems === undefined}
                cartData={cartData}
                handleQuantityChange={() => { this.handleQuantityChange(); }}
                onItemConfiguratorAddToCart={this.handleItemConfiguratorAddToCart}
                onItemMoveToCart={this.handleItemMoveToCart}
                onItemRemove={this.handleItemRemove}
                itemDetailLink={itemDetailLink}
              />
            </div>
          )}
          {(cartData && !isLoading) && (
            <div className="cart-sidebar" data-region="cartCheckoutMasterRegion" style={{ display: 'block' }}>
              <div>
                <div className="cart-sidebar-inner">
                  <h2 className="cart-sidebar-title">
                    {intl.get('order-summary')}
                  </h2>
                  <div data-region="cartSummaryRegion" className="cart-summary-container" style={{ display: 'inline-block' }}>
                    <CheckoutSummaryList data={cartData} onChange={() => { this.fetchCartData(); }} />
                    <AddPromotionContainer data={cartData} onSubmittedPromotion={() => { this.fetchCartData(); }} />
                  </div>
                  <div className="estimated-total">
                    <h2 className="cart-sidebar-title">{intl.get('estimated-total')}</h2>
                    <h2 className="cart-sidebar-title">
                      {cartData._total[0].cost[0].display}
                    </h2>
                  </div>
                  <div data-region="cartCheckoutActionRegion" className="cart-checkout-container" style={{ display: 'block' }}>
                    <div>
                      <button className="ep-btn primary btn-cmd-checkout" disabled={!cartData['total-quantity']} type="button" onClick={() => { this.checkout(); }}>
                        {intl.get('proceed-to-checkout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            {this.checkPermissions()}
          </div>
        </div>
      </div>
    );
  }
}

export default CartPage;
