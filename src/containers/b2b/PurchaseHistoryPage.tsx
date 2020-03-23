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
import { OrderHistoryMain } from '../../components/src';
import { login } from '../../utils/AuthService';
import { cortexFetch } from '../../utils/Cortex';
import Config from '../../ep.config.json';

import './PurchaseHistoryPage.less';

const zoomArray = [
  'defaultprofile:purchases',
  'defaultprofile:purchases:element',
];

interface PurchaseHistoryPageProps extends React.Component<RouteComponentProps> {}
interface PurchaseHistoryPageState {
  defaultProfile: any,
  isLoading: boolean,
}

class PurchaseHistoryPage extends React.Component<PurchaseHistoryPageProps, PurchaseHistoryPageState> {
  constructor(props) {
    super(props);
    this.state = {
      defaultProfile: {},
      isLoading: false,
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { defaultProfile, isLoading } = this.state;
    const purchases = defaultProfile._purchases ? defaultProfile._purchases[0] : {};
    return (
      <div className="purchase-history-page">
        <div className="b2b-header">
          <div className="page-title">{intl.get('purchase-history')}</div>
        </div>
        {
          isLoading
            ? <div className="loader" />
            : <OrderHistoryMain purchaseHistory={purchases} />
        }
      </div>
    );
  }
}

export default PurchaseHistoryPage;
