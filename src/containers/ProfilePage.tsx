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
import { ReactComponent as CloseIcon } from '../images/icons/ic_close.svg';

import ProfileInfoMain from '../components/src/ProfileInfo/profileInfo.main';
import ProfileemailinfoMain from '../components/src/ProfileEmailInfo/profileemailinfo.main';
import ProfileAddressesMain from '../components/src/ProfileAddresses/profileaddresses.main';
import PaymentSelectorMain from '../components/src/PaymentSelectorMain/paymentselector.main';
import AddressFormMain from '../components/src/AddressForm/addressform.main';
import ProfileComplianceMain from '../components/src/ProfileCompliance/profilecompliance.main';

import { login } from '../components/src/utils/AuthService';
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
      <Modal open={openAddressModal} onClose={this.handleCloseAddressModal} showCloseIcon={false}>
        <div className="modal-lg new-address-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {newOrEdit}
                {' '}
                {intl.get('address')}
              </h2>
              <button type="button" aria-label="close" className="close-modal-btn" onClick={this.handleCloseAddressModal}>
                <CloseIcon />
              </button>
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
                <h2 className="profile-info-container-title">
                  {intl.get('shipping')}
                </h2>
                <div className="profile-info-block">
                  {(profileData._addresses) ? (
                    <ProfileAddressesMain addresses={profileData._addresses[0]} onChange={this.fetchProfileData} onAddNewAddress={this.handleNewAddress} onEditAddress={this.handleEditAddress} />
                  ) : ('')}
                  {this.renderNewAddressModal()}
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
