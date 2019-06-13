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
import PropTypes from 'prop-types';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import './paymentform.main.less';
import { getConfig } from '../utils/ConfigProvider';

let Config = {};
let intl = { get: str => str };

const today = new Date();

class PaymentFormMain extends React.Component {
  static propTypes = {
    onCloseModal: PropTypes.func,
    fetchData: PropTypes.func,
  }

  static defaultProps = {
    onCloseModal: () => {},
    fetchData: () => {},
  }

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = getConfig());
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
    const {fetchData, onCloseModal} = this.props;
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
            fetchData();
            onCloseModal();
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
    const { onCloseModal } = this.props;
    onCloseModal();
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
      <div className="payment-method-container container">
        <div className="feedback-label feedback-container" data-region="componentPaymentFeedbackRegion">
          {failedSubmit ? intl.get('failed-to-save-message') : ''}
        </div>
        <form className="form-horizontal" onSubmit={this.submitPayment}>
          <div className="form-group">
            <span className="gray-txt">
              {intl.get('all-fields-required')}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="CardHolderName" data-el-label="payment.cardHolderName" className="control-label form-label">
              {intl.get('card-holders-name')}
            </label>
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input id="CardHolderName" name="CardHolderName" className="form-control" type="text" value={cardHolderName} onChange={this.setCardHolderName} />
            </div>
          </div>
          <div className="form-group card-type-group">
            <label htmlFor="CardType" data-el-label="payment.cardType" className="control-label form-label">
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
            <label htmlFor="CardNumber" data-el-label="payment.cardNum" className="control-label form-label">
              {intl.get('credit-card-number')}
            </label>
            <div className="form-input">
              <input id="CardNumber" name="CardNumber" className="form-control" type="text" pattern="\d*" value={cardNumber} onChange={this.setCardNumber} />
            </div>
          </div>
          <div className="form-group expiry-date-group">
            <label htmlFor="ExpiryMonth" data-el-label="payment.expiryDate" className="control-label form-label">
              {intl.get('expiry-date')}
            </label>
            <div className="form-input form-inline">
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
          <div className="form-group security-code-group">
            <label htmlFor="SecurityCode" data-el-label="payment.securityCode" className="control-label form-label">
              {intl.get('security-code')}
            </label>
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input id="SecurityCode" name="SecurityCode" className="form-control" maxLength="4" type="text" pattern="\d*" value={securityCode} onChange={this.setSecurityCode} />
            </div>
          </div>
          <div className="form-group save-to-profile-group" data-el-label="payment.saveToProfileFormGroup">
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input type="checkbox" id="saveToProfile" data-el-label="payment.saveToProfile" className="style-checkbox" checked={saveToProfile} onChange={this.setSaveToProfile} />
              <label htmlFor="saveToProfile"/>
            </div>
            <label htmlFor="saveToProfile" className="control-label form-label">
              {intl.get('save-payment-to-profile')}
            </label>
          </div>
          <div className="form-group form-btn-group">
            <div className="control-label" />
            <div className="form-input btn-container">
              <button className="ep-btn payment-cancel-btn" data-el-label="paymentForm.cancel" type="button" onClick={() => { this.cancel(); }}>
                {intl.get('cancel')}
              </button>
              <button className="ep-btn primary payment-save-btn" data-el-label="paymentForm.save" type="submit">
                {intl.get('save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default PaymentFormMain;
