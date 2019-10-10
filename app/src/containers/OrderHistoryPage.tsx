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
import { RouteComponentProps } from 'react-router-dom';
import { PurchaseDetailsMain } from '@elasticpath/store-components';
import { login } from '../utils/AuthService';
import { purchaseLookup, cortexFetchPurchaseLookupForm } from '../utils/CortexLookup';
import { cortexFetch } from '../utils/Cortex';
import Config from '../ep.config.json';

import './OrderHistoryPage.less';

const zoomArray = [
  'defaultcart:additemstocartform',
];

interface OrderHistoryPageProps extends React.Component<RouteComponentProps> {
    match: {
        [key: string]: any
    },
    history: any,
}
interface OrderHistoryPageState {
    purchaseData: any,
}

class OrderHistoryPage extends React.Component<OrderHistoryPageProps, OrderHistoryPageState> {
  constructor(props) {
    super(props);
    this.state = {
      purchaseData: undefined,
    };
    this.moveToCart = this.moveToCart.bind(this);
  }

  componentDidMount() {
    this.fetchPurchaseData();
  }

  fetchPurchaseData() {
    const { match } = this.props;
    const orderId = decodeURIComponent(match.params.url);
    login().then(() => {
      const defaultCartFetch = cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(res => res.json());
      const purchaseFormFetch = cortexFetchPurchaseLookupForm().then(() => purchaseLookup(orderId));

      Promise.all([purchaseFormFetch, defaultCartFetch])
        .then((res) => {
          this.setState({
            purchaseData: { ...res[0], _defaultcart: res[1]._defaultcart },
          });
        });
    });
  }

  moveToCart() {
    const { history } = this.props;
    history.push('/mycart');
  }

  render() {
    const { purchaseData } = this.state;
    const itemDetailLink = '/itemdetail';
    if (purchaseData) {
      return (
        <div>
          <div className="app-main" style={{ display: 'block' }}>
            <div className="container">
              <h2 className="view-title">
                {intl.get('purchase-details')}
              </h2>
              <PurchaseDetailsMain data={purchaseData} itemDetailLink={itemDetailLink} onMoveToCart={this.moveToCart} onConfiguratorAddToCart={this.moveToCart} onReorderAllProducts={this.moveToCart} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="loader" />
      </div>
    );
  }
}

export default OrderHistoryPage;
