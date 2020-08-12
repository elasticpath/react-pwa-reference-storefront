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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Modal from 'react-responsive-modal';
import { login } from '../../../hooks/store';
import { cortexFetch } from '../utils/Cortex';
import Config from '../../../ep.config.json';

import './profileaddresses.main.scss';


interface ProfileAddressesMainProps {
  /** addresses */
  addresses: {
    [key: string]: any
  },
  /** handle addresses change */
  onChange: () => void,
  /** handle add new address */
  onAddNewAddress: () => void,
  /** handle edit address */
  onEditAddress: (address: string) => void,
  /** chosen Billing Address URI */
  chosenBillingUri?: string,
  /** chosen Shipping Address URI */
  chosenShippingUri?: string,
}
interface ProfileAddressesMainState {
  isDeleteAddressOpen: boolean,
  selectedUri: boolean,
  isLoading: boolean,
}

class ProfileAddressesMain extends Component<ProfileAddressesMainProps, ProfileAddressesMainState> {
  static defaultProps = {
    chosenBillingUri: '',
    chosenShippingUri: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      isDeleteAddressOpen: false,
      selectedUri: false,
      isLoading: false,
    };
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDeleteModalOpen(selectedUri) {
    this.setState({ isDeleteAddressOpen: true, selectedUri });
  }

  handleDeleteModalClose() {
    this.setState({ isDeleteAddressOpen: false });
  }

  handleDelete() {
    const { selectedUri } = this.state;
    this.setState({ isLoading: true });
    login().then(() => {
      cortexFetch(selectedUri, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        const { onChange } = this.props;
        onChange();
        this.setState({ isLoading: false, isDeleteAddressOpen: false });
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  renderAddresses() {
    const {
      addresses, onEditAddress, chosenBillingUri, chosenShippingUri,
    } = this.props;
    if (addresses._element) {
      return (
        addresses._element.map((addressElement) => {
          const {
            name, address, self,
          } = addressElement;
          let selectedAddress = '';

          if (self.uri === chosenShippingUri && self.uri === chosenBillingUri) {
            selectedAddress = 'Default shipping/billing';
          } else if (self.uri === chosenBillingUri) {
            selectedAddress = 'Default billing';
          } else if (self.uri === chosenShippingUri) {
            selectedAddress = 'Default shipping';
          }
          return (
            <ul key={`profile_address_${Math.random().toString(36).substr(2, 9)}`} className="profile-addresses-listing" data-el-container="profile.addresses">
              <li className="profile-address-container" data-region="profileAddressContainer">
                <div data-region="profileAddressComponentRegion">
                  <ul className="address-container">
                    <li className="address-name" data-el-value="address.name">
                      {`${name['given-name']} ${name['family-name']}`}
                    </li>
                    <li className="address-street-address" data-el-value="address.streetAddress">
                      {address['street-address']}
                    </li>
                    <li className="address-extended-address" data-el-value="address.extendedAddress" />
                    <li>
                      <span className="address-city" data-el-value="address.city">
                        {`${address.locality}, `}
                      </span>
                      <span className="address-region" data-el-value="address.region">
                        {(address.region)
                          ? (
                            `${address.region}, `
                          ) : ('')
                        }
                      </span>
                      <span className="address-country" data-el-value="address.country">
                        {`${address['country-name']}, `}
                      </span>
                      <div className="address-postal-code" data-el-value="address.postalCode">
                        {address['postal-code']}
                      </div>
                    </li>
                  </ul>
                  {selectedAddress.length ? (
                    <div className="default-shipping-address">
                      <div className="check-icon" />
                      <span className="check-title">
                        {selectedAddress}
                      </span>
                    </div>
                  ) : ''}
                </div>
                <button className="ep-btn small edit-address-btn" type="button" onClick={() => { onEditAddress(addressElement.self.uri); }}>
                  {intl.get('edit')}
                </button>
                <button className="ep-btn small delete-address-btn" type="button" onClick={() => { this.handleDeleteModalOpen(addressElement.self.uri); }} data-actionlink="">
                  {intl.get('delete')}
                </button>
              </li>
            </ul>
          );
        })
      );
    }
    return (
      <div>
        <p>
          {intl.get('no-saved-address-message')}
          .
        </p>
      </div>
    );
  }

  render() {
    const {
      addresses, onAddNewAddress,
    } = this.props;
    const { isDeleteAddressOpen, isLoading } = this.state;
    if (addresses) {
      const isDisabled = !addresses._addressform;
      return (
        <div className="profile-addresses-container" data-region="profileAddressesRegion">
          <div>
            {addresses._element && (
              <p className="manage-address-title">
                {intl.get('manage-your-personal-addresses')}
              </p>
            )}
            <div className="profile-addresses-wrapper">
              {this.renderAddresses()}
            </div>
            <button className="ep-btn primary wide profile-new-address-btn" type="button" disabled={isDisabled} onClick={onAddNewAddress} data-region="billingAddressButtonRegion">
              {intl.get('add-new-address')}
            </button>
            <Modal
              open={isDeleteAddressOpen}
              onClose={this.handleDeleteModalClose}
              classNames={{ modal: 'delete-address-dialog' }}
            >
              <div className="dialog-header">{intl.get('delete-address')}</div>
              <div className="dialog-content">
                <p>
                  {intl.get('confirm-delete-address')}
                </p>
              </div>
              <div className="dialog-footer btn-container">
                <button className="ep-btn cancel" type="button" onClick={this.handleDeleteModalClose}>{intl.get('cancel')}</button>
                <button className="ep-btn primary upload" type="button" onClick={this.handleDelete}>
                  {intl.get('delete')}
                </button>
              </div>
              {isLoading ? (
                <div className="loader-wrapper">
                  <div className="miniLoader" />
                </div>
              ) : ''}
            </Modal>
          </div>
        </div>
      );
    }
    return (<div className="loader" />);
  }
}

export default ProfileAddressesMain;
