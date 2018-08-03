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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import CartLineItem from './cart.lineitem';


const CartMain = (props) => {
  const {
    empty, cartData, handleQuantityChange,
  } = props;
  if (empty) {
    return (
      <div className="cart-empty-container">
        <span className="cart-empty-message">
          {intl.get('shopping-card-empty-message')}
        </span>
      </div>
    );
  }
  return (
    <div className="cart-main-inner table-responsive">
      <table className="table">
        <thead className="cart-lineitem-table-headings">
          <tr>
            <th className="cart-heading-product">
              <span className="lineitem-asset-col">
                {intl.get('product')}
              </span>
            </th>
            <th className="cart-heading-name">
              {intl.get('name')}
            </th>
            <th className="cart-heading-options">
              {intl.get('options')}
            </th>
            <th className="cart-heading-availability">
              {intl.get('availability')}
            </th>
            <th className="cart-heading-item-price">
              {intl.get('unit-price')}
            </th>
            <th className="cart-heading-quantity">
              {intl.get('quantity')}
            </th>
            <th className="cart-heading-item-total">
              {intl.get('total-price')}
            </th>
            <th className="cart-heading-remove">
              {intl.get('remove')}
            </th>
          </tr>
        </thead>
        <tbody>
          {cartData._lineitems[0]._element.map(product => (
            <CartLineItem key={product._item[0]._code[0].code} item={product} handleQuantityChange={() => { handleQuantityChange(); }} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

CartMain.propTypes = {
  empty: PropTypes.bool.isRequired,
  cartData: PropTypes.objectOf(PropTypes.any).isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
};

export default CartMain;
