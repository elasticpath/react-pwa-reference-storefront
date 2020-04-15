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

import React, { FC } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';

import './cartpopup.less';


interface CartPopUpProps {
  /** links for app header */
  appHeaderLinks: any,
  /** cart data */
  cartData: {
    count: number,
    name: string,
  },
}

const CartPopUp: FC<CartPopUpProps> = (props) => {
  const { appHeaderLinks, cartData } = props;

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
};

export default CartPopUp;
