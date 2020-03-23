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
import { useCountDispatch } from '../cart-count-context';

import './dropdown.cart.selection.main.less';

import { ReactComponent as AddToCartIcon } from '../../../images/icons/ic_add_to_cart.svg';

interface DropdownCartSelectionProps {
  /** multi cart data */
  multiCartData: any,
  /** handle add to selected cart */
  addToSelectedCart: (...args: any[]) => any,
  /** show dropdown header */
  showDropdownHeader?: boolean,
  /** is disabled */
  isDisabled?: boolean,
  /** show loader */
  showLoader?: boolean,
  /** button text */
  btnTxt?: string,
  /** show cart icon */
  showCartIcon?: boolean,
}

function DropdownCartSelection(props:DropdownCartSelectionProps) {
  const {
    multiCartData, addToSelectedCart, showDropdownHeader, isDisabled, showLoader, btnTxt, showCartIcon,
  } = props;
  const dispatch = useCountDispatch();
  const onCountChange = (name, count) => {
    const data = {
      type: 'COUNT_SHOW',
      payload: {
        count,
        name,
      },
    };
    dispatch(data);
    setTimeout(() => {
      dispatch({ type: 'COUNT_HIDE' });
    }, 3200);
  };

  return (
    <div className="dropdown cart-selection-dropdown">
      <button
        className="ep-btn primary btn-itemdetail-addtocart dropdown-toggle"
        data-toggle="dropdown"
        disabled={isDisabled}
        id="product_display_item_add_to_cart_button-dropdown"
        type="button"
      >
        {showLoader ? (
          <span className="miniLoader" />
        ) : (
          <span className="btn-txt">
            {btnTxt}
          </span>
        )}
        {showCartIcon && <AddToCartIcon className="add-to-cart-icon" />}
      </button>
      <div className="dropdown-menu cart-selection-menu">
        {showDropdownHeader && (
          <h6 className="dropdown-header">
            {intl.get('add-to-cart')}
          </h6>
        )}
        <div className="cart-selection-menu-wrap">
          {multiCartData.map((cart) => {
            const name = (cart._target && cart._target[0]._descriptor[0].name) || (cart._descriptor ? cart._descriptor[0].name : intl.get('default'));
            return (
              <button type="button" className="dropdown-item cart-selection-menu-item" key={cart.self ? cart.self.uri : cart._target[0]._descriptor[0].name || 'default'} onClick={() => addToSelectedCart(cart, onCountChange)}>
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

DropdownCartSelection.defaultProps = {
  multiCartData: [],
  addToSelectedCart: () => { },
  showDropdownHeader: false,
  isDisabled: false,
  showLoader: false,
  btnTxt: '',
  showCartIcon: false,
};

export default DropdownCartSelection;
