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
import { login } from '../../../hooks/store';
import { cortexFetch } from '../utils/Cortex';
import Config from '../../../ep.config.json';

import './addressform.main.scss';


interface AddressFormMainProps {
  /** An array of addresses for the shopper, where `string` is a URL to the address data. */
  addressData?: {
    [key: string]: any
  },
  /** Account business name. */
  accountName?: string
  /** Closes the address form. */
  onCloseModal?: (...args: any[]) => any,
  /** Show alert after submit */
  handleShowAlert?: (...args: any[]) => any,
  /** Retrieves the saved address. */
  fetchData?: (...args: any[]) => any,
  /** Chosen shipping address. */
  chosenShipping?: boolean,
  /** Chosen billing address. */
  chosenBilling?: boolean,
  /** Selectaction shipping URI. */
  selectactionShippingUri?: string,
  /** Selectaction billing URI. */
  selectactionBillingUri?: string,
  /** Opened address URI. */
  addressUri?: string,
}

interface AddressFormMainState {
    geoData: any,
    firstName: string,
    lastName: string,
    address: string,
    extendedAddress: string,
    city: string,
    country: string,
    subCountry: string,
    postalCode: string,
    isShippingAddress: boolean,
    isBillingAddress: boolean,
    failedSubmit: boolean,
    addressForm: any,
}

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'element',
  'element:regions',
  'element:regions:element',
  'countries:element',
  'countries:element:regions',
  'countries:element:regions:element',
];

