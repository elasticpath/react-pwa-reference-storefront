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
import { withRouter } from 'react-router';
import * as cortex from '@elasticpath/cortex-client';
import { ClientContext } from '../ClientContext';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './profileaddresses.main.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface ProfileAddressesMainProps {
  addresses: {
    [key: string]: any
  },
  onChange: () => void,
  onAddNewAddress: () => void,
  onEditAddress: (address: string) => void
}

class ProfileAddressesMain extends React.Component<ProfileAddressesMainProps, {}> {
  static contextType = ClientContext;

  client: cortex.IClient;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
  }

  async componentDidMount() {
    this.client = this.context;
  }

  async handleDelete(link) {
    const { onChange } = this.props;

    await this.client.address(link).delete();
    onChange();
  }

  renderAddresses() {
    const { addresses, onEditAddress } = this.props;
    if (addresses.elements) {
      return (
        addresses.elements.map((addressElement) => {
          const {
            name, address,
          } = addressElement;
          return (
            <ul key={`profile_address_${Math.random().toString(36).substr(2, 9)}`} className="profile-addresses-listing" data-el-container="profile.addresses">
              <li className="profile-address-container">
                <div data-region="profileAddressComponentRegion" style={{ display: 'block' }}>
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
                <button className="ep-btn small edit-address-btn" type="button" onClick={() => { onEditAddress(addressElement.uri); }}>
                  {intl.get('edit')}
                </button>
                <button className="ep-btn small delete-address-btn" type="button" onClick={() => { this.handleDelete(addressElement.uri); }} data-actionlink="">
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
    const isDisabled = !addresses.addressform;
    if (addresses) {
      return (
        <div className="profile-addresses-container" data-region="profileAddressesRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('addresses')}
            </h2>
            {this.renderAddresses()}
            <button className="ep-btn primary wide profile-new-address-btn" type="button" disabled={isDisabled} onClick={onAddNewAddress}>
              {intl.get('add-new-address')}
            </button>
          </div>
        </div>
      );
    }
    return (<div className="loader" />);
  }
}

export default withRouter(ProfileAddressesMain);
