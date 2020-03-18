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
import './ordertable.lineitem.less';
import ImageContainer from '../ImageContainer/image.container';

let Config: IEpConfig | any = {};

interface OrderTableLineItemProps {
  /** item */
  item: {
    [key: string]: any
  },
  /** item detail link */
  itemDetailLink?: string,
}

function OrderTableLineItem(props: OrderTableLineItemProps) {
  const { item, itemDetailLink } = props;
  const { code } = item._item[0]._code[0];
  const displayName = item._item[0]._definition[0]['display-name'];
  const options = item._item[0]._definition[0]._options;
  const { quantity } = item;
  const totalPrice = item._total[0].cost[0].display;
  Config = getConfig().config;

  const renderBundleConfiguration = () => {
    let bundleConfigs = null;
    if (item._components) {
      bundleConfigs = (item._components && item._components[0] && item._components[0]._element) ? (item._components[0]._element) : (null);
    }
    if (item._dependentlineitems) {
      bundleConfigs = (item._dependentlineitems && item._dependentlineitems[0] && item._dependentlineitems[0]._element) ? (item._dependentlineitems[0]._element) : (null);
    }
    if (bundleConfigs) {
      return bundleConfigs.map(config => (
        <li className="bundle-configuration" key={config}>
          <label htmlFor="option-name" className="option-name">
            {config._item[0]._definition[0]['display-name']}
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
    if (options && options[0]._element) {
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
    <tr className="order-lineitem-row">
      <td className="thumbnail-col">
        <ImageContainer className="thumbnail" isSkuImage fileName={code} imgUrl={Config.skuImagesUrl.replace('%sku%', code)} />
      </td>
      <td className="title-col">
        <Link to={`${itemDetailLink}/${encodeURIComponent(code)}`}>
          {displayName}
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
        <div>
          <span className="purchase-price">
            {totalPrice}
          </span>
        </div>
      </td>
    </tr>
  );
}

OrderTableLineItem.defaultProps = {
  itemDetailLink: '',
};

export default OrderTableLineItem;
