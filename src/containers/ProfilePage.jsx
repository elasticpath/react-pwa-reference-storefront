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
import { login } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import ProfileInfoMain from '../components/profileInfo.main';
import OrderHistoryMain from '../components/orderhistory.main';

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
  }

  componentDidMount() {
    login().then(() => {
      fetch(`${Config.cortexApi.path}/?zoom=${zoomArray.join()}`,
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
          console.error(error);
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
                Profile
              </h1>
            </div>
            <ProfileInfoMain defaultProfile={profileData} />
            <div data-region="profileSubscriptionSummaryRegion" style={{ display: 'none' }}>
              <div className="table-responsive">
                <h2>
                  Subscriptions
                </h2>
                <table className="table table-condensed striped-table">
                  <thead>
                    <tr>
                      <th>
                        Subscription
                      </th>
                      <th>
                        Quantity
                      </th>
                      <th>
                        Next Billing Date
                      </th>
                    </tr>
                  </thead>
                  <tbody />
                </table>

              </div>
            </div>
            <OrderHistoryMain purchaseHistory={profileData._purchases[0]} />
            <div data-region="profileAddressesRegion" style={{ display: 'block' }}>
              <div>
                <h2>
                  Addresses
                </h2>
                <ul className="profile-addresses-listing" data-el-container="profile.addresses">
                  <li className="profile-address-container">
                    <div data-region="profileAddressComponentRegion" style={{ display: 'block' }}>
                      <ul className="address-container">
                        <li className="address-name" data-el-value="address.name">
                          {`${profileData._addresses[0]._element[0].name['given-name']} ${profileData._addresses[0]._element[0].name['family-name']}`}
                        </li>
                        <li className="address-street-address" data-el-value="address.streetAddress">
                          {profileData._addresses[0]._element[0].address['street-address']}
                        </li>
                        <li className="address-extended-address" data-el-value="address.extendedAddress" />
                        <li>
                          <span className="address-city" data-el-value="address.city">
                            {`${profileData._addresses[0]._element[0].address.locality}, `}
                          </span>
                          <span className="address-region" data-el-value="address.region">
                            {`${profileData._addresses[0]._element[0].address.region}, `}
                          </span>
                          <span className="address-country" data-el-value="address.country">
                            {`${profileData._addresses[0]._element[0].address['country-name']}, `}
                          </span>
                          <span className="address-postal-code" data-el-value="address.postalCode">
                            {profileData._addresses[0]._element[0].address['postal-code']}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <button className="btn profile-edit-address-btn" type="button" data-el-label="profile.editAddressBtn">
                      Edit
                    </button>
                    <button className="btn profile-delete-address-btn" type="button" data-el-label="profile.deleteAddressBtn" data-actionlink="">
                      Delete
                    </button>
                  </li>
                </ul>

                <button className="btn btn-primary profile-new-address-btn" type="button" data-el-label="profile.addNewAddressBtn">
                  Add a New Address
                </button>
              </div>
            </div>
            <div data-region="paymentMethodsRegion" style={{ display: 'block' }}>
              <div>
                <h2>
                  Payment Methods
                </h2>
                <ul className="profile-payment-methods-listing">
                  <li className="profile-payment-method-container">
                    <div data-region="paymentMethodComponentRegion" className="profile-payment-method-label-container" style={{ display: 'block' }}>
                      <span data-el-value="payment.token" className="payment-method-container">
                        {profileData._paymentmethods[0]._element[0]['display-name']}
                      </span>
                    </div>
                    <button className="btn profile-delete-payment-btn" type="button" data-el-label="profile.deletePaymentBtn">
                      Delete
                    </button>
                  </li>
                </ul>
                <button className="btn btn-primary profile-new-payment-btn" type="button" data-el-label="profile.addNewPaymentMethodBtn">
                  Add a New Payment Method
                </button>
              </div>
            </div>
          </div>
          <AppFooterMain />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProfilePage;
