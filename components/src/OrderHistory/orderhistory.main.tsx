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
import OrderLine from '../OrderLine/orderline.main';

import './orderhistory.main.less';

let intl = { get: str => str };

interface OrderHistoryMainProps {
  purchaseHistory: { [key: string]: any },
}
interface OrderHistoryMainState {
  purchases: { [key: string]: any },
}

class OrderHistoryMain extends React.Component<OrderHistoryMainProps, OrderHistoryMainState> {
  constructor(props) {
    super(props);
    const epConfig = getConfig();
    ({ intl } = epConfig);
    const { purchaseHistory } = this.props;
    this.state = {
      purchases: purchaseHistory,
    };
  }

  render() {
    const {
      purchases,
    } = this.state;
    if (purchases.links && purchases._element) {
      return (
        <div className="profile-purchase-history-container" data-region="profilePurchaseHistoryRegion" style={{ display: 'block' }}>
          <div className="table-responsive">
            <h2>
              {intl.get('purchase-history')}
            </h2>
            <table className="table table-condensed striped-table">
              <thead>
                <tr>
                  <th>
                    {intl.get('purchase-number')}
                  </th>
                  <th>
                    {intl.get('date')}
                  </th>
                  <th>
                    {intl.get('total')}
                  </th>
                  <th>
                    {intl.get('status')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases._element.map(orderLine => (
                  <OrderLine key={orderLine['purchase-number']} orderLine={orderLine} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return (
      <div className="profile-purchase-history-container" data-region="profilePurchaseHistoryRegion" style={{ display: 'block' }}>
        <div className="table-responsive">
          <h3>
            {intl.get('purchase-history')}
          </h3>
          <div>
            <p>
              {intl.get('no-previous-purchase-message')}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderHistoryMain;
