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
import { login } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import ProfileInfoMain from '../components/profileInfo.main';
import OrderHistoryMain from '../components/orderhistory.main';
import ProfileAddressesMain from '../components/profileaddresses.main';
import ProfilePaymentMethodsMain from '../components/profilepaymentmethods.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultprofile',
  'defaultprofile:subscriptions',
  'defaultprofile:subscriptions:element',
  'defaultprofile:purchases',
  'defaultprofile:purchases:element',
  'defaultprofile:addresses',
  'defaultprofile:addresses:element',
  'defaultprofile:addresses:billingaddresses:default',
  'defaultprofile:paymentmethods',
  'defaultprofile:paymentmethods:element',
];

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: undefined,
    };
    this.fetchProfileData = this.fetchProfileData.bind(this);
  }

  componentDidMount() {
    this.fetchProfileData();
  }

  componentWillReceiveProps() {
    this.fetchProfileData();
  }

  fetchProfileData() {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            profileData: res._defaultprofile[0],
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  render() {
    const { profileData } = this.state;
    if (profileData) {
      return (
        <div>
          <AppHeaderMain />
          <div className="container">
            <div data-region="profileTitleRegion" style={{ display: 'block' }}>
              <h1>
                {intl.get('profile')}
              </h1>
            </div>
            <ProfileInfoMain profileInfo={profileData} onChange={this.fetchProfileData} />
            <OrderHistoryMain purchaseHistory={profileData._purchases[0]} />
            <ProfileAddressesMain addresses={profileData._addresses[0]} onChange={this.fetchProfileData} />
            <ProfilePaymentMethodsMain paymentMethods={profileData._paymentmethods[0]} onChange={this.fetchProfileData} />
          </div>
          <AppFooterMain />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProfilePage;
