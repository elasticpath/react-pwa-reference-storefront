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
import intl from 'react-intl-universal';
import * as cortex from '@elasticpath/cortex-client';
import { RouteComponentProps } from 'react-router-dom';
import {
  CartMain, CheckoutSummaryList, AddPromotionContainer, ClientContext,
} from '@elasticpath/store-components';
import Config from '../ep.config.json';
import './CartPage.less';

// zoom parameters to pass to Cortex
const zoomDefaultCart = {
  defaultcart: {
    total: {},
    // discount: {},
    appliedpromotions: {
      element: {},
    },
    order: {
      couponinfo: {
        coupon: {},
        couponform: {},
      },
    },
    lineitems: {
      element: {
        total: {},
        price: {},
        availability: {},
        appliedpromotions: {
          element: {},
        },
        item: {
          code: {},
          definition: {
            // item: {},
            // details: {},
            options: {
              element: {
                value: {},
                selector: {
                  choice: {
                    // description: {},
                  },
                  chosen: {
                    // description: {},
                  },
                },
              },
            },
          },
        },
        // dependentoptions: {
        //   element: {
        //     definition: {},
        //   },
        // },
        dependentlineitems: {
          element: {
            item: {
              definition: {},
            },
          },
        },
      },
    },
  },
};

interface CartPageState {
    cartData: any,
    isLoading: boolean,
    invalidPermission: boolean,
}

class CartPage extends React.Component<RouteComponentProps, CartPageState> {
  static contextType = ClientContext;

  constructor(props) {
    super(props);
    this.state = {
      cartData: undefined,
      isLoading: false,
      invalidPermission: false,
    };
    this.handleItemConfiguratorAddToCart = this.handleItemConfiguratorAddToCart.bind(this);
    this.handleItemMoveToCart = this.handleItemMoveToCart.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
  }

  client: cortex.IClient;

  componentDidMount() {
    this.client = this.context;
    this.fetchCartData();
  }

  componentWillReceiveProps() {
    this.fetchCartData();
  }

  fetchCartData() {
    this.client.root().fetch(zoomDefaultCart)
      .then((res) => {
        if (!res.defaultcart) {
          this.setState({
            invalidPermission: true,
          });
        } else {
          this.setState({
            cartData: res.defaultcart,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  handleQuantityChange() {
    const { location, history } = this.props;
    this.setState({ isLoading: true });
    this.fetchCartData();
    history.push(location.path);
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
        <div data-region="mainCartRegion" className="cart-main-container" style={{ display: 'block' }}>
          <div className="loader" />
        </div>
      )
    );
  }

  handleItemConfiguratorAddToCart() {
    const { history } = this.props;
    history.push('/mybag');
  }

  handleItemMoveToCart() {
    const { history } = this.props;
    history.push('/mybag');
  }

  handleItemRemove() {
    const { history, location } = this.props;
    history.push(location.pathname);
  }

  renderDiscount() {
    const { cartData } = this.state;
    if (cartData._discount) {
      return cartData.discount
        ? (
          <li className="cart-discount">
            <label htmlFor="cart_summary_discount_label" className="cart-summary-label-col">
              {intl.get('discount-at-checkout')}
            :&nbsp;
            </label>
            <span className="cart-summary-value-col">
              {cartData.discount.discount.display}
            </span>
          </li>
        )
        : '';
    }
    return ('');
  }

  render() {
    const { cartData, isLoading } = this.state;
    const itemDetailLink = '/itemdetail';
    return (
      <div className="cart-container container">
        <div className="cart-container-inner">
          <div data-region="cartTitleRegion" className="cart-title-container" style={{ display: 'block' }}>
            <div>
              {cartData && !isLoading && (
                <h1 className="view-title">
                  {intl.get('shopping-cart')}
                  &nbsp;
                  (
                    {cartData.totalQuantity}
                  )
                </h1>
              )}
              {(!cartData || isLoading) && (
                <h1 className="view-title">
                  {intl.get('shopping-cart')}
                  &nbsp;
                </h1>
              )}
            </div>
          </div>
          {cartData && !isLoading && (
            <div data-region="mainCartRegion" className="cart-main-container" style={{ display: 'block' }}>
              <CartMain
                empty={!cartData.totalQuantity || cartData.lineitems === undefined}
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
                  <div data-region="cartSummaryRegion" className="cart-summary-container" style={{ display: 'inline-block' }}>
                    <AddPromotionContainer onSubmittedPromotion={() => { this.fetchCartData(); }} />
                    <CheckoutSummaryList data={cartData} onChange={() => { this.fetchCartData(); }} />
                  </div>
                  <div data-region="cartCheckoutActionRegion" className="cart-checkout-container" style={{ display: 'block' }}>
                    <div>
                      <button className="ep-btn primary wide btn-cmd-checkout" disabled={!cartData.totalQuantity} type="button" onClick={() => { this.checkout(); }}>
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
