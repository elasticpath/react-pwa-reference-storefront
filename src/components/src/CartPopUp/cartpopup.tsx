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
import './cartpopup.less';
import { Link } from 'react-router-dom';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};

interface CartPopUpProps {
  /** links for app header */
  appHeaderLinks: any,
  /** cart data */
  cartData: {
    count: number,
    name: string,
  },
}

interface CartPopUpState {
  cartData: any,
}

class CartPopUp extends Component<CartPopUpProps, CartPopUpState> {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
  }

  componentDidMount() {}

  render() {
    const { appHeaderLinks, cartData } = this.props;
    const message = (
      <div className="multi-cart-message">
        <b>{cartData.count}</b>
        {' '}
        {intl.get('item-was-added-to-your-cart')}
        {' '}
        <b>{cartData.name}</b>
        {' '}
        {intl.get('cart')}
      </div>
    );
    return (
      <div className="cart-nav-container">
        <div className="multi-cart-menu">
          {message}
        </div>
        <div className="checkout-btn-container">

          <Link className="ep-btn primary checkout-btn link-to-cart" to={appHeaderLinks.myCart}>
            {intl.get('view-your-carts')}
          </Link>

        </div>
      </div>
    );
  }
}

export default CartPopUp;
