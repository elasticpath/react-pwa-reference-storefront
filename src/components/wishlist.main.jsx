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
import CartLineItem from './cart.lineitem';
import './wishlist.main.less';

const WishListMain = (props) => {
  const {
    empty, wishListData, handleQuantityChange,
  } = props;
  if (empty) {
    return (
      <div className="cart-empty-container">
        <span className="cart-empty-message">
          {intl.get('wish-list-empty-message')}
        </span>
      </div>
    );
  }
  return (
    <div className="cart-main-inner table-responsive">
      {wishListData._lineitems[0]._element.map(product => (
        <CartLineItem key={product._item[0]._code[0].code} item={product} handleQuantityChange={() => { handleQuantityChange(); }} />
      ))}
    </div>
  );
};

WishListMain.propTypes = {
  empty: PropTypes.bool.isRequired,
  wishListData: PropTypes.objectOf(PropTypes.any).isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
};

export default WishListMain;
