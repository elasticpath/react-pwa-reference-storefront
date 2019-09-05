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
import { Link } from 'react-router-dom';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import imgPlaceholder from '../images/img_missing_horizontal@2x.png';
import './ordertable.lineitem.less';

let Config: IEpConfig | any = {};

interface OrderTableLineItemProps {
    item: {
        [key: string]: any
    },
    itemDetailLink?: string,
}

const OrderTableLineItem: React.FunctionComponent<OrderTableLineItemProps> = (props: OrderTableLineItemProps) => {
  const { item, itemDetailLink } = props;
  const { code } = item.item.code;
  const name = item.item.definition.displayName;
  const definitionOptions = item.item.definition.options;
  const { quantity } = item;
  const totalPrice = item.total.cost[0].display;
  Config = getConfig().config;

  const renderBundleConfiguration = () => {
    let bundleConfigs = null;
    if (item.components) {
      bundleConfigs = (item.components && item.components && item.components.elements) ? (item.components.elements) : (null);
    }
    if (item.dependentlineitems) {
      bundleConfigs = (item.dependentlineitems && item.dependentlineitems && item.dependentlineitems.elements) ? (item.dependentlineitems.elements) : (null);
    }
    if (bundleConfigs) {
      return bundleConfigs.map(config => (
        <li className="bundle-configuration" key={config}>
          <label htmlFor="option-name" className="option-name">
            {config.item.definition.displayName}
            &nbsp;
          </label>
        </li>
      ));
    }
    return null;
  };

  const renderConfiguration = () => {
    const keys = (item.configuration) ? (Object.keys(item.configuration)) : ('');
    if (keys) {
      return keys.map(key => (
        <li className="configuration" key={key}>
          <label htmlFor="option-name" className="option-name">
            {key}
            :&nbsp;
          </label>
          <span>
            {item.configuration[key]}
          </span>
        </li>
      ));
    }
    return null;
  };

  const renderOptions = () => {
    if (definitionOptions) {
      return (
        definitionOptions.elements.map(option => (
          <li className="order-lineitem-option" key={option.displayName}>
            <label htmlFor="order-lineitem-option-value" className="order-lineitem-option-name">
              {option.displayName}
              :&nbsp;
            </label>
            <span className="order-lineitem-option-value">
              {option.value.displayName}
            </span>
          </li>
        ))
      );
    }
    return null;
  };

  return (
    <tr className="order-lineitem-row">
      <td className="thumbnail-col">
        <img
          className="thumbnail"
          src={Config.skuImagesUrl.replace('%sku%', code)}
          alt="Not Available"
          onError={(e) => {
            const element:any = e.target;
            element.src = imgPlaceholder;
          }}
        />
      </td>
      <td className="title-col">
        <Link to={`${itemDetailLink}/${encodeURIComponent(code)}`}>
          {name}
        </Link>
      </td>
      <td className="options-col" style={{ display: 'table-cell' }}>
        <ul className="options-container">
          {renderOptions()}
          {renderConfiguration()}
          {renderBundleConfiguration()}
        </ul>
      </td>
      <td className="quantity-col">
        <span className="quantity-val">
          {quantity}
        </span>
      </td>
      <td className="total-price-col" style={{ display: 'inline-block' }}>
        <div style={{ display: 'block' }}>
          <span className="purchase-price">
            {totalPrice}
          </span>
        </div>
      </td>
    </tr>
  );
};

OrderTableLineItem.defaultProps = {
  itemDetailLink: '',
};

export default OrderTableLineItem;
