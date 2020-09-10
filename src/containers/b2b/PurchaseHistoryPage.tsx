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
import { RouteComponentProps } from 'react-router-dom';
import intl from 'react-intl-universal';
import OrderHistoryMain from '../../components/src/OrderHistory/orderhistory.main';
import { cortexFetch } from '../../components/src/utils/Cortex';
import { login } from '../../hooks/store';
import Config from '../../ep.config.json';

import './PurchaseHistoryPage.scss';

const zoomArray = [
  'defaultprofile:purchases',
  'defaultprofile:purchases:element',
  'defaultprofile:selectedaccount',
  'defaultprofile:selectedaccount:purchases',
  'defaultprofile:selectedaccount:purchases:element',
];

interface PurchaseHistoryPageProps extends React.Component<RouteComponentProps> {}
interface PurchaseHistoryPageState {
  defaultProfile: any,
  isLoading: boolean,
  accountData: any,
}

class PurchaseHistoryPage extends React.Component<PurchaseHistoryPageProps, PurchaseHistoryPageState> {
  constructor(props) {
    super(props);
    this.state = {
      defaultProfile: {},
      isLoading: false,
      accountData: undefined,
    };
  }

  async componentDidMount() {
    await this.fetchPurchaseData();
  }

  async fetchPurchaseData() {
    this.setState({ isLoading: true });
    try {
      await login();
      const res = await cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      });
      const profileData = await res.json();
      this.setState({ defaultProfile: profileData._defaultprofile[0], isLoading: false });
      if (profileData._defaultprofile[0]._selectedaccount) {
        this.setState({ accountData: profileData._defaultprofile[0]._selectedaccount[0] });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const {
      defaultProfile, isLoading, accountData,
    } = this.state;
    const purchases = defaultProfile._purchases ? defaultProfile._purchases[0] : {};
    return (
      <div className="purchase-history-page">
        <div className="b2b-header">
          <h1 className="page-title">{intl.get('purchase-history')}</h1>
        </div>
        {
          isLoading
            ? <div className="loader" />
            : (
              <React.Fragment>
                <OrderHistoryMain purchaseHistory={purchases} />
                {accountData && (
                  <div>
                    <p>{accountData['account-business-name']}</p>
                    <OrderHistoryMain purchaseHistory={accountData._purchases[0]} />
                  </div>
                )}
              </React.Fragment>
            )
        }
      </div>
    );
  }
}

export default PurchaseHistoryPage;
