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
import OrderLine from '../OrderLine/orderline.main';

import './orderhistory.main.less';

interface OrderHistoryMainProps {
  /** purchase history */
  purchaseHistory: { [key: string]: any },
}

function OrderHistoryMain(props: OrderHistoryMainProps) {
  const { purchaseHistory } = props;

  if (purchaseHistory.links && purchaseHistory._element) {
    return (
      <div className="profile-purchase-history-container" data-region="profilePurchaseHistoryRegion">
        <div className="table-responsive">
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
              {purchaseHistory._element.map(orderLine => (
                <OrderLine key={orderLine['purchase-number']} orderLine={orderLine} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-purchase-history-container" data-region="profilePurchaseHistoryRegion">
      <div className="table-responsive">
        <div>
          <p className="purchase-empty">
            {intl.get('no-previous-purchase-message')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryMain;
