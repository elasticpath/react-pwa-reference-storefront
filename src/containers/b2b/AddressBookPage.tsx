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
import { login } from '../../utils/AuthService';
import { cortexFetch } from '../../utils/Cortex';
import Config from '../../ep.config.json';

import './AddressBookPage.less';
import AddressFormMain from '../../components/src/AddressForm/addressform.main';
import ProfileAddressesMain from '../../components/src/ProfileAddresses/profileaddresses.main';
import { AddressContainer } from '../../components/src';

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
  'defaultprofile:addresses:billingaddresses:selector:chosen',
  'defaultprofile:addresses:billingaddresses:selector:chosen:description',
  'defaultprofile:addresses:shippingaddresses',
  'defaultprofile:addresses:shippingaddresses:element',
  'defaultprofile:addresses:shippingaddresses:default',
  'defaultprofile:addresses:shippingaddresses:selector',
  'defaultprofile:addresses:shippingaddresses:selector:choice',
  'defaultprofile:addresses:shippingaddresses:selector:choice:description',
  'defaultprofile:addresses:shippingaddresses:selector:chosen',
  'defaultprofile:addresses:shippingaddresses:selector:chosen:description',
];

interface AddressBookPageProps extends React.Component<RouteComponentProps> {}
interface AddressBookPageState {
  profileData: any,
  invalidPermission: boolean,
  openAddressModal: boolean,
  addressUrl: any,
  isShippingEdit: boolean,
  isBillingEdit: boolean,
  isAddressBook: boolean,
  selectedAddressUri: string,
}

