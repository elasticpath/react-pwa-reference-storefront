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
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './profileaddresses.main.less';

let Config: IEpConfig | any = {};

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
  /** show checkbox */
  showCheckBox?: boolean,
  /** is Address Book Page */
  isAddressBook?: boolean,
  /** Uri of selected address */
  selectedAddressUri?: string,
}

interface ProfileAddressesMainState {
  checkedAddressUri: string
}

class ProfileAddressesMain extends Component<ProfileAddressesMainProps, ProfileAddressesMainState> {
  static defaultProps = {
    showCheckBox: false,
    isAddressBook: false,
    selectedAddressUri: '',
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
    this.state = {
      checkedAddressUri: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(uri) {
    const { showCheckBox } = this.props;
    console.log('uri', uri);
    this.setState({
      checkedAddressUri: uri,
    });
  }

  handleDelete(link) {
    login().then(() => {
      cortexFetch(link, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        const { onChange } = this.props;
        onChange();
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  renderAddresses() {
    const {
      addresses, onEditAddress, showCheckBox, selectedAddressUri, isAddressBook,
    } = this.props;
    const { checkedAddressUri } = this.state;
    if (addresses._element) {
      return (
        addresses._element.map((addressElement) => {
          const {
            name, address,
          } = addressElement;
          return (
            <ul key={`profile_address_${Math.random().toString(36).substr(2, 9)}`} className="profile-addresses-listing" data-el-container="profile.addresses">
              <li className={`profile-address-container ${isAddressBook ? 'left-padding' : ''}`} data-region="profileAddressContainer">
                <label htmlFor={`shippingAddress-${name['given-name']}`}>
                  {showCheckBox ? (
                    <input
                      className="radio-button"
                      key={name['given-name']}
                      type="radio"
                      name={name['given-name']}
                      id={`shippingAddress-${name['given-name']}`}
                      value={(addressElement._selectaction) ? addressElement._selectaction[0].self.uri : ''}
                      checked={!checkedAddressUri.length ? addressElement.self.uri === selectedAddressUri : addressElement.self.uri === checkedAddressUri}
                      onChange={() => this.handleChange(addressElement.self.uri)}
                    />
                  ) : ''}
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
                        <span className="address-postal-code" data-el-value="address.postalCode">
                          {address['postal-code']}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <button className="ep-btn small edit-address-btn" type="button" onClick={() => { onEditAddress(addressElement.self.uri); }}>
                    {intl.get('edit')}
                  </button>
                  <button className="ep-btn small delete-address-btn" type="button" onClick={() => { this.handleDelete(addressElement.self.uri); }} data-actionlink="">
                    {intl.get('delete')}
                  </button>
                </label>
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
    const isDisabled = !addresses._addressform;
    if (addresses) {
      return (
        <div className="profile-addresses-container" data-region="profileAddressesRegion">
          <div>
            <h2>
              {intl.get('addresses')}
            </h2>
            <div className="profile-addresses-wrapper">
              {this.renderAddresses()}
            </div>
            <button className="ep-btn primary wide profile-new-address-btn" type="button" disabled={isDisabled} onClick={onAddNewAddress} data-region="billingAddressButtonRegion">
              {intl.get('add-new-address')}
            </button>
          </div>
        </div>
      );
    }
    return (<div className="loader" />);
  }
}

export default ProfileAddressesMain;
