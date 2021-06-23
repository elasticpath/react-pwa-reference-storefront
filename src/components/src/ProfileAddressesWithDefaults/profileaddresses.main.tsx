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
  /** to set the default address */
  onSetDefaultAddress?: () => void,
  /** handle edit address */
  onEditAddress: (address: string) => void,
  /** chosen Billing Address URI */
  chosenBillingUri?: string,
  /** chosen Shipping Address URI */
  chosenShippingUri?: string,
}
interface ProfileAddressesMainState {
  isDeleteAddressOpen: boolean,
  isDeleteDefaultAddressOpen: boolean,
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
      isDeleteDefaultAddressOpen: false,
      selectedUri: false,
      isLoading: false,
    };
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDeleteModalOpen(selectedUri, isDefault = false) {
    this.setState({ isDeleteAddressOpen: true, selectedUri });
    if (isDefault) {
      this.setState({ isDeleteDefaultAddressOpen: true });
    } else {
      this.setState({ isDeleteDefaultAddressOpen: false });
    }
  }

  handleDeleteModalClose() {
    this.setState({ isDeleteAddressOpen: false });
  }

  handleDelete() {
    const { selectedUri, isDeleteDefaultAddressOpen } = this.state;
    this.setState({ isLoading: true });
    login().then(() => {
      cortexFetch(selectedUri, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        const { onChange, onSetDefaultAddress } = this.props;
        onChange();
        this.setState({ isLoading: false, isDeleteAddressOpen: false });
        if (isDeleteDefaultAddressOpen) {
          this.setState({ isDeleteDefaultAddressOpen: false });
          onSetDefaultAddress();
        }
      }).catch((error) => {
      // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  renderAddresses() {
    const { addresses, chosenBillingUri, chosenShippingUri } = this.props;
    if (addresses._element) {
      const defaultAddresses = addresses._element.filter(address => (
        address.self.uri === chosenShippingUri || address.self.uri === chosenBillingUri
      ));
      const allAddresses = addresses._element.filter(address => (
        address.self.uri !== chosenShippingUri && address.self.uri !== chosenBillingUri
      ));
      return (
        <div>
          <div className="addresses-wrapper default">
            {defaultAddresses.map(address => (
              this.renderAddress(address)
            ))}
          </div>
          {allAddresses.length > 0 && (
            <div className="addresses-wrapper">
              {allAddresses.map(address => (
                this.renderAddress(address)
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <p className="no-address-message">
          {intl.get('no-saved-address-message')}
        </p>
      </div>
    );
  }

  renderAddress(addressElement) {
    const { onEditAddress, chosenBillingUri, chosenShippingUri } = this.props;
    const { name, address, self } = addressElement;
    let defaultAddress = '';

    if (self.uri === chosenBillingUri && self.uri === chosenShippingUri) {
      defaultAddress = intl.get('default-bill-ship-to');
    } else if (self.uri === chosenBillingUri) {
      defaultAddress = intl.get('default-bill-to');
    } else if (self.uri === chosenShippingUri) {
      defaultAddress = intl.get('default-ship-to');
    }
    return (
      <div key={`profile_address_${Math.random().toString(36).substr(2, 9)}`} className={`address-wrapper ${defaultAddress && 'default'}`} data-el-container="profile.addresses">
        <div data-region="profileAddressContainer">
          <div className="address-content" data-region="profileAddressComponentRegion">
            <ul className="address-content-list">
              {defaultAddress.length ? (
                <li className="address-default">
                  {defaultAddress}
                </li>
              ) : ''}
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
          </div>
          <button className="ep-btn small edit-address-btn" type="button" onClick={() => onEditAddress(addressElement.self.uri)}>
            {intl.get('edit')}
          </button>
          <button className="ep-btn small delete-address-btn" type="button" onClick={() => { this.handleDeleteModalOpen(addressElement.self.uri, !!defaultAddress); }} data-actionlink="">
            {intl.get('delete')}
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { addresses } = this.props;
    const { isDeleteAddressOpen, isLoading } = this.state;
    if (addresses) {
      return (
        <div data-region="profileAddressesRegion">
          <div className="profile-address">
            {this.renderAddresses()}
            <Modal
              open={isDeleteAddressOpen}
              onClose={this.handleDeleteModalClose}
              classNames={{ modal: 'delete-address-dialog' }}
            >
              <div className="dialog-header">{intl.get('delete-address')}</div>
              <div className="dialog-content">
                <p>
                  {intl.get('confirm-delete-default-address')}
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
