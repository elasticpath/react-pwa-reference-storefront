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
import * as cortex from '@elasticpath/cortex-client';
import { ClientContext } from '../ClientContext';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './addressform.main.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface AddressFormMainProps {
    addressData?: {
        [key: string]: any
    },
    onCloseModal?: (...args: any[]) => any,
    fetchData?: (...args: any[]) => any,
}
interface AddressFormMainState {
    showLoader: boolean,
    geoData: any,
    firstName: string,
    lastName: string,
    address: string,
    extendedAddress: string,
    city: string,
    country: string,
    subCountry: string,
    postalCode: string,
    failedSubmit: boolean,
}

class AddressFormMain extends React.Component<AddressFormMainProps, AddressFormMainState> {
  static contextType = ClientContext;

  static defaultProps = {
    addressData: undefined,
    onCloseModal: () => {},
    fetchData: () => {},
  };

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = getConfig());
    this.state = {
      showLoader: false,
      geoData: undefined,
      firstName: '',
      lastName: '',
      address: '',
      extendedAddress: '',
      city: '',
      country: '',
      subCountry: '',
      postalCode: '',
      failedSubmit: false,
    };
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.setExtendedAddress = this.setExtendedAddress.bind(this);
    this.setCity = this.setCity.bind(this);
    this.setCountry = this.setCountry.bind(this);
    this.setSubCountry = this.setSubCountry.bind(this);
    this.setPostalCode = this.setPostalCode.bind(this);
    this.submitAddress = this.submitAddress.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  client: cortex.IClient;

  async componentDidMount() {
    this.client = this.context;
    await this.fetchGeoData();
    const { addressData } = this.props;
    if (addressData && addressData.address) {
      await this.fetchAddressData(addressData.address);
    }
  }

  setFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  setLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  setAddress(event) {
    this.setState({ address: event.target.value });
  }

  setExtendedAddress(event) {
    this.setState({ extendedAddress: event.target.value });
  }

  setCity(event) {
    this.setState({ city: event.target.value });
  }

  setCountry(event) {
    this.setState({ country: event.target.value });
  }

  setSubCountry(event) {
    this.setState({ subCountry: event.target.value });
  }

  setPostalCode(event) {
    this.setState({ postalCode: event.target.value });
  }

  async submitAddress(event) {
    event.preventDefault();
    this.setState({ showLoader: true });
    const { addressData, fetchData, onCloseModal } = this.props;
    const {
      firstName, lastName, address, extendedAddress, city, country, subCountry, postalCode,
    } = this.state;
    const userAddress = {
      name: {
        'given-name': firstName,
        'family-name': lastName,
      },
      address: {
        'street-address': address,
        'extended-address': extendedAddress,
        locality: city,
        'country-name': country,
        region: subCountry,
        'postal-code': postalCode,
      },
    };

    try {
      if (addressData && addressData.address) {
        await this.client.address(addressData.address).update(userAddress);
      } else {
        const rootRes = await this.client.root().fetch({
          defaultprofile: {
            addresses: {
              addressform: {},
            },
          },
        });
        await rootRes.defaultprofile.addresses.addressform(userAddress).fetch({});
      }

      await this.setState({ failedSubmit: false }, async () => {
        await fetchData();
        onCloseModal();
      });
    } catch (error) {
      this.setState({
        failedSubmit: true,
        showLoader: false,
      });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async fetchGeoData() {
    try {
      const res = await this.client.countries(`/geographies/${Config.cortexApi.scope}/countries/`).fetch({
        element: {
          regions: {
            element: {},
          },
        },
      });

      this.setState({
        geoData: res,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async fetchAddressData(addressLink) {
    const res = await this.client.address(addressLink).fetch({});
    this.setState({
      firstName: res.name['given-name'],
      lastName: res.name['family-name'],
      address: res.address['street-address'],
      extendedAddress: res.address['extended-address'] ? res.address['extended-address'] : '',
      city: res.address.locality,
      country: res.address['country-name'],
      subCountry: res.address.region,
      postalCode: res.address['postal-code'],
    });
  }

  cancel() {
    const { onCloseModal } = this.props;
    onCloseModal();
  }

  renderCountries() {
    const { geoData } = this.state;
    if (geoData) {
      const sortedCountries = geoData.elements
        .sort((a, b) => {
          if (a.displayName > b.displayName) {
            return 1;
          }
          return -1;
        });
      return (
        sortedCountries.map(country => (
          <option key={country.name} value={country.name}>
            {country.displayName}
          </option>
        ))
      );
    }
    return null;
  }

  renderSubCountries() {
    const { country, geoData, subCountry } = this.state;
    if (country && geoData) {
      const countryData = geoData.elements.find(element => element.name === country);
      if (countryData.regions.elements) {
        const sortedRegions = countryData.regions.elements
          .sort((a, b) => {
            if (a.displayName > b.displayName) {
              return 1;
            }
            return -1;
          });
        return (
          <div data-region="addressRegionsRegion" className="form-group">
            <div>
              <label htmlFor="Region" data-el-label="addressForm.region" className="control-label">
                <span className="required-label">
                *
                </span>
                {' '}
                {intl.get('province')}
              </label>
              <div className="form-input activity-indicator-loading-region">
                <select id="Region" name="Region" className="form-control" value={subCountry} onChange={this.setSubCountry}>
                  <option value="" />
                  {sortedRegions.map(region => (
                    <option key={region.name} value={region.name}>
                      {region.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      }
      return null;
    }
    return (
      <div data-region="addressRegionsRegion" className="form-group">
        <div>
          <label htmlFor="Region" data-el-label="addressForm.region" className="control-label">
            <span className="required-label">
            *
            </span>
            {' '}
            {intl.get('province')}
          </label>
          <div className="form-input activity-indicator-loading-region">
            <select id="Region" name="Region" className="form-control" value={subCountry} onChange={this.setSubCountry}>
              <option value="" />
            </select>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      failedSubmit, firstName, lastName, address, extendedAddress, city, country, postalCode, showLoader,
    } = this.state;

    return (
      <div className="address-form-component container" data-region="appMain">
        <div className="feedback-label feedback-container" data-region="componentAddressFeedbackRegion">
          {failedSubmit ? ('Failed to Save, please check all required fields are filled.') : ('')}
        </div>
        {showLoader && (
          <div className="loader-wrapper">
            <div className="miniLoader" />
          </div>
        )}
        <form className="form-horizontal" onSubmit={this.submitAddress}>
          <div className="form-group">
            <label htmlFor="FirstName" data-el-label="addressForm.firstName" className="control-label">
              <span className="required-label">
              *
              </span>
              {' '}
              {intl.get('first-name')}
            </label>
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input id="registration_form_firstName" name="FirstName" className="form-control" type="text" value={firstName} onChange={this.setFirstName} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="LastName" data-el-label="addressForm.lastName" className="control-label">
              <span className="required-label">
              *
              </span>
              {' '}
              {intl.get('last-name')}
            </label>
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input id="registration_form_lastName" name="LastName" className="form-control" type="text" value={lastName} onChange={this.setLastName} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="StreetAddress" data-el-label="addressForm.streetAddress" className="control-label">
              <span className="required-label">
              *
              </span>
              {' '}
              {intl.get('street-address')}
            </label>
            <div className="form-input">
              <input id="StreetAddress" name="StreetAddress" className="form-control" type="text" value={address} onChange={this.setAddress} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ExtendedAddress" data-el-label="addressForm.extendedAddress" className="control-label">
              {intl.get('extended-address')}
            </label>
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input id="ExtendedAddress" name="ExtendedAddress" className="form-control" type="text" value={extendedAddress} onChange={this.setExtendedAddress} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="City" data-el-label="addressForm.city" className="control-label">
              <span className="required-label">
              *
              </span>
              {' '}
              {intl.get('city')}
            </label>
            <div className="form-input">
              <input id="City" name="City" className="form-control" type="text" value={city} onChange={this.setCity} />
            </div>
          </div>
          <div data-region="addressCountryRegion" className="form-group" style={{ display: 'block' }}>
            <label htmlFor="Country" data-el-label="addressForm.country" className="control-label">
              <span className="required-label">
              *
              </span>
              {' '}
              {intl.get('country')}
            </label>
            <div className="form-input">
              <select id="Country" name="Country" className="form-control" value={country} onChange={this.setCountry}>
                <option value="" />
                {this.renderCountries()}
              </select>
            </div>
          </div>
          {this.renderSubCountries()}
          <div className="form-group">
            <label htmlFor="PostalCode" data-el-label="addressForm.postalCode" className="control-label">
              <span className="required-label">
              *
              </span>
              {' '}
              {intl.get('postal-code')}
            </label>
            <div className="form-input">
              <input id="PostalCode" name="PostalCode" className="form-control" type="text" value={postalCode} onChange={this.setPostalCode} />
            </div>
          </div>
          <div className="form-group form-btn-group">
            <div className="control-label" />
            <div className="form-input btn-container">
              <button className="ep-btn address-cancel-btn" data-el-label="addressForm.cancel" type="button" onClick={() => { this.cancel(); }}>
                {intl.get('cancel')}
              </button>
              <button className="ep-btn primary address-save-btn" data-el-label="addressForm.save" type="submit">
                {intl.get('save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AddressFormMain;
