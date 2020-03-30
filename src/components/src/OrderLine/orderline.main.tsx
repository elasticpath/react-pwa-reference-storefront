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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';

interface OrderLineProps {
  /** order line */
  orderLine: { [key: string]: any },
}

interface OrderLineState {
  purchase: { [key: string]: any },
}

class OrderLine extends Component<OrderLineProps, OrderLineState> {
  constructor(props) {
    super(props);

    const { orderLine } = this.props;

    this.state = {
      purchase: orderLine,
    };
  }

  render() {
    const {
      purchase,
    } = this.state;
    const { status } = purchase;
    let statusString;
    switch (status) {
      case 'CANCELLED':
        statusString = intl.get('cancelled');
        break;
      case 'COMPLETED':
        statusString = intl.get('completed');
        break;
      default:
        statusString = intl.get('in-progress');
    }
    return (
      <tr>
        <td data-el-value="purchase.number" className="profile-purchase-number">
          <Link to={`/orderDetails/${encodeURIComponent(purchase['purchase-number'])}`} id={`profile_purchase_number_link_${purchase['purchase-number']}`} className={`profile_purchase_number_link_${purchase['purchase-number']}`}>
            {purchase['purchase-number']}
          </Link>
        </td>
        <td data-el-value="purchase.date" className="profile-purchase-date">
          {purchase['purchase-date']['display-value']}
        </td>
        <td data-el-value="purchase.total" className="profile-purchase-total">
          {purchase['monetary-total'][0].display}
        </td>
        <td data-el-value="purchase.status" className="profile-purchase-status">
          {statusString}
        </td>
      </tr>
    );
  }
}

export default OrderLine;
