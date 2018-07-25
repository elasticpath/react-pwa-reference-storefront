/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class OrderLine extends React.Component {
  static propTypes = {
    orderLine: PropTypes.objectOf(PropTypes.any).isRequired,
  }

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
    const { status } = purchase.status;
    let statusString;
    switch (status) {
      case 'CANCELLED':
        statusString = 'Cancelled';
        break;
      case 'COMPLETED':
        statusString = 'Completed';
        break;
      default:
        statusString = 'In Progress';
    }
    return (
      <tr>
        <td data-el-value="purchase.number" className="profile-purchase-number">
          <Link to={`/orderDetails/${encodeURIComponent(purchase.self.uri)}`}>
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
