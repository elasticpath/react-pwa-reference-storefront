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
import intl from 'react-intl-universal';
import OrderTableLineItem from './ordertable.lineitem';

const OrderTableMain = (props) => {
  const { data } = props;
  return (
    <div className="order-main-inner table-responsive">
      <table className="table">
        <thead className="order-lineitem-table-headings">
          <tr>
            <th className="order-heading-product">
              <span className="lineitem-asset-col">
                {intl.get('product')}
              </span>
            </th>
            <th className="order-heading-name">
              {intl.get('name')}
            </th>
            <th className="order-heading-options">
              {intl.get('options')}
            </th>
            <th className="order-heading-quantity">
              {intl.get('quantity')}
            </th>
            <th className="order-heading-item-total">
              {intl.get('total-price')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data._lineitems[0]._element.map(product => (
            <OrderTableLineItem key={product._item[0]._code[0].code} item={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

OrderTableMain.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OrderTableMain;
