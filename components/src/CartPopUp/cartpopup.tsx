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
import './cartpopup.less';
import { Link } from 'react-router-dom';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface CartPopUpProps {
  appHeaderLinks: any,
  itemsQuantity: number,
  handleMultiCartModalClose: (...args: any[]) => any,
}

interface CartPopUpState {
  cartData: any,
}

class CartPopUp extends React.Component<CartPopUpProps, CartPopUpState> {
  static defaultProps = {};

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
  }

  componentDidMount() {}

  render() {
    const { appHeaderLinks, itemsQuantity, handleMultiCartModalClose } = this.props;
    return (
      <div className="cart-nav-container">
        <div className="multi-cart-menu">
          <span>{`${itemsQuantity} ${intl.get('item-was-added-to-your-cart')}`}</span>
        </div>
        <div className="checkout-btn-container">

          <button className="ep-btn primary checkout-btn" type="button" onClick={handleMultiCartModalClose}>
            <Link className="link-to-cart" to={appHeaderLinks.myCart}>
              {intl.get('view-your-carts')}
            </Link>

          </button>
        </div>
      </div>
    );
  }
}

export default CartPopUp;
