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
];

const zoomArrayAccounts = [
  'element',
  'element:identifier',
  'element:purchases',
  'element:purchases:element',
];

interface PurchaseHistoryPageProps extends React.Component<RouteComponentProps> {}
interface PurchaseHistoryPageState {
  defaultProfile: any,
  isLoading: boolean,
  accountData: any,
  selectedAccountName: string,
}

class PurchaseHistoryPage extends React.Component<PurchaseHistoryPageProps, PurchaseHistoryPageState> {
  constructor(props) {
    super(props);
    this.state = {
      defaultProfile: {},
      isLoading: false,
      accountData: undefined,
      selectedAccountName: '',
    };
  }

  async componentDidMount() {
    await this.fetchPurchaseData();
    if (Config.b2b.enable && localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      await this.getAccountData();
    }
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      this.setState({ isLoading: false });
    }
  }

  async getAccountData() {
    try {
      await login();
      const account = await cortexFetch(`/accounts/${Config.cortexApi.scope}/?zoom=${zoomArrayAccounts.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      });
      const accountJson = await account.json();
      if (localStorage.getItem(`${Config.cortexApi.scope}_b2bSharedId`)) {
        const selectedAccount = accountJson._element.filter(el => el._identifier[0]['shared-id'] === localStorage.getItem(`${Config.cortexApi.scope}_b2bSharedId`));
        if (selectedAccount && selectedAccount.length > 0 && selectedAccount[0]._purchases) {
          this.setState({ accountData: selectedAccount[0]._purchases[0], selectedAccountName: selectedAccount[0]['business-name'] });
        } else {
          this.setState({ accountData: undefined, selectedAccountName: '' });
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }

  render() {
    const {
      defaultProfile, isLoading, accountData, selectedAccountName,
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
                    <p>{selectedAccountName}</p>
                    <OrderHistoryMain purchaseHistory={accountData} />
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