class AddressFormMain extends Component<AddressFormMainProps, AddressFormMainState> {
  static defaultProps = {
    onCloseModal: () => {},
    handleShowAlert: () => {},
    fetchData: () => {},
    addressData: undefined,
    chosenBilling: '',
    chosenShipping: '',
    selectactionBillingUri: '',
    selectactionShippingUri: '',
  };

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
      isShippingAddress: false,
      isBillingAddress: false,
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
    this.setAsShippingAddress = this.setAsShippingAddress.bind(this);
    this.setAsBillingAddress = this.setAsBillingAddress.bind(this);
    this.submitAddress = this.submitAddress.bind(this);
    this.cancel = this.cancel.bind(this);
    this.fetchAddressForm = this.fetchAddressForm.bind(this);
    this.fetchGeoData = this.fetchGeoData.bind(this);
  }

  componentDidMount() {
    this.fetchGeoData();
    const { addressData, addressUri } = this.props;
    if (addressUri) {
      this.fetchAddressData(addressUri);
    } else if (addressData && addressData.addressUri) {
      this.fetchAddressData(addressData.addressUri);
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
    this.setState({ country: event.target.value, subCountry: '' });
  }

  setSubCountry(event) {
    this.setState({ subCountry: event.target.value });
  }

  setPostalCode(event) {
    this.setState({ postalCode: event.target.value });
  }

  setAsBillingAddress() {
    const { isBillingAddress } = this.state;
    this.setState({ isBillingAddress: !isBillingAddress });
  }

  setAsShippingAddress() {
    const { isShippingAddress } = this.state;
    this.setState({ isShippingAddress: !isShippingAddress });
  }

  async submitAddress(event) {
    event.preventDefault();
    const {
      addressData, fetchData, handleShowAlert, onCloseModal, selectactionShippingUri, selectactionBillingUri, accountName, addressUri,
    } = this.props;
    const {
      addressForm, firstName, lastName, address, extendedAddress, city, country, subCountry, postalCode, isShippingAddress, isBillingAddress,
    } = this.state;
    let link;
    let methodType;
    let isAddAddress;
    if (addressUri) {
      link = addressUri;
      methodType = 'put';
      isAddAddress = false;
    } else if (addressData && addressData.addressUri) {
      link = addressData.addressUri;
      methodType = 'put';
      isAddAddress = false;
    } else {
      link = addressForm;
      methodType = 'post';
      isAddAddress = true;
    }
    try {
      await login();
      const res = await cortexFetch(link, {
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
      });
      if (res.status === 400) {
        this.setState({ failedSubmit: true });
      } else if (res.status === 201 || res.status === 200 || res.status === 204) {
        if (isShippingAddress) {
          await cortexFetch(selectactionShippingUri,
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
              body: JSON.stringify({}),
            });
        }
        if (isBillingAddress) {
          await cortexFetch(selectactionBillingUri,
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
              body: JSON.stringify({}),
            });
        }
        this.setState({ failedSubmit: false });
        await handleShowAlert(isAddAddress ? intl.get('address-is-added', { accountName }) : intl.get('address-is-updated'), true);
      }
      await fetchData();
    } catch (error) {
      await handleShowAlert(isAddAddress ? intl.get('add-address-error') : intl.get('update-address-error'));
      // eslint-disable-next-line no-console
      console.error(error.message);
    } finally {
      await onCloseModal();
    }
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
            extendedAddress: res.address['extended-address'] || '',
            city: res.address.locality,
            country: res.address['country-name'],
            subCountry: res.address.region || '',
            postalCode: res.address['postal-code'],
          });
        });
    });
  }

  fetchAddressForm() {
    const { addressData } = this.props;
    if (addressData && addressData._addressform[0]._createaddressaction) {
      this.setState({
        addressForm: addressData._addressform[0]._createaddressaction[0].self.uri,
      });
    } else {
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
  }

  cancel() {
    const { onCloseModal } = this.props;
    onCloseModal();
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
                <select id="Region" name="Region" className="form-control" value={subCountry} onChange={this.setSubCountry} onBlur={this.setSubCountry}>
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
            <select id="Region" name="Region" className="form-control" value={subCountry} onChange={this.setSubCountry} onBlur={this.setSubCountry}>
              <option value="" />
            </select>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      failedSubmit, firstName, lastName, address, extendedAddress, city, country, postalCode,
    } = this.state;
    const {
      chosenShipping, chosenBilling, addressData, addressUri,
    } = this.props;

    return (
      <div className="address-form-component container" data-region="appMain">
        <div className="feedback-label feedback-container" data-region="componentAddressFeedbackRegion">
          {failedSubmit && intl.get('failed-to-save-message')}
        </div>
        <form className="form-horizontal" onSubmit={this.submitAddress}>
          <div className="form-group">
            <label htmlFor="registration_form_firstName" data-el-label="addressForm.firstName" className="control-label">
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
            <label htmlFor="registration_form_lastName" data-el-label="addressForm.lastName" className="control-label">
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
          <div data-region="addressCountryRegion" className="form-group">
            <label htmlFor="Country" data-el-label="addressForm.country" className="control-label">
              <span className="required-label">
              *
              </span>
              {' '}
              {intl.get('country')}
            </label>
            <div className="form-input">
              <select id="Country" name="Country" className="form-control" value={country} onChange={this.setCountry} onBlur={this.setCountry}>
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
          <div>
            <p>
              {intl.get('set-as-default')}
              <br />
            </p>
          </div>
          <div className="checkbox-wrap">
            <label htmlFor="shipping_address" className="checkbox-label">
              <input type="checkbox" id="shipping_address" defaultChecked={chosenShipping} disabled={chosenShipping || !addressUri} onChange={this.setAsShippingAddress} />
              <span className={`${chosenShipping || !addressData ? 'disabled' : ''} apply-balance-txt`}>
                {intl.get('shipping-address')}
              </span>
            </label>
            <label htmlFor="billing_address">
              <input type="checkbox" id="billing_address" defaultChecked={chosenBilling} disabled={chosenBilling || !addressUri} onChange={this.setAsBillingAddress} />
              <span className={`${chosenBilling || !addressData ? 'disabled' : ''} apply-balance-txt`}>
                {intl.get('billing-address')}
              </span>
            </label>
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
