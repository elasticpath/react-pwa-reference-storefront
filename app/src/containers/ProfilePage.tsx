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
import { RouteComponentProps } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import {
  ProfileInfoMain, ProfileemailinfoMain, ProfileAddressesMain, ProfilePaymentMethodsMain, OrderHistoryMain, AddressFormMain,
} from '@elasticpath/store-components';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import Config from '../ep.config.json';

import './ProfilePage.less';

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
  'passwordresetform',
];

interface ProfilePageState {
    profileData: any,
    invalidPermission: boolean,
    showResetPasswordButton: boolean,
    openAddressModal: boolean,
    addressUrl: any,
}

class ProfilePage extends React.Component<RouteComponentProps, ProfilePageState> {
  constructor(props) {
    super(props);
    this.state = {
      profileData: undefined,
      invalidPermission: false,
      showResetPasswordButton: false,
      openAddressModal: false,
      addressUrl: undefined,
    };
    this.fetchProfileData = this.fetchProfileData.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleNewAddress = this.handleNewAddress.bind(this);
    this.handleEditAddress = this.handleEditAddress.bind(this);
    this.handleCloseAddressModal = this.handleCloseAddressModal.bind(this);
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
          if (res && res._passwordresetform) {
            this.setState({ showResetPasswordButton: true });
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

  changePassword() {
    const { history } = this.props;
    history.push('/password_change', { returnPage: '/profile' });
  }

  handleNewAddress() {
    this.setState({
      openAddressModal: true,
      addressUrl: undefined,
    });
  }

  handleEditAddress(addressLink) {
    this.setState({
      openAddressModal: true,
      addressUrl: { address: addressLink },
    });
  }

  handleCloseAddressModal() {
    this.setState({ openAddressModal: false });
  }

  renderNewAddressModal() {
    const { openAddressModal, addressUrl } = this.state;
    const newOrEdit = (addressUrl && addressUrl.address) ? intl.get('edit') : intl.get('new');
    return (
      <Modal open={openAddressModal} onClose={this.handleCloseAddressModal}>
        <div className="modal-lg new-address-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {newOrEdit}
                {' '}
                {intl.get('address')}
              </h2>
            </div>
            <div className="modal-body">
              <AddressFormMain onCloseModal={this.handleCloseAddressModal} fetchData={this.fetchProfileData} addressData={addressUrl} />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  render() {
    const { profileData, showResetPasswordButton } = this.state;
    return (
      <div>
        <div className="container profile-container">
          <div data-region="profileTitleRegion" style={{ display: 'block' }}>
            <h1 className="view-title">
              {intl.get('profile')}
            </h1>
          </div>
          {profileData ? (
            <div className="profile-data">
              <div className="profile-info-container">
                <h3 className="profile-info-container-title">
                  {intl.get('general')}
                </h3>
                <div className="profile-info-col">
                  <div className="profile-info-block">
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
              {(profileData._purchases) ? (
                <OrderHistoryMain purchaseHistory={profileData._purchases[0]} />
              ) : ('')}
              <div className="profile-info-container">
                <h3 className="profile-info-container-title">
                  {intl.get('shipping')}
                </h3>
                <div className="profile-info-col">
                  <div className="profile-info-block">
                    {(profileData._addresses) ? (
                      <ProfileAddressesMain addresses={profileData._addresses[0]} onChange={this.fetchProfileData} onAddNewAddress={this.handleNewAddress} onEditAddress={this.handleEditAddress} />
                    ) : ('')}
                    {this.renderNewAddressModal()}
                  </div>
                </div>
              </div>
              <div className="profile-info-container">
                <h3 className="profile-info-container-title">
                  {intl.get('payment')}
                </h3>
                <div className="profile-info-col">
                  <div className="profile-info-block">
                    {(profileData._paymentmethods) ? (
                      <ProfilePaymentMethodsMain paymentMethods={profileData._paymentmethods[0]} onChange={this.fetchProfileData} />
                    ) : ('')}
                  </div>
                </div>
              </div>
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