class AddressBookPage extends React.Component<AddressBookPageProps, AddressBookPageState> {
  constructor(props) {
    super(props);
    this.state = {
      profileData: undefined,
      invalidPermission: false,
      openAddressModal: false,
      addressUrl: undefined,
      isShippingEdit: false,
      isBillingEdit: false,
      isAddressBook: true,
      selectedAddressUri: '',
    };
    this.fetchProfileData = this.fetchProfileData.bind(this);
    this.handleNewAddress = this.handleNewAddress.bind(this);
    this.handleEditAddress = this.handleEditAddress.bind(this);
    this.handleShippingEdit = this.handleShippingEdit.bind(this);
    this.handleBillingEdit = this.handleBillingEdit.bind(this);
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
        this.setState({
          profileData: profileData._defaultprofile[0]._addresses[0],
        });
      } else {
        this.setState({
          invalidPermission: true,
        });
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

  handleNewAddress() {
    this.setState({
      openAddressModal: true,
      addressUrl: undefined,
    });
  }

  handleShippingEdit(addressLink) {
    const { isShippingEdit } = this.state;
    if (addressLink) {
      this.setState({
        isShippingEdit: !isShippingEdit,
        selectedAddressUri: addressLink,
      });
    }
  }

  handleBillingEdit(addressLink) {
    const { isBillingEdit } = this.state;
    if (addressLink) {
      this.setState({
        isBillingEdit: !isBillingEdit,
        selectedAddressUri: addressLink,
      });
    }
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

  renderBillingAddress() {
    const { profileData } = this.state;
    if (profileData && profileData._billingaddresses && profileData._billingaddresses[0]._selector[0]._chosen) {
      const selectedAddress = profileData._billingaddresses[0]._selector[0]._chosen[0]._description[0].address;
      const selectedAddressName = profileData._billingaddresses[0]._selector[0]._chosen[0]._description[0].name;
      return (
        <div key={`billingAddress_${Math.random().toString(36).substr(2, 9)}`}>
          <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
            {/* eslint-disable-next-line max-len */}
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

  renderBillingAddressSelector() {
    const { profileData, isBillingEdit } = this.state;
    const selectedAddress = profileData && profileData._billingaddresses[0]._selector[0]._chosen && profileData._billingaddresses[0]._selector[0]._chosen[0]._description[0].self.uri;
    return (
      <div className="address-book-container">
        <h2>
          {intl.get('bill-to')}
        </h2>
        <div data-region="billingAddressSelectorsRegion" className="checkout-region-inner-container">
          {this.renderBillingAddress()}
        </div>
        <div className="address-btn-cell">
          <button className="ep-btn edit-address-btn" type="button" onClick={() => this.handleBillingEdit(selectedAddress)}>
            {intl.get(isBillingEdit ? 'cancel' : 'edit')}
          </button>
          {isBillingEdit ? (
            <button className="ep-btn delete-address-btn" type="button" data-actionlink="">
              {intl.get('update')}
            </button>
          ) : ''}
        </div>
      </div>
    );
  }


  renderShippingAddress() {
    const { profileData } = this.state;
    if (profileData && profileData._shippingaddresses && profileData._shippingaddresses[0]._selector[0]._chosen) {
      const selectedAddress = profileData._shippingaddresses[0]._selector[0]._chosen[0]._description[0].address;
      const selectedAddressName = profileData._shippingaddresses[0]._selector[0]._chosen[0]._description[0].name;
      return (
        <div key={`billingAddress_${Math.random().toString(36).substr(2, 9)}`}>
          <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
            {/* eslint-disable-next-line max-len */}
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

  renderShippingAddressSelector() {
    const { profileData, isShippingEdit } = this.state;
    const selectedAddress = profileData && profileData._billingaddresses[0]._selector[0]._chosen && profileData._billingaddresses[0]._selector[0]._chosen[0]._description[0].self.uri;

    return (
      <div className="address-book-container">
        <h2>
          {intl.get('ship-to')}
        </h2>
        <div data-region="billingAddressSelectorsRegion" className="checkout-region-inner-container">
          {this.renderShippingAddress()}
        </div>
        <div className="address-btn-cell">
          <button className="ep-btn edit-address-btn" type="button" onClick={() => this.handleShippingEdit(selectedAddress)}>
            {intl.get(isShippingEdit ? 'cancel' : 'edit')}
          </button>
          {isShippingEdit ? (
            <button className="ep-btn delete-address-btn" type="button" data-actionlink="">
              {intl.get('update')}
            </button>
          ) : ''}
        </div>
        {/* <button className="ep-btn primary wide checkout-new-address-btn" data-region="billingAddressButtonRegion" disabled={false} type="button" onClick={this.handleNewAddress}> */}
        {/*  {intl.get('add-new-address')} */}
        {/* </button> */}
      </div>
    );
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
    const {
      profileData, isShippingEdit, selectedAddressUri, isAddressBook, isBillingEdit,
    } = this.state;

    return (
      <div>
        <div className="container profile-container">
          <div className="b2b-header" data-region="profileTitleRegion">
            <div className="page-title">
              {intl.get('address-book')}
            </div>
          </div>
          {profileData ? (
            <div>
              <div className="profile-data">
                <div className="profile-info-container">
                  <h3 className="profile-info-container-title">
                    {intl.get('addresses')}
                  </h3>
                  {(profileData._addressform) ? (
                    <div className="address-info-container">
                      <div className="ship-info-col">
                        <div className={`profile-info-block ${isShippingEdit ? 'selected' : ''}`}>
                          <div className="checkout-shipping-container">
                            {this.renderShippingAddressSelector()}
                          </div>
                        </div>
                      </div>
                      <div className="bill-info-col">
                        <div className={`profile-info-block ${isBillingEdit ? 'selected' : ''}`}>
                          <div data-region="billingAddressesRegion">
                            {this.renderBillingAddressSelector()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ('')}
                </div>
              </div>
              <div className="profile-info-block">
                {(profileData) ? (
                  <ProfileAddressesMain isAddressBook={isAddressBook} selectedAddressUri={selectedAddressUri} showCheckBox={isShippingEdit} addresses={profileData} onChange={this.fetchProfileData} onAddNewAddress={this.handleNewAddress} onEditAddress={this.handleEditAddress} />
                ) : ('')}
                {this.renderNewAddressModal()}
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

export default AddressBookPage;
