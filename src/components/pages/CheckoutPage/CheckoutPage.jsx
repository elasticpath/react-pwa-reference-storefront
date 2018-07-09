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
import { login } from '../../../utils/AuthService.js';
import AppHeaderMain from '../../ui/appheader/appheader.main.jsx';
import AppFooterMain from '../../ui/appfooter/appfooter.main.jsx';
import CheckoutSummaryList from '../../ui/checkout/checkout.summarylist.jsx';

var Config = require('Config')
// Then use in render: <span>{Config.skuImagesS3Url}</span>

// Array of zoom parameters to pass to Cortex
var zoomArray = [
    'total',
    'discount',
    'order',
    'order:tax',
    'order:total',
    'appliedpromotions:element',
    'order:billingaddressinfo:selector:choice',
    'order:billingaddressinfo:selector:choice:description',
    'order:billingaddressinfo:selector:chosen',
    'order:billingaddressinfo:selector:chosen:description',
    'order:deliveries:element:destinationinfo:selector:chosen',
    'order:deliveries:element:destinationinfo:selector:chosen:description',
    'order:deliveries:element:destinationinfo:selector:choice',
    'order:deliveries:element:destinationinfo:selector:choice:description',
    'order:deliveries:element:shippingoptioninfo:selector:chosen',
    'order:deliveries:element:shippingoptioninfo:selector:chosen:description',
    'order:deliveries:element:shippingoptioninfo:selector:choice',
    'order:deliveries:element:shippingoptioninfo:selector:choice:description'
];

class CheckoutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: undefined
        };
    }
    fetchOrderData() {
        login().then(() => {
            fetch(Config.cortexApi.path + '/carts/' + Config.cortexApi.scope + '/default?zoom=' + zoomArray.join(),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                    }
                })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        orderData: res
                    }, () => { console.log(this.state.orderData) });
                })
                .catch(error => {
                    console.log(error)
                });
        });
    }
    componentDidMount() {
        this.fetchOrderData();
    }
    newAddress() {
        this.props.history.push('/newaddressform', { returnPage: '/checkout' });
    }
    editAddress(addressLink) {
        this.props.history.push('/editaddress', { returnPage: '/checkout', address: addressLink });
    }
    deleteAddress(addressLink) {
        login().then(() => {
            fetch(addressLink, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                }
            }).then(() => {
                this.fetchOrderData();
            }).catch(error => {
                console.log(error);
            });
        });
    }
    handleChange(link) {
        login().then(() => {
            fetch(link, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                }
            }).then(() => {
                this.fetchOrderData();
            }).catch(error => {
                console.log(error);
            })
        })
    }
    newPayment() {
        this.props.history.push('/newpaymentform', { returnPage: '/checkout' });
    }
    renderShippingAddress() {
        if (this.state.orderData['_order'][0]['_deliveries'] && this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_destinationinfo']) {
            var shippingAddresses = this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_destinationinfo'][0]['_selector'][0]['_chosen'];
            if (this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_destinationinfo'][0]['_selector'][0]['_choice']) {
                const choices = this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_destinationinfo'][0]['_selector'][0]['_choice'];
                shippingAddresses = shippingAddresses.concat(choices);
            }
            return (
                shippingAddresses.map((shippingAddress, index) => {
                    const name = shippingAddress['_description'][0]['name'];
                    const address = shippingAddress['_description'][0]['address'];
                    return (
                        <div key={"shippingOption_" + Math.random().toString(36).substr(2, 9)}>
                            <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
                                <input type="radio" name="shipping" id="shippingOption" className="checkout-address-radio" defaultChecked={!index} onChange={() => this.handleChange(shippingAddress['self']['href'])} />
                                <label htmlFor="shippingOption">
                                    <div data-region="checkoutAddressRegion" style={{ display: 'block' }}>
                                        <ul className="address-container">
                                            <li className="address-name" data-el-value="address.name">{name['given-name']}&nbsp;{name['family-name']}</li>
                                            <li className="address-street-address" data-el-value="address.streetAddress">{address['street-address']}</li>
                                            <li className="address-extended-address" data-el-value="address.extendedAddress">{address['extended-address']}</li>
                                            <li>
                                                <span className="address-city" data-el-value="address.city">{address['locality']},&nbsp;</span>
                                                <span className="address-region" data-el-value="address.region">{address['region']},&nbsp;</span>
                                                <span className="address-country" data-el-value="address.country">{address['country-name']}&nbsp;</span>
                                                <span className="address-postal-code" data-el-value="address.postalCode">{address['postal-code']}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </label>
                            </div>
                            <div className="address-btn-cell">
                                <button className="btn checkout-edit-address-btn" data-el-label="checkout.editAddressBtn" onClick={() => { this.editAddress(shippingAddress['_description'][0]['self']['href']) }}>Edit</button>
                                <button className="btn checkout-delete-address-btn" data-el-label="checkout.deleteAddressBtn" onClick={() => { this.deleteAddress(shippingAddress['_description'][0]['self']['href']) }}>Delete</button>
                            </div>
                        </div>
                    );
                })
            )
        } else {
            return (
                <div>
                    <p data-el-value="checkout.noShippingAddressesMsg">You have no saved shipping addresses.</p>
                </div>
            );
        }
    }
    renderShippingAddressSelector() {
        return (
            <div data-region="shippingAddressesRegion" style={{ display: 'block' }}>
                <div>
                    <h2>Shipping Address</h2>
                    <div data-region="shippingAddressSelectorsRegion" className="checkout-region-inner-container">
                        {this.renderShippingAddress()}
                    </div>
                    <button className="btn btn-primary checkout-new-address-btn" data-el-label="checkout.newShippingAddressBtn" onClick={() => { this.newAddress() }}>Add a New Address</button>
                </div>
            </div>
        );
    }
    renderShippingOptions() {
        if (this.state.orderData['_order'][0]['_deliveries'] && this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_shippingoptioninfo']) {
            var shippingOptions = this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_shippingoptioninfo'][0]['_selector'][0]['_chosen'];
            if (this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_shippingoptioninfo'][0]['_selector'][0]['_choice']) {
                const choices = this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_shippingoptioninfo'][0]['_selector'][0]['_chosen'];
                shippingOptions = shippingOptions.concat(choices);
            }
            return (
                shippingOptions.map((shippingOption, index) => {
                    return (
                        <div key={"shippingOption_" + Math.random().toString(36).substr(2, 9)}>
                            <input type="radio" name="shippingOption" id="shippingOption" className="shipping-option-radio" defaultChecked={!index} onChange={() => this.handleChange(shippingOption['self']['href'])} />
                            <label htmlFor="shippingOption">
                                <span data-el-value="shippingOptionDisplayName">{shippingOption['_description'][0]['display-name']}</span>
                                <span data-el-value="shippingOptionCarrier">{shippingOption['_description'][0]['carrier']}</span>
                                <span data-el-value="shippingOptionCost">{shippingOption['_description'][0]['cost'][0]['display']}</span>
                            </label>
                        </div>
                    );
                })
            );
        } else {
            return (
                <div>
                    <p data-el-value="checkout.noShippingOptionsMsg">There are no shipping options available for your chosen shipping address.</p>
                </div>
            );
        }
    }
    renderShippingOptionsSelector() {
        if (this.state.orderData['_order'][0]['_deliveries'] && this.state.orderData['_order'][0]['_deliveries'][0]['_element'][0]['_destinationinfo']) {
            return (
                <div>
                    <h2>Shipping Options</h2>
                    <div data-region="shippingOptionSelectorsRegion">
                        {this.renderShippingOptions()}
                    </div>
                </div>
            );
        }
    }
    renderBillingAddress() {
        if (this.state.orderData['_order'][0]['_billingaddressinfo']) {
            var billingAddresses = this.state.orderData['_order'][0]['_billingaddressinfo'][0]['_selector'][0]['_chosen'];
            if (this.state.orderData['_order'][0]['_billingaddressinfo'][0]['_selector'][0]['_choice']) {
                const choices = this.state.orderData['_order'][0]['_billingaddressinfo'][0]['_selector'][0]['_choice'];
                billingAddresses = billingAddresses.concat(choices);
            }
            return (
                billingAddresses.map((billingAddress, index) => {
                    const name = billingAddress['_description'][0]['name'];
                    const address = billingAddress['_description'][0]['address'];
                    return (
                        <div key={"billingOption_" + Math.random().toString(36).substr(2, 9)}>
                            <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
                                <input type="radio" name="billing" id="billingOption" className="checkout-address-radio" defaultChecked={!index} onChange={() => this.handleChange(billingAddress['self']['href'])} />
                                <label htmlFor="billingOption">
                                    <div data-region="checkoutAddressRegion" style={{ display: 'block' }}>
                                        <ul className="address-container">
                                            <li className="address-name" data-el-value="address.name">{name['given-name']}&nbsp;{name['family-name']}</li>
                                            <li className="address-street-address" data-el-value="address.streetAddress">{address['street-address']}</li>
                                            <li className="address-extended-address" data-el-value="address.extendedAddress">{address['extended-address']}</li>
                                            <li>
                                                <span className="address-city" data-el-value="address.city">{address['locality']},&nbsp;</span>
                                                <span className="address-region" data-el-value="address.region">{address['region']},&nbsp;</span>
                                                <span className="address-country" data-el-value="address.country">{address['country-name']}&nbsp;</span>
                                                <span className="address-postal-code" data-el-value="address.postalCode">{address['postal-code']}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </label>
                            </div>
                            <div className="address-btn-cell">
                                <button className="btn checkout-edit-address-btn" data-el-label="checkout.editAddressBtn" onClick={() => { this.editAddress(billingAddress['_description'][0]['self']['href']) }}>Edit</button>
                                <button className="btn checkout-delete-address-btn" data-el-label="checkout.deleteAddressBtn" onClick={() => { this.deleteAddress(billingAddress['_description'][0]['self']['href']) }}>Delete</button>
                            </div>
                        </div>
                    );
                })
            )
        } else {
            return (
                <div>
                    <p data-el-value="checkout.noBillingAddressesMsg">You have no saved billing addresses.</p>
                </div>
            );
        }
    }
    renderBillingAddressSelector() {
        return (
            <div>
                <h2>Billing Address</h2>
                <div data-region="billingAddressSelectorsRegion" className="checkout-region-inner-container">
                    {this.renderBillingAddress()}
                </div>
                <button className="btn btn-primary checkout-new-address-btn" data-el-label="checkout.newBillingAddressBtn" onClick={() => { this.newAddress() }}>Add a New Address</button>
            </div>
        );
    }
    render() {
        if (this.state.orderData) {
            return (
                <div>
                    <AppHeaderMain />
                    <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
                        <div className="checkout-container container">
                            <div className="checkout-container-inner">
                                <div data-region="checkoutTitleRegion" className="checkout-title-container" style={{ display: 'block' }}>
                                    <div>
                                        <h1 className="view-title">Checkout Summary</h1>
                                    </div>
                                </div>
                                <div className="checkout-main-container">
                                    <div data-region="billingAddressesRegion" style={{ display: 'block' }}>
                                        {this.renderBillingAddressSelector()}
                                    </div>
                                    <div className="checkout-shipping-container">
                                        {this.renderShippingAddressSelector()}
                                        <div data-region="shippingOptionsRegion">
                                            {this.renderShippingOptionsSelector()}
                                        </div>
                                    </div>
                                    <div data-region="paymentMethodsRegion" style={{ display: 'block' }}>
                                        <div>
                                            <h2>Payment Method</h2>
                                            <div data-region="paymentMethodSelectorsRegion" className="checkout-region-inner-container">
                                                <div>
                                                    <p data-el-value="checkout.noPaymentMethodsMsg">You have no saved payment method.</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary checkout-new-payment-btn" data-el-label="checkout.newPaymentMethodBtn" onClick={() => { this.newPayment() }}>Add a New Payment Method</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="checkout-sidebar" data-region="checkoutOrderRegion" style={{ display: 'block' }}>
                                    <div>
                                        <div className="checkout-sidebar-inner">
                                            <div data-region="checkoutSummaryRegion" className="checkout-summary-container" style={{ display: 'inline-block' }}>
                                                <CheckoutSummaryList data={this.state.orderData} />
                                            </div>
                                            <div data-region="checkoutActionRegion" className="checkout-submit-container" style={{ display: 'block' }}>
                                                <button className="btn-cmd-submit-order" data-el-label="checkout.submitOrder" disabled={true}>Complete Purchase</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <AppFooterMain />
                </div>
            );
        } else {
            return (<span>Loading...</span>)
        }
    }
}

export default CheckoutPage;