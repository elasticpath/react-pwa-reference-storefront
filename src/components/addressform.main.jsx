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
import intl from 'react-intl-universal';
import ReactRouterPropTypes from 'react-router-prop-types';
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';

import './addressform.main.less';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'element',
  'element:regions',
  'element:regions:element',
  'countries:element',
  'countries:element:regions',
  'countries:element:regions:element',
];

class AddressFormMain extends React.Component {
  static propTypes = {
    location: ReactRouterPropTypes.location.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
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
      addressForm: undefined,
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

  componentDidMount() {
    this.fetchGeoData();
    const { location } = this.props;
    if (location.state && location.state.address) {
      this.fetchAddressData(location.state.address);
    } else {
      this.fetchAddressForm();
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

  submitAddress(event) {
    event.preventDefault();
    const { location } = this.props;
    const {
      addressForm, firstName, lastName, address, extendedAddress, city, country, subCountry, postalCode,
    } = this.state;
    let link;
    let methodType;
    if (location.state && location.state.address) {
      link = location.state.address;
      methodType = 'put';
    } else {
      link = addressForm;
      methodType = 'post';
    }
    login().then(() => {
      cortexFetch(link, {
        method: methodType,
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
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
        }),
      }).then((res) => {
        if (res.status === 400) {
          this.setState({ failedSubmit: true });
        } else if (res.status === 201 || res.status === 200 || res.status === 204) {
          this.setState({ failedSubmit: false }, () => {
            this.cancel();
          });
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  fetchGeoData() {
    login().then(() => {
      // 7.4 Will expose the countries API at the root. In versions earlier than 7.4 we have to invoke geographies ourselves.
      cortexFetch(`/geographies/${Config.cortexApi.scope}/countries/?zoom=${zoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            geoData: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  fetchAddressData(addressLink) {
    login().then(() => {
      cortexFetch(addressLink, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
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
        });
    });
  }

  fetchAddressForm() {
    login().then(() => {
      cortexFetch('/?zoom=defaultprofile:addresses:addressform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const addressFormLink = res._defaultprofile[0]._addresses[0]._addressform[0].links.find(link => link.rel === 'createaddressaction').uri;
          this.setState({
            addressForm: addressFormLink,
          });
        });
    });
  }

  cancel() {
    const { location, history } = this.props;
    if (location.state && location.state.returnPage) {
      history.push(location.state.returnPage);
    } else if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      history.push('/profile');
    } else {
      history.push('/');
    }
  }

  renderCountries() {
    const { geoData } = this.state;
    if (geoData) {
      const sortedCountries = [].concat(geoData._element)
        .sort((a, b) => {
          if (a['display-name'] > b['display-name']) {
            return 1;
          }
          return -1;
        });
      return (
        sortedCountries.map(country => (
          <option key={country.name} value={country.name}>
            {country['display-name']}
          </option>
        ))
      );
    }
    return null;
  }

  renderSubCountries() {
    const { country, geoData, subCountry } = this.state;
    if (country && geoData) {
      const countryData = geoData._element.find(element => element.name === country);
      if (countryData._regions[0]._element) {
        const sortedRegions = [].concat(countryData._regions[0]._element)
          .sort((a, b) => {
            if (a['display-name'] > b['display-name']) {
              return 1;
            }
            return -1;
          });
        return (
          <div data-region="addressRegionsRegion" className="form-group" style={{ overflow: 'hidden', display: 'block' }}>
            <div>
              <label htmlFor="Region" data-el-label="addressForm.region" className="control-label address-form-label">
                <span className="required-label">
                  *
                </span>
                {' '}
                {intl.get('province')}
              </label>
              <div className="address-form-input activity-indicator-loading-region">
                <select id="Region" name="Region" className="form-control" value={subCountry} onChange={this.setSubCountry}>
                  <option value="" />
                  {sortedRegions.map(region => (
                    <option key={region.name} value={region.name}>
                      {region['display-name']}
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
      <div data-region="addressRegionsRegion" className="form-group" style={{ overflow: 'hidden', display: 'block' }}>
        <div>
          <label htmlFor="Region" data-el-label="addressForm.region" className="control-label address-form-label">
            <span className="required-label">
              *
            </span>
            {' '}
            {intl.get('province')}
          </label>
          <div className="address-form-input activity-indicator-loading-region">
            <select id="Region" name="Region" className="form-control" value={subCountry} onChange={this.setSubCountry}>
              <option value="" />
            </select>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { location } = this.props;
    const {
      failedSubmit, firstName, lastName, address, extendedAddress, city, country, postalCode,
    } = this.state;
    const newOrEdit = (location.state && location.state.address) ? intl.get('edit') : intl.get('new');
    return (
      <div className="address-form-component" data-region="appMain" style={{ display: 'block' }}>
        <div className="create-address-container container">
          <h3>
            {newOrEdit}
            {' '}
            {intl.get('address')}
          </h3>
          <form className="form-horizontal" onSubmit={this.submitAddress}>
            <div data-region="componentAddressFormRegion" style={{ display: 'block' }}>
              <div className="address-form-container">
                <div className="feedback-label address-form-feedback-container" data-region="componentAddressFeedbackRegion">
                  {failedSubmit ? ('Failed to Save, please check all required fields are filled.') : ('')}
                </div>
                <div className="form-group">
                  <label htmlFor="FirstName" data-el-label="addressForm.firstName" className="control-label address-form-label">
                    <span className="required-label">
                      *
                    </span>
                    {' '}
                    {intl.get('first-name')}
                  </label>
                  <div className="address-form-input">
                    {/* eslint-disable-next-line max-len */}
                    <input id="registration_form_firstName" name="FirstName" className="form-control" type="text" value={firstName} onChange={this.setFirstName} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="LastName" data-el-label="addressForm.lastName" className="control-label address-form-label">
                    <span className="required-label">
                      *
                    </span>
                    {' '}
                    {intl.get('last-name')}
                  </label>
                  <div className="address-form-input">
                    {/* eslint-disable-next-line max-len */}
                    <input id="registration_form_lastName" name="LastName" className="form-control" type="text" value={lastName} onChange={this.setLastName} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="StreetAddress" data-el-label="addressForm.streetAddress" className="control-label address-form-label">
                    <span className="required-label">
                      *
                    </span>
                    {' '}
                    {intl.get('street-address')}
                  </label>
                  <div className="address-form-input">
                    <input id="StreetAddress" name="StreetAddress" className="form-control" type="text" value={address} onChange={this.setAddress} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="ExtendedAddress" data-el-label="addressForm.extendedAddress" className="control-label address-form-label">
                    {intl.get('extended-address')}
                  </label>
                  <div className="address-form-input">
                    {/* eslint-disable-next-line max-len */}
                    <input id="ExtendedAddress" name="ExtendedAddress" className="form-control" type="text" value={extendedAddress} onChange={this.setExtendedAddress} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="City" data-el-label="addressForm.city" className="control-label address-form-label">
                    <span className="required-label">
                      *
                    </span>
                    {' '}
                    City
                  </label>
                  <div className="address-form-input">
                    <input id="City" name="City" className="form-control" type="text" value={city} onChange={this.setCity} />
                  </div>
                </div>
                <div data-region="addressCountryRegion" className="form-group" style={{ display: 'block' }}>
                  <div>
                    <label htmlFor="Country" data-el-label="addressForm.country" className="control-label address-form-label">
                      <span className="required-label">
                        *
                      </span>
                      {' '}
                      {intl.get('country')}
                    </label>
                    <div className="address-form-input">
                      <select id="Country" name="Country" className="form-control" value={country} onChange={this.setCountry}>
                        <option value="" />
                        {this.renderCountries()}
                      </select>
                    </div>
                  </div>
                </div>
                {this.renderSubCountries()}
                <div className="form-group">
                  <label htmlFor="PostalCode" data-el-label="addressForm.postalCode" className="control-label address-form-label">
                    <span className="required-label">
                      *
                    </span>
                    {' '}
                    {intl.get('postal-code')}
                  </label>
                  <div className="address-form-input">
                    <input id="PostalCode" name="PostalCode" className="form-control" type="text" value={postalCode} onChange={this.setPostalCode} />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group create-address-btn-container container">
              <button className="btn btn-primary address-save-btn" data-el-label="addressForm.save" type="submit">
                {intl.get('save')}
              </button>
              <button className="btn address-cancel-btn" data-el-label="addressForm.cancel" type="button" onClick={() => { this.cancel(); }}>
                {intl.get('cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddressFormMain;
