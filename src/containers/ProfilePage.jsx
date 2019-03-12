/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import { login } from '../utils/AuthService';
import ProfileInfoMain from '../components/profileInfo.main';
import ProfileemailinfoMain from '../components/profileemailinfo.main';
import OrderHistoryMain from '../components/orderhistory.main';
import ProfileAddressesMain from '../components/profileaddresses.main';
import ProfilePaymentMethodsMain from '../components/profilepaymentmethods.main';
import { cortexFetch } from '../utils/Cortex';
import './ProfilePage.less';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultprofile',
  'defaultprofile:purchases',
  'defaultprofile:purchases:element',
  'defaultprofile:addresses',
  'defaultprofile:addresses:addressform',
  'defaultprofile:emails',
  'defaultprofile:emails:element',
  'defaultprofile:emails:element:list',
  'defaultprofile:emails:element:profile',
  'defaultprofile:emails:emailform',
  'defaultprofile:emails:profile',
  'defaultprofile:addresses:element',
  'defaultprofile:addresses:billingaddresses:default',
  'defaultprofile:paymentmethods',
  'defaultprofile:paymentmethods:paymenttokenform',
  'defaultprofile:paymentmethods:element',
];

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: undefined,
      invalidPermission: false,
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
          if (res && res._defaultprofile) {
            this.setState({
              profileData: res._defaultprofile[0],
            });
          } else {
            this.setState({
              invalidPermission: true,
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  checkPermissions() {
    const { invalidPermission } = this.state;
    if (Config.b2b.enable && invalidPermission) {
      return (
        <div className="message-permission">
          <h2>{intl.get('permission-message')}</h2>
        </div>
      );
    }
    return (
      <div className="loader" />
    );
  }

  render() {
    const { profileData } = this.state;
    return (
      <div>
        <div className="container profile-container">
          <div data-region="profileTitleRegion" style={{ display: 'block' }}>
            <h1 className="view-title">
              {intl.get('profile')}
            </h1>
          </div>
          {profileData ? (
            <div>
              <ProfileemailinfoMain profileInfo={profileData} onChange={this.fetchProfileData} />
              <ProfileInfoMain profileInfo={profileData} onChange={this.fetchProfileData} />
              {(profileData._purchases) ? (
                <OrderHistoryMain purchaseHistory={profileData._purchases[0]} />
              ) : ('')}
              {(profileData._addresses) ? (
                <ProfileAddressesMain addresses={profileData._addresses[0]} onChange={this.fetchProfileData} />
              ) : ('')}
              {(profileData._paymentmethods) ? (
                <ProfilePaymentMethodsMain paymentMethods={profileData._paymentmethods[0]} onChange={this.fetchProfileData} />
              ) : ('')}
            </div>
          ) : (
            <div>
              {this.checkPermissions()}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ProfilePage;
