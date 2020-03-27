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
import Modal from 'react-responsive-modal';
import {
  ProfileInfoMain, ProfileemailinfoMain, ProfileAddressesMain, PaymentSelectorMain, OrderHistoryMain, AddressFormMain, ProfileComplianceMain,
} from '../components/src/index';
import { login } from '../utils/AuthService';
import { adminFetch, cortexFetch } from '../utils/Cortex';
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
    openAddressModal: boolean,
    addressUrl: any,
}

class ProfilePage extends React.Component<RouteComponentProps, ProfilePageState> {
  constructor(props) {
    super(props);
    this.state = {
      profileData: undefined,
      dataPolicyData: undefined,
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
            <div className="page-title">
              {intl.get(isB2B ? 'my-account' : 'my-profile')}
            </div>
          </div>
          {profileData ? (
            <div className="profile-data">
              <div className="profile-info-container">
                <h3 className="profile-info-container-title">
                  {intl.get('general')}
                </h3>
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
                <h3 className="profile-info-container-title">
                  {intl.get('shipping')}
                </h3>
                <div className="profile-info-block">
                  {(profileData._addresses) ? (
                    <ProfileAddressesMain addresses={profileData._addresses[0]} onChange={this.fetchProfileData} onAddNewAddress={this.handleNewAddress} onEditAddress={this.handleEditAddress} />
                  ) : ('')}
                  {this.renderNewAddressModal()}
                </div>
              </div>
              <div className="profile-info-container">
                <h3 className="profile-info-container-title">
                  {intl.get('payment')}
                </h3>
                {this.renderPayments()}
              </div>
              {(Config.Compliance.enable) ? (
                <div className="profile-info-container">
                  <h3 className="profile-info-container-title">
                    {intl.get('compliance')}
                  </h3>
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
