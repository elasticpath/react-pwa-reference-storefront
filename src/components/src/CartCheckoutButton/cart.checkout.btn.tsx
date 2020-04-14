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
import './cartcheckoutbutton.less';

interface CartCheckoutButtonProps {
  /** The checkout */
  checkout: any,
  /** Cart Data */
  cartData: any,
}

function CartCheckoutButton(props: CartCheckoutButtonProps) {
  const {
    checkout,
    cartData,
  } = props;

  function getDescriptorUri() {
    return cartData._descriptor[0]['P2G-cart-transfer-url'];
  }

  return (
    <div>
      <button className="ep-btn primary btn-cmd-checkout" disabled={!cartData['total-quantity']} type="button" onClick={() => { checkout(); }}>
        {
          getDescriptorUri() ? intl.get('proceed-to-procurement') : intl.get('proceed-to-checkout')
        }
      </button>
    </div>
  );
}

CartCheckoutButton.defaultProps = {
  checkout: () => {},
  cartData: {},
};

export default CartCheckoutButton;
