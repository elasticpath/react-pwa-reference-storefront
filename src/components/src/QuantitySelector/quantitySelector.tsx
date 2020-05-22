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
import { ReactComponent as MinusIcon } from '../../../images/icons/ic_minus.svg';
import { ReactComponent as PlusIcon } from '../../../images/icons/ic_more.svg';

import './quantitySelector.scss';


interface QuantityDetailsMainProps {
  /** Callback for when the + icon is clicked */
  handleQuantityIncrement: any,
  /** Callback for when the - icon is clicked */
  handleQuantityDecrement: any,
  /** Callback for when the quantity state changes  */
  handleQuantityChange: any,
  /** State decides whether to show a loading animation */
  isLoading: any,
  /** The quantity number to show */
  itemQuantity: any,
  /** index of item */
  itemIndex?: number,
}

function QuantitySelector(props: QuantityDetailsMainProps) {
  const {
    handleQuantityIncrement,
    handleQuantityDecrement,
    handleQuantityChange,
    isLoading,
    itemQuantity,
    itemIndex,
  } = props;

  return (
    <div className="form-group quantity-picker-group">
      <label htmlFor={`product_display_quantity_field${itemIndex || ''}`} className="control-label">
        {intl.get('quantity')}
      </label>
      <div className="quantity-selector-container input-group-btn">
        <button type="button" className="quantity-left-minus btn btn-number" data-type="minus" data-field="" aria-label="Remove one item" onClick={handleQuantityDecrement}>
          <MinusIcon />
        </button>
        <div className="quantity-col form-content-quantity">
          <input
            id={`product_display_quantity_field${itemIndex || ''}`}
            className="product-display-item-quantity-select form-control form-control-quantity"
            type="number"
            step="1"
            min="1"
            max="9999"
            value={itemQuantity}
            onChange={handleQuantityChange}
          />
        </div>
        <button type="button" className="quantity-right-plus btn btn-number" data-type="plus" data-field="" aria-label="Add another item" onClick={handleQuantityIncrement}>
          <PlusIcon />
        </button>
      </div>
      {
      (isLoading) ? (<div className="miniLoader" />) : ''
      }
    </div>
  );
}

QuantitySelector.defaultProps = {
  handleQuantityIncrement: () => {},
  handleQuantityDecrement: () => {},
  itemIndex: 0,
};

export default QuantitySelector;
