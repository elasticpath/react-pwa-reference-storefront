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
import { login } from '../utils/AuthService.js'

var Config = require('Config')

//Array of zoom parameters to pass to Cortex
var zoomArray = [
    'element',
    'element:regions',
    'element:regions:element'
];

class AddressFormMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geoData: undefined,
            firstName: "",
            lastName: "",
            address: "",
            extendedAddress: "",
            city: "",
            country: "",
            subCountry: "",
            postalCode: "",
            failedSubmit: false,
            addressForm: undefined
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
    fetchGeoData() {
        login().then(() => {
            fetch(Config.cortexApi.path + '/geographies/' + Config.cortexApi.scope + '/countries?zoom=' + zoomArray.join(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                }
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        geoData: res
                    })
                })
                .catch(error => {
                    console.log(error)
                });
        });
    }
    fetchAddressData(addressLink) {
        login().then(() => {
            fetch(addressLink, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                }
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        firstName: res['name']['given-name'],
                        lastName: res['name']['family-name'],
                        address: res['address']['street-address'],
                        extendedAddress: res['address']['extended-address'] ? res['address']['extended-address'] : "",
                        city: res['address']['locality'],
                        country: res['address']['country-name'],
                        subCountry: res['address']['region'],
                        postalCode: res['address']['postal-code']
                    })
                })
        });
    }
    fetchAddressForm() {
        login().then(() => {
            fetch(Config.cortexApi.path + '/?zoom=defaultprofile:addresses:addressform', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                }
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        addressForm: res['_defaultprofile'][0]['_addresses'][0]['_addressform'][0]['self']['href']
                    })
                })
        })
    }
    componentDidMount() {
        this.fetchGeoData();
        if (this.props.location.state && this.props.location.state.address) {
            this.fetchAddressData(this.props.location.state.address);
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
    renderCountries() {
        if (this.state.geoData) {
            const sortedCountries = [].concat(this.state.geoData['_element'])
                .sort((a, b) => {
                    if (a['display-name'] > b['display-name']) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
            return (
                sortedCountries.map((country) => {
                    return (
                        <option key={country['name']} value={country['name']}>{country['display-name']}</option>
                    );
                })
            );
        }
    }
    renderSubCountries() {
        if (this.state.country && this.state.geoData) {
            const countryData = this.state.geoData['_element'].find((element) => { return element['name'] === this.state.country });
            if (countryData['_regions'][0]['_element']) {
                const sortedRegions = [].concat(countryData['_regions'][0]['_element'])
                    .sort((a, b) => {
                        if (a['display-name'] > b['display-name']) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                return (
                    <div data-region="addressRegionsRegion" className="form-group" style={{ overflow: 'hidden', display: 'block' }}>
                        <div>
                            <label htmlFor="Region" data-el-label="addressForm.region" className="control-label address-form-label">
                                <span className="required-label">*</span> Province</label>
                            <div className="address-form-input activity-indicator-loading-region">
                                <select id="Region" name="Region" className="form-control" value={this.state.subCountry} onChange={this.setSubCountry}>
                                    <option value=""></option>
                                    {sortedRegions.map((region) => {
                                        return (
                                            <option key={region['name']} value={region['name']}>{region['display-name']}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            return (
                <div data-region="addressRegionsRegion" className="form-group" style={{ overflow: 'hidden', display: 'block' }}>
                    <div>
                        <label htmlFor="Region" data-el-label="addressForm.region" className="control-label address-form-label">
                            <span className="required-label">*</span> Province</label>
                        <div className="address-form-input activity-indicator-loading-region">
                            <select id="Region" name="Region" className="form-control" value={this.state.subCountry} onChange={this.setSubCountry}>
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                </div>
            );
        }
    }
    submitAddress(event) {
        var link;
        var method;
        if (this.props.location.state && this.props.location.state.address) {
            link = this.props.location.state.address;
            method = 'put';
        } else {
            link = this.state.addressForm;
            method = 'post';
        }
        event.preventDefault();
        login().then(() => {
            fetch(link, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                },
                body: JSON.stringify({
                    'name': {
                        'given-name': this.state.firstName,
                        'family-name': this.state.lastName
                    },
                    'address': {
                        'street-address': this.state.address,
                        'extended-address': this.state.extendedAddress,
                        'locality': this.state.city,
                        'country-name': this.state.country,
                        'region': this.state.subCountry,
                        'postal-code': this.state.postalCode
                    }
                })
            }).then(res => {
                if (res.status === 400) {
                    this.setState({ failedSubmit: true });
                } else if (res.status === 201 || res.status === 200 || res.status === 204) {
                    this.setState({ failedSubmit: false }, () => {
                        this.cancel();
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        });
    }
    cancel() {
        if (this.props.location.state && this.props.location.state.returnPage) {
            this.props.history.push(this.props.location.state.returnPage);
        } else if (localStorage.getItem(Config.cortexApi.scope + '_oAuthRole') === 'REGISTERED') {
            this.props.history.push('/profile');
        } else {
            this.props.history.push('/');
        }
    }
    render() {
        const newOrEdit = (this.props.location.state && this.props.location.state.address) ? "Edit" : "New";
        return (
            <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
                <div className="create-address-container container">
                    <h3>{newOrEdit} Address</h3>
                    <form role="form" className="form-horizontal" onSubmit={this.submitAddress}>
                        <div data-region="componentAddressFormRegion" style={{ display: 'block' }}>
                            <div className="address-form-container">
                                <div className="feedback-label address-form-feedback-container" data-region="componentAddressFeedbackRegion">
                                    {this.state.failedSubmit ? ("Failed to Save, please check all required fields are filled.") : ("")}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="FirstName" data-el-label="addressForm.firstName" className="control-label address-form-label">
                                        <span className="required-label">*</span> First Name</label>
                                    <div className="address-form-input">
                                        <input id="registration_form_firstName" name="FirstName" className="form-control" type="text" autoFocus="autofocus" value={this.state.firstName} onChange={this.setFirstName} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="LastName" data-el-label="addressForm.lastName" className="control-label address-form-label">
                                        <span className="required-label">*</span> Last Name</label>
                                    <div className="address-form-input">
                                        <input id="registration_form_lastName" name="LastName" className="form-control" type="text" value={this.state.lastName} onChange={this.setLastName} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="StreetAddress" data-el-label="addressForm.streetAddress" className="control-label address-form-label">
                                        <span className="required-label">*</span> Street Address</label>
                                    <div className="address-form-input">
                                        <input id="StreetAddress" name="StreetAddress" className="form-control" type="text" value={this.state.address} onChange={this.setAddress} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ExtendedAddress" data-el-label="addressForm.extendedAddress" className="control-label address-form-label">Extended Address</label>
                                    <div className="address-form-input">
                                        <input id="ExtendedAddress" name="ExtendedAddress" className="form-control" type="text" value={this.state.extendedAddress} onChange={this.setExtendedAddress} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="City" data-el-label="addressForm.city" className="control-label address-form-label">
                                        <span className="required-label">*</span> City</label>
                                    <div className="address-form-input">
                                        <input id="City" name="City" className="form-control" type="text" value={this.state.city} onChange={this.setCity} />
                                    </div>
                                </div>
                                <div data-region="addressCountryRegion" className="form-group" style={{ display: 'block' }}>
                                    <div>
                                        <label htmlFor="Country" data-el-label="addressForm.country" className="control-label address-form-label">
                                            <span className="required-label">*</span> Country</label>
                                        <div className="address-form-input">
                                            <select id="Country" name="Country" className="form-control" value={this.state.country} onChange={this.setCountry}>
                                                <option value=""></option>
                                                {this.renderCountries()}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {this.renderSubCountries()}
                                <div className="form-group">
                                    <label htmlFor="PostalCode" data-el-label="addressForm.postalCode" className="control-label address-form-label">
                                        <span className="required-label">*</span> Postal Code</label>
                                    <div className="address-form-input">
                                        <input id="PostalCode" name="PostalCode" className="form-control" type="text" value={this.state.postalCode} onChange={this.setPostalCode} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group create-address-btn-container container">
                            <button className="btn btn-primary address-save-btn" data-el-label="addressForm.save" type="submit">Save</button>
                            <button className="btn address-cancel-btn" data-el-label="addressForm.cancel" type="button" onClick={() => { this.cancel() }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddressFormMain;