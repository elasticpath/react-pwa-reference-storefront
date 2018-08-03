/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';

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
                      <span className="address-region" data-el-value="address.region">
                        {`${address.region}, `}
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
                <button className="btn profile-edit-address-btn" type="button" onClick={() => { this.editAddress(addressElement.self.uri); }}>
                  {intl.get('edit')}
                </button>
                <button className="btn profile-delete-address-btn" type="button" onClick={() => { this.handleDelete(addressElement.self.uri); }} data-actionlink="">
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
    if (addresses) {
      return (
        <div data-region="profileAddressesRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('addresses')}
            </h2>
            {this.renderAddresses()}
            <button className="btn btn-primary profile-new-address-btn" type="button" onClick={() => { this.newAddress(); }}>
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
