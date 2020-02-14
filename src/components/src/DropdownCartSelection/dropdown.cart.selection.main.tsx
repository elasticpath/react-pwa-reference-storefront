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
// import './cartclear.less';
import { getConfig } from '../utils/ConfigProvider';
import { useCountDispatch } from '../cart-count-context';

interface DropdownCartSelectionProps {
  /** multi cart data */
  multiCartData: any,
  /** handle add to selected cart */
  addToSelectedCart: (...args: any[]) => any,
  /** show dropdown header */
  showDropdownHeader?: boolean,
}

let intl = { get: str => str };

function DropdownCartSelection(props:DropdownCartSelectionProps) {
  ({ intl } = getConfig());

  const { multiCartData, addToSelectedCart, showDropdownHeader } = props;
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
    <div className="cart-selection-menu">
      {showDropdownHeader && (
        <h6 className="dropdown-header">
          {intl.get('add-to-cart')}
        </h6>
      )}
      <div className="cart-selection-menu-wrap">
        {multiCartData.map((cart) => {
          const name = (cart._target && cart._target[0]._descriptor[0].name) || cart._descriptor[0].name || intl.get('default');
          return (
            <button type="button" className="dropdown-item cart-selection-menu-item" key={cart.self ? cart.self.uri : cart._target[0]._descriptor[0].name || 'default'} onClick={() => addToSelectedCart(cart, onCountChange)}>
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

DropdownCartSelection.defaultProps = {
  multiCartData: [],
  addToSelectedCart: () => { },
  showDropdownHeader: false,
};

export default DropdownCartSelection;
