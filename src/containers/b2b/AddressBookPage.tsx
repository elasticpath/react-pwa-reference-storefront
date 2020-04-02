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
import { AddressContainer, AlertContainer } from '../../components/src';

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
  invalidPermission: boolean,
  openAddressModal: boolean,
  addressUrl: any,
  isShippingEdit: boolean,
  isBillingEdit: boolean,
  isAddressBook: boolean,
  isShippingLoader: boolean,
  isBillingLoader: boolean,
  selectedAddressUri: string,
  previousShippingAddress : string,
  previousBillingAddress : string,
  isShowAlert: boolean,
  alertMessageData: { message: string, isSuccess: boolean},
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
      isShippingLoader: false,
      isBillingLoader: false,
      selectedAddressUri: '',
      previousShippingAddress: '',
      previousBillingAddress: '',
      isShowAlert: false,
      alertMessageData: { message: '', isSuccess: false },
    };
    this.fetchProfileData = this.fetchProfileData.bind(this);
    this.handleNewAddress = this.handleNewAddress.bind(this);
    this.handleEditAddress = this.handleEditAddress.bind(this);
    this.handleShippingEdit = this.handleShippingEdit.bind(this);
    this.handleBillingEdit = this.handleBillingEdit.bind(this);
    this.handleSelectAddress = this.handleSelectAddress.bind(this);
    this.handleCloseAddressModal = this.handleCloseAddressModal.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);
    this.handleHideAlert = this.handleHideAlert.bind(this);
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
          isShippingLoader: false,
          isBillingLoader: false,
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

  handleSelectAddress(addressUri) {
    const { profileData, isBillingEdit, isShippingEdit } = this.state;
    let selectactionUri;
    if (isBillingEdit) {
      this.setState({
        isBillingLoader: true,
      });
      const selectedBillingAddress = profileData._billingaddresses[0]._selector[0]._choice.find(el => addressUri === el._description[0].self.uri);
      selectactionUri = selectedBillingAddress._selectaction[0].self.uri;
    } else if (isShippingEdit) {
      this.setState({
        isShippingLoader: true,
      });
      const selectedShippingAddress = profileData._shippingaddresses[0]._selector[0]._choice.find(el => addressUri === el._description[0].self.uri);
      selectactionUri = selectedShippingAddress._selectaction && selectedShippingAddress._selectaction[0].self.uri;
    }
    if (selectactionUri) {
      cortexFetch(selectactionUri,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({}),
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            this.fetchProfileData();
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
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

  handleChange(uri) {
    this.setState({
      selectedAddressUri: uri,
    });
    this.handleSelectAddress(uri);
  }

  handleNewAddress() {
    this.setState({
      openAddressModal: true,
      addressUrl: undefined,
    });
  }

  cancelShippingEdit(chosenAddress) {
    const { previousShippingAddress } = this.state;
    if (chosenAddress && previousShippingAddress) {
      if (previousShippingAddress === chosenAddress) {
        this.setState({
          isShippingEdit: false,
        });
      } else {
        this.setState({
          previousShippingAddress: chosenAddress,
          isShippingEdit: false,
        });
        this.handleSelectAddress(previousShippingAddress);
      }
    } else {
      this.setState({
        isShippingEdit: false,
      });
    }
  }

  cancelBillingEdit(chosenAddress) {
    const { previousBillingAddress } = this.state;
    if (chosenAddress && previousBillingAddress) {
      if (previousBillingAddress === chosenAddress) {
        this.setState({
          isBillingEdit: false,
        });
      } else {
        this.setState({
          previousBillingAddress: chosenAddress,
          isBillingEdit: false,
        });
        this.handleSelectAddress(previousBillingAddress);
      }
    } else {
      this.setState({
        isBillingEdit: false,
      });
    }
  }

  handleShippingEdit(addressLink) {
    const { isShippingEdit, isBillingEdit, profileData } = this.state;
    const selectors = profileData && profileData._shippingaddresses && profileData._shippingaddresses[0]._selector;
    if ((selectors[0]._choice || selectors[0]._chosen) && !isBillingEdit) {
      this.setState({
        isShippingEdit: !isShippingEdit,
        selectedAddressUri: addressLink,
        previousShippingAddress: addressLink,
      });
    }
  }

  handleBillingEdit(addressLink) {
    const { isBillingEdit, isShippingEdit, profileData } = this.state;
    const selectors = profileData && profileData._billingaddresses && profileData._billingaddresses[0]._selector;
    if ((selectors[0]._choice || selectors[0]._chosen) && !isShippingEdit) {
      this.setState({
        isBillingEdit: !isBillingEdit,
        selectedAddressUri: addressLink,
        previousBillingAddress: addressLink,
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

  handleHideAlert() {
    this.setState({ isShowAlert: false });
  }

  handleShowAlert(message, isSuccess) {
    this.setState({ isShowAlert: true, alertMessageData: { message, isSuccess } });
    setTimeout(this.handleHideAlert, 3200);
  }

  renderBillingAddress() {
    const { profileData } = this.state;
    if (profileData && profileData._billingaddresses && profileData._billingaddresses[0]._selector[0]._chosen) {
      const selectedAddress = profileData._billingaddresses[0]._selector[0]._chosen[0]._description[0].address;
      const selectedAddressName = profileData._billingaddresses[0]._selector[0]._chosen[0]._description[0].name;
      return (
        <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
          <div data-region="checkoutAddressRegion">
            <AddressContainer name={selectedAddressName} address={selectedAddress} />
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
    const { profileData, isBillingEdit, isBillingLoader } = this.state;
    const chosenAddress = profileData && profileData._billingaddresses[0]._selector[0]._chosen && profileData._billingaddresses[0]._selector[0]._chosen[0]._description[0].self.uri;
    return (
      <div className="address-book-content">
        <h2>
          {intl.get('bill-to')}
        </h2>
        {chosenAddress ? (
          <p>
            {intl.get('your-account-billing-default')}
          </p>
        ) : ''}
        {!isBillingLoader ? (
          <div className="selected-address-container">
            <div data-region="billingAddressSelectorsRegion" className="checkout-region-inner-container">
              {this.renderBillingAddress()}
            </div>
            <div className="address-btn-cell">
              {isBillingEdit ? (
                <button className="ep-btn edit-address-btn" type="button" onClick={() => this.cancelBillingEdit(chosenAddress)}>
                  {intl.get('cancel')}
                </button>
              ) : (
                <button className="ep-btn edit-address-btn" type="button" onClick={() => this.handleBillingEdit(chosenAddress)}>
                  {intl.get('edit')}
                </button>
              )}
              {isBillingEdit ? (
                <button className="ep-btn delete-address-btn" type="button" onClick={() => this.handleBillingEdit(chosenAddress)}>
                  {intl.get('update')}
                </button>
              ) : ''}
            </div>
          </div>
        ) : <div className="miniLoader" />}
      </div>
    );
  }


  renderShippingAddress() {
    const { profileData } = this.state;
    if (profileData && profileData._shippingaddresses && profileData._shippingaddresses[0]._selector[0]._chosen) {
      const selectedAddress = profileData._shippingaddresses[0]._selector[0]._chosen[0]._description[0].address;
      const selectedAddressName = profileData._shippingaddresses[0]._selector[0]._chosen[0]._description[0].name;
      return (
        <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
          <div data-region="checkoutAddressRegion">
            <AddressContainer name={selectedAddressName} address={selectedAddress} />
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

  addressesContainer() {
    const {
      profileData, isShippingEdit, isBillingEdit,
    } = this.state;
    return (
      <div className="address-data">
        <div className="address-info-container">
          <h3 className="address-info-container-title">
            {intl.get('account-defaults')}
          </h3>
          {(profileData._addressform) ? (
            <div className="address-info-inner-container">
              <div className={`ship-info-col ${isShippingEdit ? 'selected' : ''}`}>
                <div className="address-info-block">
                  <div className="checkout-shipping-container">
                    {this.renderShippingAddressSelector()}
                  </div>
                </div>
              </div>
              <div className={`bill-info-col ${isBillingEdit ? 'selected' : ''}`}>
                <div className="address-info-block">
                  <div data-region="billingAddressesRegion">
                    {this.renderBillingAddressSelector()}
                  </div>
                </div>
              </div>
            </div>
          ) : ('')}
        </div>
      </div>
    );
  }

  renderShippingAddressSelector() {
    const { profileData, isShippingEdit, isShippingLoader } = this.state;
    const chosenAddress = profileData && profileData._shippingaddresses[0]._selector[0]._chosen && profileData._shippingaddresses[0]._selector[0]._chosen[0]._description[0].self.uri;

    return (
      <div className="address-book-content">
        <h2>
          {intl.get('ship-to')}
        </h2>
        {chosenAddress ? (
          <p>
            {intl.get('your-account-shipping-default')}
          </p>
        ) : ''}
        {!isShippingLoader ? (
          <div className="selected-address-container">
            <div data-region="shippingAddressSelectorsRegion" className="checkout-region-inner-container">
              {this.renderShippingAddress()}
            </div>
            <div className="address-btn-cell">
              {isShippingEdit ? (
                <button className="ep-btn edit-address-btn" type="button" onClick={() => this.cancelShippingEdit(chosenAddress)}>
                  {intl.get('cancel')}
                </button>
              ) : (
                <button className="ep-btn edit-address-btn" type="button" onClick={() => this.handleShippingEdit(chosenAddress)}>
                  {intl.get('edit')}
                </button>
              )}
              {isShippingEdit ? (
                <button className="ep-btn delete-address-btn" type="button" onClick={() => this.handleShippingEdit(chosenAddress)}>
                  {intl.get('update')}
                </button>
              ) : ''}
            </div>
          </div>
        ) : <div className="miniLoader" />}
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
              <AddressFormMain
                onShowAlert={(message, isSuccess) => { this.handleShowAlert(message, isSuccess); }}
                onCloseModal={this.handleCloseAddressModal}
                fetchData={this.fetchProfileData}
                addressData={addressUrl}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  render() {
    const {
      profileData, isShippingEdit, isAddressBook, isBillingEdit, selectedAddressUri, alertMessageData, isShowAlert,
    } = this.state;
    const isShowCheckBox = isShippingEdit || isBillingEdit;

    return (
      <div className="address-book-page">
        <div className="address-book-container">
          {isShowAlert ? (
            <AlertContainer messageData={alertMessageData} />
          ) : ''}
          <div className="b2b-header">
            <div className="page-title">
              {intl.get('address-book')}
            </div>
          </div>
          {profileData ? (
            <div>
              {this.addressesContainer()}
              <h3 className="address-info-container-title">
                {intl.get('addresses')}
              </h3>
              <div className="address-info-block">
                {(profileData) ? (
                  <ProfileAddressesMain handleChange={el => this.handleChange(el)} isAddressBook={isAddressBook} selectedAddressUri={selectedAddressUri} showCheckBox={isShowCheckBox} addresses={profileData} onChange={this.fetchProfileData} onAddNewAddress={this.handleNewAddress} onEditAddress={this.handleEditAddress} />
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
