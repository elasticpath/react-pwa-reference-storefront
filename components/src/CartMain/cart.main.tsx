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
import CartLineItem from '../CartLineItem/cart.lineitem';
import { getConfig } from '../utils/ConfigProvider';
import './cart.main.less';

let intl = { get: str => str };

interface CartMainProps {
  empty: boolean,
  cartData: {
    [key: string]: any
  },
  handleQuantityChange: (...args: any[]) => any,
  onItemConfiguratorAddToCart?: (...args: any[]) => any,
  onItemMoveToCart?: (...args: any[]) => any,
  onItemRemove?: (...args: any[]) => any,
  itemDetailLink?: string,
}

const CartMain: React.FunctionComponent<CartMainProps> = (props: CartMainProps) => {
  const { itemDetailLink } = props;
  ({ intl } = getConfig());
  const {
    empty, cartData, handleQuantityChange,
  } = props;
  if (empty) {
    return (
      <div className="cart-empty-container">
        <span className="cart-empty-message">
          {intl.get('shopping-cart-empty-message')}
        </span>
      </div>
    );
  }

  function handleConfiguratorAddToCart() {
    const { onItemConfiguratorAddToCart } = props;
    onItemConfiguratorAddToCart();
  }

  function handleMoveToCart() {
    const { onItemMoveToCart } = props;
    onItemMoveToCart();
  }

  function handleRemove() {
    const { onItemRemove } = props;
    onItemRemove();
  }

  return (
    <div className="cart-main-inner table-responsive">
      {cartData._lineitems[0]._element.map(product => (
        <CartLineItem
          key={product._item[0]._code[0].code}
          item={product}
          handleQuantityChange={() => { handleQuantityChange(); }}
          onRemove={handleRemove}
          onConfiguratorAddToCart={handleConfiguratorAddToCart}
          onMoveToCart={handleMoveToCart}
          itemDetailLink={itemDetailLink}
        />
      ))}
    </div>
  );
};

CartMain.defaultProps = {
  onItemConfiguratorAddToCart: () => {},
  onItemMoveToCart: () => {},
  onItemRemove: () => {},
  itemDetailLink: '',
};

export default CartMain;
