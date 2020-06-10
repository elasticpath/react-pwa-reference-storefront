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
import { Link, RouteComponentProps } from 'react-router-dom';

import ProfileInfoMain from '../components/src/ProfileInfo/profileInfo.main';
import ProfileemailinfoMain from '../components/src/ProfileEmailInfo/profileemailinfo.main';
import PaymentSelectorMain from '../components/src/PaymentSelectorMain/paymentselector.main';
import ProfileComplianceMain from '../components/src/ProfileCompliance/profilecompliance.main';
import AddressContainer from '../components/src/AddressContainer/address.container';

import { login } from '../hooks/store';
import { cortexFetch } from '../components/src/utils/Cortex';
import Config from '../ep.config.json';

import './ProfilePage.scss';

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
  'defaultprofile:addresses:billingaddresses',
  'defaultprofile:addresses:billingaddresses:default',
  'defaultprofile:addresses:billingaddresses:selector',
  'defaultprofile:addresses:billingaddresses:selector:chosen',
  'defaultprofile:addresses:billingaddresses:selector:chosen:description',
  'defaultprofile:addresses:billingaddresses:selector:chosen:selectaction',
  'defaultprofile:addresses:shippingaddresses',
  'defaultprofile:addresses:shippingaddresses:default',
  'defaultprofile:addresses:shippingaddresses:selector',
  'defaultprofile:addresses:shippingaddresses:selector:chosen',
  'defaultprofile:addresses:shippingaddresses:selector:chosen:description',
  'defaultprofile:addresses:shippingaddresses:selector:chosen:selectaction',

  'defaultprofile:paymentmethods:paymenttokenform',
  'defaultprofile:paymentmethods',
  'defaultprofile:paymentmethods:element',

  'data-policies:element',
  'data-policies:element:datapolicyconsentform',
  'passwordresetform',

  // zoom for payments ep version > 7.6
  'defaultprofile:paymentinstruments:element',
  'defaultprofile:paymentinstruments:default',
  'defaultprofile:paymentinstruments:defaultinstrumentselector',
  'defaultprofile:paymentinstruments:defaultinstrumentselector:chosen',
  'defaultprofile:paymentinstruments:defaultinstrumentselector:chosen:description',
  'defaultprofile:paymentinstruments:defaultinstrumentselector:choice',
  'defaultprofile:paymentinstruments:defaultinstrumentselector:choice:description',
];

interface ProfilePageState {
    profileData: any,
    dataPolicyData: any,
    invalidPermission: boolean,
    showResetPasswordButton: boolean,
}

class ProfilePage extends React.Component<RouteComponentProps, ProfilePageState> {
  constructor(props) {
    super(props);
    this.state = {
      profileData: undefined,
      dataPolicyData: undefined,
      invalidPermission: false,
      showResetPasswordButton: false,
    };
    this.fetchProfileData = this.fetchProfileData.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.renderPayments = this.renderPayments.bind(this);
  }

  async componentDidMount() {
    await this.fetchProfileData();
  }

