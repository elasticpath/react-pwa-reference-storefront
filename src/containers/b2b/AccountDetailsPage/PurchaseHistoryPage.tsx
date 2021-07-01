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

import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { login } from '../../../hooks/store';
import { cortexFetch } from '../../../components/src/utils/Cortex';
import Config from '../../../ep.config.json';

import './PurchaseHistoryPage.scss';

interface PurchaseHistoryProps {
  history: any
}

const zoomArray = [
  'purchases',
  'purchases:element',
  'purchases:element:created-by',
];

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({
  history,
}) => {
  const [purchaseHistoryData, setPurchaseHistoryData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPurchasesData = async () => {
    const { accountUri } = history.location.state;
    setIsLoading(true);
    await login();
    const res = await cortexFetch(`${accountUri}/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(result => result.json());
    if (res) {
      setPurchaseHistoryData(res._purchases[0]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPurchasesData();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="loader" />
      ) : (
        <div>
          <p className="title">
            {intl.get('purchase-history')}
          </p>
          {purchaseHistoryData && (
            <div className="account-associates">
              <table className="b2b-table accounts-table">
                <thead>
                  <tr>
                    <th>
                      {intl.get('purchase-number')}
                    </th>
                    <th>
                      {intl.get('date')}
                    </th>
                    <th>
                      {intl.get('buyer-name')}
                    </th>
                    <th>{intl.get('total')}</th>
                    <th>{intl.get('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistoryData._element ? purchaseHistoryData._element.map(purchase => (
                    <tr key={purchase.self.uri} className="account-list-rows" onClick={() => {}}>
                      <td className="purchase">{purchase['purchase-number']}</td>
                      <td className="date">{purchase['purchase-date']['display-value']}</td>
                      <td className="buyer-name">{purchase['_created-by'][0]['user-full-name']}</td>
                      <td className="buyer-name">{purchase['monetary-total'][0].display}</td>
                      <td className="buyer-name">{purchase.status}</td>
                    </tr>
                  )) : (
                    <tr><td className="no-data-message">{intl.get('no-previous-purchase-message')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
