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
import Modal from 'react-responsive-modal';
import { login } from '../../components/src/utils/AuthService';
import { cortexFetch } from '../../components/src/utils/Cortex';
import Config from '../../ep.config.json';

import './AddressBookPage.scss';
import AddressFormMain from '../../components/src/AddressForm/addressform.main';
import ProfileAddressesMain from '../../components/src/ProfileAddresses/profileaddresses.main';

const zoomArray = [
  'defaultprofile',
  'defaultprofile:addresses',
  'defaultprofile:addresses:addressform',
  'defaultprofile:addresses:element',
  'defaultprofile:addresses:billingaddresses',
  'defaultprofile:addresses:billingaddresses:default',
  'defaultprofile:addresses:billingaddresses:selector',
  'defaultprofile:addresses:billingaddresses:selector:choice',
  'defaultprofile:addresses:billingaddresses:selector:choice:description',
  'defaultprofile:addresses:billingaddresses:selector:choice:selectaction',
  'defaultprofile:addresses:billingaddresses:selector:chosen',
  'defaultprofile:addresses:billingaddresses:selector:chosen:description',
  'defaultprofile:addresses:billingaddresses:selector:chosen:selectaction',
  'defaultprofile:addresses:shippingaddresses',
  'defaultprofile:addresses:shippingaddresses:default',
  'defaultprofile:addresses:shippingaddresses:selector',
  'defaultprofile:addresses:shippingaddresses:selector:choice',
  'defaultprofile:addresses:shippingaddresses:selector:choice:description',
  'defaultprofile:addresses:shippingaddresses:selector:choice:selectaction',
  'defaultprofile:addresses:shippingaddresses:selector:chosen',
  'defaultprofile:addresses:shippingaddresses:selector:chosen:description',
  'defaultprofile:addresses:shippingaddresses:selector:chosen:selectaction',
];

interface AddressBookPageProps extends React.Component<RouteComponentProps> {}
interface AddressBookPageState {
  profileData: any,
  openAddressModal: boolean,
  addressData: any,
  chosenShippingUri: string,
  chosenBillingUri: string,
}

class AddressBookPage extends React.Component<AddressBookPageProps, AddressBookPageState> {
  constructor(props) {
    super(props);
    this.state = {
      profileData: undefined,
      openAddressModal: false,
      addressData: undefined,
      chosenShippingUri: '',
      chosenBillingUri: '',
    };
    this.fetchProfileData = this.fetchProfileData.bind(this);
    this.handleNewAddress = this.handleNewAddress.bind(this);
    this.handleEditAddress = this.handleEditAddress.bind(this);
    this.handleCloseAddressModal = this.handleCloseAddressModal.bind(this);
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
        const addressData = profileData._defaultprofile[0]._addresses[0];
        const chosenBillingAddress = addressData._billingaddresses[0]._selector && addressData._billingaddresses[0]._selector[0]._chosen && addressData._billingaddresses[0]._selector[0]._chosen[0]._description[0].self.uri;
        const chosenShippingAddress = addressData._shippingaddresses[0]._selector && addressData._shippingaddresses[0]._selector[0]._chosen && addressData._shippingaddresses[0]._selector[0]._chosen[0]._description[0].self.uri;
        this.setState({
          profileData: addressData,
          chosenBillingUri: chosenBillingAddress,
          chosenShippingUri: chosenShippingAddress,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }

  handleNewAddress() {
    this.setState({
      openAddressModal: true,
      addressData: undefined,
    });
  }

  handleEditAddress(addressLink) {
    const { profileData } = this.state;
    this.setState({
      openAddressModal: true,
      addressData: { addressUri: addressLink, addressData: profileData },
    });
  }

  handleCloseAddressModal() {
    this.setState({ openAddressModal: false });
  }

  renderNewAddressModal() {
    const {
      openAddressModal, addressData, chosenShippingUri, chosenBillingUri, profileData,
    } = this.state;
    const newOrEdit = (addressData && addressData.addressUri) ? intl.get('edit') : intl.get('new');
    const isChosenBilling = chosenBillingUri === (addressData && addressData.addressUri);
    const isChosenShipping = chosenShippingUri === (addressData && addressData.addressUri);
    let selectactionShippingUri = addressData && profileData._shippingaddresses[0]._selector && profileData._shippingaddresses[0]._selector[0]._choice
      && profileData._shippingaddresses[0]._selector[0]._choice.find(el => addressData.addressUri === el._description[0].self.uri);
    let selectactionBillingUri = addressData && profileData._billingaddresses[0]._selector && profileData._billingaddresses[0]._selector[0]._choice
      && profileData._billingaddresses[0]._selector[0]._choice.find(el => addressData.addressUri === el._description[0].self.uri);
    selectactionShippingUri = selectactionShippingUri && selectactionShippingUri._selectaction[0].self.uri;
    selectactionBillingUri = selectactionBillingUri && selectactionBillingUri._selectaction[0].self.uri;

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
              <AddressFormMain
                onCloseModal={this.handleCloseAddressModal}
                fetchData={this.fetchProfileData}
                addressData={addressData}
                chosenBilling={isChosenBilling}
                chosenShipping={isChosenShipping}
                selectactionBillingUri={selectactionBillingUri}
                selectactionShippingUri={selectactionShippingUri}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  render() {
    const {
      profileData,
      chosenBillingUri,
      chosenShippingUri,
    } = this.state;

    return (
      <div className="address-book-page">
        <div className="address-book-container">
          <div className="b2b-header">
            <div className="page-title">
              {intl.get('address-book')}
            </div>
          </div>
          <div>
            <p className="address-info-container-title">
              {intl.get('addresses')}
            </p>
            <div className="address-info-block">
              {(profileData) ? (
                <ProfileAddressesMain
                  addresses={profileData}
                  onChange={this.fetchProfileData}
                  onAddNewAddress={this.handleNewAddress}
                  onEditAddress={this.handleEditAddress}
                  chosenShippingUri={chosenShippingUri}
                  chosenBillingUri={chosenBillingUri}
                />
              ) : (
                <div>
                  {intl.get('no-saved-address-message')}
                </div>
              )}
              {this.renderNewAddressModal()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddressBookPage;