  async fetchProfileData() {
    try {
      await login();
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      };
      if (Config.Compliance.enable) {
        options.headers['X-Ep-Data-Policy-Segments'] = `${Config.Compliance.dataPolicySegments}`;
      }
      const res = await cortexFetch(`/?zoom=${zoomArray.join()}`, options);
      const profileData = await res.json();
      if (profileData && profileData._defaultprofile) {
        this.setState({
          profileData: profileData._defaultprofile[0],
          dataPolicyData: profileData['_data-policies'] ? profileData['_data-policies'][0] : null,
        });
      } else {
        this.setState({
          invalidPermission: true,
        });
      }
      if (profileData && profileData._passwordresetform) {
        this.setState({ showResetPasswordButton: true });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
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

  changePassword() {
    const { history } = this.props;
    history.push('/password_change', { returnPage: '/profile' });
  }

  renderShippingAddress() {
    const { profileData } = this.state;
    if (profileData && profileData._addresses && profileData._addresses[0]._shippingaddresses && profileData._addresses[0]._shippingaddresses[0]._selector && profileData._addresses[0]._shippingaddresses[0]._selector[0]._chosen) {
      const selectedAddress = profileData._addresses[0]._shippingaddresses[0]._selector[0]._chosen[0]._description[0].address;
      const selectedAddressName = profileData._addresses[0]._shippingaddresses[0]._selector[0]._chosen[0]._description[0].name;
      return (
        <div className="address-book-content">
          <h2>
            {intl.get('ship-to')}
          </h2>
          <p>
            {intl.get('your-account-shipping-default')}
          </p>
          <div className="selected-address-container">
            <div data-region="checkoutAddressRegion">
              <AddressContainer name={selectedAddressName} address={selectedAddress} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <p>
          {intl.get('no-shipping-address-message')}
        </p>
      </div>
    );
  }

  renderBillingAddress() {
    const { profileData } = this.state;
    if (profileData && profileData._addresses && profileData._addresses[0]._billingaddresses && profileData._addresses[0]._billingaddresses[0]._selector && profileData._addresses[0]._billingaddresses[0]._selector[0]._chosen) {
      const selectedAddress = profileData._addresses[0]._billingaddresses[0]._selector[0]._chosen[0]._description[0].address;
      const selectedAddressName = profileData._addresses[0]._billingaddresses[0]._selector[0]._chosen[0]._description[0].name;
      return (
        <div className="address-book-content">
          <h2>
            {intl.get('bill-to')}
          </h2>
          <p>
            {intl.get('your-account-billing-default')}
          </p>
          <div className="selected-address-container">
            <div data-region="checkoutAddressRegion">
              <AddressContainer name={selectedAddressName} address={selectedAddress} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <p>
          {intl.get('no-billing-address-message')}
        </p>
      </div>
    );
  }

  renderPayments() {
    const { profileData } = this.state;
    const isDisabledPayment = !(profileData && profileData._paymentinstruments);

    if (profileData) {
      if (
        profileData._paymentinstruments
          && profileData._paymentinstruments[0]
          && profileData._paymentinstruments[0]._defaultinstrumentselector
      ) {
        return (
          <PaymentSelectorMain
            paymentInstrumentSelector={profileData._paymentinstruments[0]._defaultinstrumentselector[0]}
            onChange={this.fetchProfileData}
            disableAddPayment={false}
            shouldPostToProfile
            allowSelectionContainerHighlight={false}
          />
        );
      }

      if (
        profileData._paymentmethods
        && profileData._paymentmethods[0]
      ) {
        return (
          <PaymentSelectorMain
            paymentMethods={profileData._paymentmethods[0]}
            onChange={this.fetchProfileData}
            disableAddPayment={false}
            shouldPostToProfile
            allowSelectionContainerHighlight={false}
          />
        );
      }
    }
    return (
      <PaymentSelectorMain
        paymentInstrumentSelector={{}}
        onChange={this.fetchProfileData}
        disableAddPayment={isDisabledPayment}
        shouldPostToProfile
        allowSelectionContainerHighlight={false}
      />
    );
  }

  render() {
    const {
      profileData, showResetPasswordButton, dataPolicyData,
    } = this.state;
    const isB2B = Config.b2b.enable;
    const emailTitle = isB2B ? intl.get('account-information') : intl.get('personal-information');
    return (
      <div>
        <div className="container profile-container">
          <div className="b2b-header" data-region="profileTitleRegion">
            <h1 className="page-title">
              {intl.get(isB2B ? 'my-account' : 'my-profile')}
            </h1>
          </div>
          {profileData ? (
            <div className="profile-data" role="region">
              <div className="profile-info-container">
                <h2 className="profile-info-container-title">
                  {intl.get('general')}
                </h2>
                <div className="profile-info-col">
                  <div className="profile-info-block">
                    <h2>
                      {emailTitle}
                    </h2>
                    <ProfileemailinfoMain profileInfo={profileData} onChange={this.fetchProfileData} />
                    <ProfileInfoMain profileInfo={profileData} onChange={this.fetchProfileData} />
                    {showResetPasswordButton && (
                      <div className="personal-information-container">
                        <button className="ep-btn primary change-password-btn wide" type="button" onClick={this.changePassword}>Reset Password</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="profile-info-container">
                <div className="address-info-container title">
                  <h2 className="profile-info-container-title">
                    {intl.get('account-defaults')}
                  </h2>
                  <Link to="/account/address-book">
                    <button className="ep-btn primary edit-addresses-btn wide" type="button">{intl.get('edit-addresses')}</button>
                  </Link>
                </div>
                <div className="address-info-container profile-info-block">
                  <div className="checkout-shipping-container">
                    {this.renderBillingAddress()}
                  </div>
                  <div className="checkout-billing-container">
                    {this.renderShippingAddress()}
                  </div>
                </div>
              </div>
              <div className="profile-info-container">
                <h2 className="profile-info-container-title">
                  {intl.get('payment')}
                </h2>
                {this.renderPayments()}
              </div>
              {(Config.Compliance.enable) ? (
                <div className="profile-info-container">
                  <h2 className="profile-info-container-title">
                    {intl.get('compliance')}
                  </h2>
                  <div className="profile-info-col">
                    <div className="profile-info-block">
                      {(dataPolicyData && dataPolicyData._element) ? (
                        <ProfileComplianceMain dataPolicies={dataPolicyData} onChange={this.fetchProfileData} />
                      ) : ('')}
                    </div>
                  </div>
                </div>
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
