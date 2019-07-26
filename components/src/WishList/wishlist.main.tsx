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
import { getConfig } from '../utils/ConfigProvider';
import CartLineItem from '../CartLineItem/cart.lineitem';
import './wishlist.main.less';

interface WishListMainProps {
  empty: boolean,
  wishListData: {
    [key: string]: any
  },
  handleQuantityChange: (...args: any[]) => any,
  onItemConfiguratorAddToCart?: (...args: any[]) => any,
  onItemMoveToCart?: (...args: any[]) => any,
  onItemRemove?: (...args: any[]) => any,
  itemDetailLink?: string
}

const WishListMain: React.FunctionComponent<WishListMainProps> = (props: WishListMainProps) => {
  const { itemDetailLink } = props;

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

  const { intl } = getConfig();

  const {
    empty, wishListData, handleQuantityChange,
  } = props;
  if (empty) {
    return (
      <div className="wish-list-empty-container">
        <span className="wish-list-empty-message">
          {intl.get('wish-list-empty-message')}
        </span>
      </div>
    );
  }

  return (
    <div className="wish-list-main-inner table-responsive">
      {wishListData._lineitems[0]._element.map(product => (
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

WishListMain.defaultProps = {
  onItemConfiguratorAddToCart: () => {},
  onItemMoveToCart: () => {},
  onItemRemove: () => {},
  itemDetailLink: '',
};

export default WishListMain;
