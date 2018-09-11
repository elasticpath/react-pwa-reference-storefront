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
import { Link } from 'react-router-dom';
import imgPlaceholder from '../images/img-placeholder.png';

const Config = require('Config');

const OrderTableLineItem = (props) => {
  const { item } = props;
  const { code } = item._item[0]._code[0];
  const { uri } = item._item[0].self;
  const displayName = item._item[0]._definition[0]['display-name'];
  const options = item._item[0]._definition[0]._options;
  const { quantity } = item;
  const totalPrice = item._total[0].cost[0].display;

  const renderOptions = () => {
    if (options) {
      return (
        options[0]._element.map(option => (
          <li className="order-lineitem-option" key={option['display-name']}>
            <label htmlFor="order-lineitem-option-value" className="order-lineitem-option-name">
              {option['display-name']}
              :&nbsp;
            </label>
            <span className="order-lineitem-option-value">
              {option._value[0]['display-name']}
            </span>
          </li>
        ))
      );
    }
    return null;
  };

  return (
    <tr>
      <td className="order-lineitem-thumbnail-col">
        <img className="order-lineitem-thumbnail" src={Config.skuImagesUrl.replace('%sku%', code)} onError={(e) => { e.target.src = imgPlaceholder; }} alt="Not Available" />
      </td>
      <td className="order-lineitem-title-col">
        <Link to={`/itemdetails/${encodeURIComponent(uri)}`}>
          {displayName}
        </Link>
      </td>
      <td className="order-lineitem-options-col" style={{ display: 'table-cell' }}>
        <ul className="order-lineitem-options-container">
          {renderOptions()}
        </ul>
      </td>
      <td className="order-lineitem-quantity-col">
        <span className="order-lineitem-quantity-val">
          {quantity}
        </span>
      </td>
      <td className="order-lineitem-total-price-col" style={{ display: 'table-cell' }}>
        <div style={{ display: 'block' }}>
          <span className="order-total-purchase-price">
            {totalPrice}
          </span>
        </div>
      </td>
    </tr>
  );
};

OrderTableLineItem.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OrderTableLineItem;
