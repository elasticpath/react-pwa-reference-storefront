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
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

const today = new Date();

class PaymentFormMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      cardType: 'amex',
      cardHolderName: '',
      cardNumber: '',
      expiryMonth: today.getMonth() + 1,
      expiryYear: today.getFullYear(),
      securityCode: '',
      saveToProfile: false,
      failedSubmit: false,
      paymentForm: undefined,
      orderPaymentForm: undefined,
    };
    this.setCardType = this.setCardType.bind(this);
    this.setCardHolderName = this.setCardHolderName.bind(this);
    this.setCardNumber = this.setCardNumber.bind(this);
    this.setExpiryMonth = this.setExpiryMonth.bind(this);
    this.setExpiryYear = this.setExpiryYear.bind(this);
    this.setSecurityCode = this.setSecurityCode.bind(this);
    this.setSaveToProfile = this.setSaveToProfile.bind(this);
    this.submitPayment = this.submitPayment.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    this.fetchPaymentForms();
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

  setSaveToProfile(event) {
    this.setState({ saveToProfile: event.target.checked });
  }

  submitPayment(event) {
    event.preventDefault();
    const {
      cardHolderName, cardType, cardNumber, securityCode, saveToProfile, paymentForm, orderPaymentForm,
    } = this.state;
    if (!cardHolderName || !cardNumber || !securityCode) {
      this.setState({ failedSubmit: true });
      return;
    }
    let link;
    if (saveToProfile) {
      link = paymentForm;
    } else {
      link = orderPaymentForm;
    }
    let card;
    switch (cardType) {
      case 'visa':
        card = 'Visa';
        break;
      case 'master':
        card = 'MasterCard';
        break;
      default:
        card = 'American Express';
    }
    // set link based on savetoprofile
    login().then(() => {
      cortexFetch(link, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          'display-name': `${cardHolderName}'s ${card} ending in: ****${cardNumber.substring(cardNumber.length - 4)}`,
          token: Math.random().toString(36).substr(2, 9),
          /* token is being randomly generated here to be passed to the demo payment gateway
          ** in a true implementation this token should be received from the actual payment gateway
          ** when doing so, make sure you're compliant with PCI DSS
          */
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

  fetchPaymentForms() {
    login().then(() => {
      cortexFetch('/?zoom=defaultcart:order:paymentmethodinfo:paymenttokenform,defaultprofile:paymentmethods:paymenttokenform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const paymentFormLink = res._defaultprofile[0]._paymentmethods[0]._paymenttokenform[0].links.find(
            link => link.rel === 'createpaymenttokenaction',
          );
          const orderPaymentFormLink = res._defaultcart[0]._order[0]._paymentmethodinfo[0]._paymenttokenform[0].links.find(
            link => link.rel === 'createpaymenttokenfororderaction',
          );
          this.setState({
            paymentForm: paymentFormLink.uri,
            orderPaymentForm: orderPaymentFormLink.uri,
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

  static renderYears() {
    const options = [];
    for (let i = 0; i < 10; i += 1) {
      options.push(
        <option key={today.getFullYear() + i} value={today.getFullYear() + i}>
          {today.getFullYear() + i}
        </option>,
      );
    }
    return options;
  }

  render() {
    const {
      cardType, cardHolderName, cardNumber, expiryMonth, expiryYear, securityCode, saveToProfile, failedSubmit,
    } = this.state;
    return (
      <div>
        <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
          <div className="container">
            <h1>
              {intl.get('new-payment-method')}
            </h1>
            <div className="feedback-label address-form-feedback-container" data-region="componentPaymentFeedbackRegion">
              {failedSubmit ? intl.get('failed-to-save-message') : ''}
            </div>
            <form className="form-horizontal payment-method-form-container container" onSubmit={this.submitPayment}>
              <div className="form-group">
                <label htmlFor="CardType" data-el-label="payment.cardType" className="control-label form-label">
                  <span className="required-label">
                    *
                  </span>
                  {intl.get('card-type')}
                </label>
                <div className="form-input">
                  <select id="CardType" name="CardType" className="form-control" value={cardType} onChange={this.setCardType}>
                    <option value="amex">
                      {intl.get('american-express')}
                    </option>
                    <option value="master">
                      {intl.get('mastercard')}
                    </option>
                    <option value="visa">
                      {intl.get('visa')}
                    </option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="CardHolderName" data-el-label="payment.cardHolderName" className="control-label form-label">
                  <span className="required-label">
                    *
                  </span>
                  {intl.get('card-holders-name')}
                </label>
                <div className="form-input">
                  {/* eslint-disable-next-line max-len */}
                  <input id="CardHolderName" name="CardHolderName" className="form-control" type="text" value={cardHolderName} onChange={this.setCardHolderName} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="CardNumber" data-el-label="payment.cardNum" className="control-label form-label">
                  <span className="required-label">
                    *
                  </span>
                  {intl.get('credit-card-number')}
                </label>
                <div className="form-input">
                  <input id="CardNumber" name="CardNumber" className="form-control" type="text" value={cardNumber} onChange={this.setCardNumber} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="ExpiryMonth" data-el-label="payment.expiryDate" className="control-label form-label">
                  <span className="required-label">
                    *
                  </span>
                  {intl.get('expiry-date')}
                </label>
                <div className="form-inline">
                  <select id="ExpiryMonth" name="ExpiryMonth" className="form-control expiry-date" value={expiryMonth} onChange={this.setExpiryMonth}>
                    <option value="1">
                      1
                    </option>
                    <option value="2">
                      2
                    </option>
                    <option value="3">
                      3
                    </option>
                    <option value="4">
                      4
                    </option>
                    <option value="5">
                      5
                    </option>
                    <option value="6">
                      6
                    </option>
                    <option value="7">
                      7
                    </option>
                    <option value="8">
                      8
                    </option>
                    <option value="9">
                      9
                    </option>
                    <option value="10">
                      10
                    </option>
                    <option value="11">
                      11
                    </option>
                    <option value="12">
                      12
                    </option>
                  </select>
                  &nbsp;/&nbsp;
                  <select id="ExpiryYear" name="ExpiryYear" className="form-control expiry-date" value={expiryYear} onChange={this.setExpiryYear}>
                    {PaymentFormMain.renderYears()}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="SecurityCode" data-el-label="payment.securityCode" className="control-label form-label">
                  <span className="required-label">
                    *
                  </span>
                  {intl.get('security-code')}
                </label>
                <div className="form-input">
                  {/* eslint-disable-next-line max-len */}
                  <input id="SecurityCode" name="SecurityCode" className="form-control" maxLength="4" type="text" value={securityCode} onChange={this.setSecurityCode} />
                </div>
              </div>
              <div className="form-group" data-el-label="payment.saveToProfileFormGroup">
                {/* eslint-disable-next-line max-len */}
                <input type="checkbox" id="saveToProfile" data-el-label="payment.saveToProfile" checked={saveToProfile} onChange={this.setSaveToProfile} />
                <label htmlFor="saveToProfile" className="control-label form-label">
                  &nbsp;
                  {intl.get('save-payment-to-profile')}
                </label>
              </div>
              <div className="form-group create-address-btn-container">
                <button className="btn btn-primary payment-save-btn" data-el-label="paymentForm.save" type="submit">
                  {intl.get('continue')}
                </button>
                <button className="btn payment-cancel-btn" data-el-label="paymentForm.cancel" type="button" onClick={() => { this.cancel(); }}>
                  {intl.get('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentFormMain;
