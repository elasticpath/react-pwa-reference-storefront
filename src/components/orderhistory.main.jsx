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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import OrderLine from './orderline.main';

class OrderHistoryMain extends React.Component {
  static propTypes = {
    purchaseHistory: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    const { purchaseHistory } = this.props;
    this.state = {
      purchases: purchaseHistory,
    };
  }

  render() {
    const {
      purchases,
    } = this.state;
    if (purchases.links && purchases.links.length > 0) {
      return (
        <div data-region="profilePurchaseHistoryRegion" style={{ display: 'block' }}>
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
      <div data-region="profilePurchaseHistoryRegion" style={{ display: 'block' }}>
        <div className="table-responsive">
          <h2>
            {intl.get('purchase-history')}
          </h2>
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
