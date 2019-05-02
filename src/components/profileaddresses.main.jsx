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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import './profileaddresses.main.less';

const Config = require('Config');

class ProfileAddressesMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    addresses: PropTypes.objectOf(PropTypes.any).isRequired,
    onChange: PropTypes.func.isRequired,
  }

  newAddress() {
    const { history } = this.props;
    history.push('/newaddressform', { returnPage: '/profile' });
  }

  editAddress(addressLink) {
    const { history } = this.props;
    history.push('/editaddress', { returnPage: '/profile', address: addressLink });
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
    const { addresses } = this.props;
    if (addresses._element) {
      return (
        addresses._element.map((addressElement) => {
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
                      {(address.region)
                        ? (
                          <span className="address-region" data-el-value="address.region">
                            {`${address.region}, `}
                          </span>
                        ) : ('')
                      }
                      <span className="address-country" data-el-value="address.country">
                        {`${address['country-name']}, `}
                      </span>
                      <span className="address-postal-code" data-el-value="address.postalCode">
                        {address['postal-code']}
                      </span>
                    </li>
                  </ul>
                </div>
                <button className="ep-btn small edit-address-btn" type="button" onClick={() => { this.editAddress(addressElement.self.uri); }}>
                  {intl.get('edit')}
                </button>
                <button className="ep-btn small delete-address-btn" type="button" onClick={() => { this.handleDelete(addressElement.self.uri); }} data-actionlink="">
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
      addresses,
    } = this.props;
    const isDisabled = !addresses._addressform;
    if (addresses) {
      return (
        <div className="profile-addresses-container" data-region="profileAddressesRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('addresses')}
            </h2>
            {this.renderAddresses()}
            <button className="ep-btn primary wide profile-new-address-btn" type="button" disabled={isDisabled} onClick={() => { this.newAddress(); }}>
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
