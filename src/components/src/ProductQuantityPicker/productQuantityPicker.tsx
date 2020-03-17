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

import './productQuantityPicker.less';

let intl = { get: str => str };

const ProductQuantityPicker = (props: { value: number, onChange: (value) => void, loading: boolean }) => {
  const { loading, value, onChange } = props;
  const epConfig = getConfig();
  ({ intl } = epConfig);

  const handleQuantityChange = (isIncrement) => {
    let itemQuantity = value;
    if (isIncrement) {
      itemQuantity += 1;
    } else {
      itemQuantity = value > 1 ? value - 1 : value;
    }
    onChange(itemQuantity);
  };


  const handleChange = (event) => {
    const itemQuantity = Number(event.target.value);
    onChange(itemQuantity);
  };

  return (
    <div className="form-group quantity-picker-group">
      <label htmlFor="product_display_item_quantity_label" className="control-label">
        {intl.get('quantity')}
      </label>
      <div className="input-group-btn">
        <button
          type="button"
          className="quantity-left-minus btn btn-number"
          data-type="minus"
          data-field=""
          onClick={() => handleQuantityChange(false)}
        >
          <span>–</span>
        </button>
        <div className="quantity-col form-content form-content-quantity">
          <input
            id="product_display_quantity_field"
            className="product-display-item-quantity-select form-control form-control-quantity"
            type="number"
            step="1"
            min="1"
            max="9999"
            value={value}
            onChange={handleChange}
          />
        </div>
        <button
          type="button"
          className="quantity-right-plus btn btn-number"
          data-type="plus"
          data-field=""
          onClick={() => handleQuantityChange(true)}
        >
          <span>+</span>
        </button>
      </div>
      {
      (loading) ? (<div className="miniLoader" />) : ''
    }
    </div>
  );
};

export default ProductQuantityPicker;
