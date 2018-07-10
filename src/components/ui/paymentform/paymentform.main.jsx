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

var Config = require('Config')
// Then use in render: <span>{Config.skuImagesS3Url}</span>
var today = new Date();

class PaymentFormMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardType: "amex",
            cardHolderName: "",
            cardNumber: "",
            expiryMonth: today.getMonth() + 1,
            expiryYear: today.getFullYear(),
            securityCode: ""
        };
        this.setCardType = this.setCardType.bind(this);
        this.setCardHolderName = this.setCardHolderName.bind(this);
        this.setCardNumber = this.setCardNumber.bind(this);
        this.setExpiryMonth = this.setExpiryMonth.bind(this);
        this.setExpiryYear = this.setExpiryYear.bind(this);
        this.setSecurityCode = this.setSecurityCode.bind(this);
        this.submitPayment = this.submitPayment.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    setCardType(event) {
        this.setState({ cardType: event.target.value });
    }
    setCardHolderName(event) {
        this.setState({ cardHolderName: event.target.value });
    }
    setCardNumber(event) {
        this.setState({ cardNumber: event.target.value });
    }
    setExpiryMonth(event) {
        this.setState({ expiryMonth: event.target.value });
    }
    setExpiryYear(event) {
        this.setState({ expiryYear: event.target.value });
    }
    setSecurityCode(event) {
        this.setState({ securityCode: event.target.value });
    }
    submitPayment() {
        this.cancel();
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
    renderYears() {
        let options = [];
        for (let i = 0; i < 10; i++) {
            options.push(<option key={today.getFullYear() + i} value={today.getFullYear() + i}>{today.getFullYear() + i}</option>);
        }
        return options;
    }
    render() {
        return (
            <div>
                <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
                    <div className="container">
                        <h1>New Payment Method</h1>
                        <div className="feedback-label address-form-feedback-container" data-region="componentPaymentFeedbackRegion"></div>
                        <form role="form" className="form-horizontal payment-method-form-container container" onSubmit={this.submitPayment}>
                            <div className="form-group">
                                <label htmlFor="CardType" data-el-label="payment.cardType" className="control-label form-label">
                                    <span className="required-label">*</span>Card Type</label>
                                <div className="form-input">
                                    <select id="CardType" name="CardType" className="form-control" value={this.state.cardType} onChange={this.setCardType}>
                                        <option value="amex">American Express</option>
                                        <option value="master">Mastercard</option>
                                        <option value="visa">Visa</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="CardHolderName" data-el-label="payment.cardHolderName" className="control-label form-label">
                                    <span className="required-label">*</span>Card Holder's Name</label>
                                <div className="form-input">
                                    <input id="CardHolderName" name="CardHolderName" className="form-control" type="text" autoFocus="autofocus" value={this.state.cardHolderName} onChange={this.setCardHolderName} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="CardNumber" data-el-label="payment.cardNum" className="control-label form-label">
                                    <span className="required-label">*</span>Credit Card Number</label>
                                <div className="form-input">
                                    <input id="CardNumber" name="CardNumber" className="form-control" type="text" value={this.state.cardNumber} onChange={this.setCardNumber} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ExpiryMonth" data-el-label="payment.expiryDate" className="control-label form-label">
                                    <span className="required-label">*</span>Expiry Date</label>
                                <div className="form-inline">
                                    <select id="ExpiryMonth" name="ExpiryMonth" className="form-control expiry-date" value={this.state.expiryMonth} onChange={this.setExpiryMonth} >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                    &nbsp;/&nbsp;
                                    <select id="ExpiryYear" name="ExpiryYear" className="form-control expiry-date" value={this.state.expiryYear} onChange={this.setExpiryYear} >
                                        {this.renderYears()}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="SecurityCode" data-el-label="payment.securityCode" className="control-label form-label">
                                    <span className="required-label">*</span>Security Code</label>
                                <div className="form-input">
                                    <input id="SecurityCode" name="SecurityCode" className="form-control" maxLength="4" type="text" value={this.state.securityCode} onChange={this.setSecurityCode} />
                                </div>
                            </div>
                            <div className="form-group" data-el-label="payment.saveToProfileFormGroup">
                                <input type="checkbox" id="saveToProfile" data-el-label="payment.saveToProfile" />
                                <label htmlFor="saveToProfile" className="control-label form-label">&nbsp;Save this payment method to my profile</label>
                            </div>
                            <div className="form-group create-address-btn-container">
                                <button className="btn btn-primary payment-save-btn" data-el-label="paymentForm.save" type="submit">Continue</button>
                                <button className="btn payment-cancel-btn" data-el-label="paymentForm.cancel" type="button" onClick={() => { this.cancel() }} >Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default PaymentFormMain;