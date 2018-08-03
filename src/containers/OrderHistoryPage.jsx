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
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { login } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import PurchaseDetailsMain from '../components/purchasedetails.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

const zoomArray = [
  'paymentmeans:element',
  'shipments:element:destination',
  'shipments:element:shippingoption',
  'billingaddress',
  'discount',
  'appliedpromotions:element',
  'lineitems:element',
  'lineitems:element:options:element',
  'lineitems:element:options:element:value',
];

class OrderHistoryPage extends React.Component {
  static propTypes = {
    match: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      purchaseData: undefined,
    };
  }

  componentDidMount() {
    this.fetchPurchaseData();
  }

  fetchPurchaseData() {
    const { match } = this.props;
    const uri = decodeURIComponent(match.params.url);
    login().then(() => {
      cortexFetch(`${uri}?zoom=${zoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            purchaseData: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  render() {
    const { purchaseData } = this.state;
    if (purchaseData) {
      return (
        <div>
          <AppHeaderMain />
          <div className="app-main" style={{ display: 'block' }}>
            <div className="container">
              <h2>
                {intl.get('purchase-details')}
              </h2>
              <PurchaseDetailsMain data={purchaseData} />
            </div>
          </div>
          <AppFooterMain />
        </div>
      );
    }
    return (
      <div>
        <AppHeaderMain />
        <div className="loader" />
        <AppFooterMain />
      </div>
    );
  }
}

export default OrderHistoryPage;
