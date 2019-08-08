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
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import './paymentform.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

const today = new Date();

interface PaymentFormMainProps {
    onCloseModal?: (...args: any[]) => any,
    fetchData?: (...args: any[]) => any,
}

interface PaymentFormMainState {
    showLoader: boolean,
    cardType: string,
    cardHolderName: string,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    securityCode: string,
    saveToProfile: boolean,
    failedSubmit: boolean,
    paymentForm: any,
    orderPaymentForm: any,
    cybersourceBodyRequest: any,
}

class PaymentFormMain extends React.Component<PaymentFormMainProps, PaymentFormMainState> {
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
      showLoader: false,
      cardType: '003',
      cardHolderName: '',
      cardNumber: '',
      expiryMonth: today.getMonth() + 1,
      expiryYear: today.getFullYear(),
      securityCode: '',
      saveToProfile: false,
      failedSubmit: false,
      paymentForm: undefined,
      orderPaymentForm: undefined,
      cybersourceBodyRequest: {},
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
    this.fetchCybersourceForm = this.fetchCybersourceForm.bind(this);
  }

  componentDidMount() {
    this.fetchPaymentForms();
  }

  componentDidUpdate() {
    const formCardNumberExists = document.getElementById('card_number');
    const formBillEmailExists = document.getElementById('bill_to_email');
    const formExists = document.getElementById('payment_confirmation');

    if (formExists && formCardNumberExists && formBillEmailExists) {
      document.getElementById('payment_confirmation').submit();
    }
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
    this.setState({
      showLoader: true,
    });
    const {
      cardHolderName, cardType, cardNumber, securityCode, saveToProfile, paymentForm, orderPaymentForm, expiryYear, expiryMonth,
    } = this.state;
    const { fetchData, onCloseModal } = this.props;
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
      case '001':
        card = 'Visa';
        break;
      case '002':
        card = 'MasterCard';
        break;
      default:
        card = 'American Express';
    }

    if (Config.creditCardTokenization && Config.creditCardTokenization.enable && Config.creditCardTokenization.lambdaURI !== '') {
      const name = cardHolderName.split(' ');
      const formatedExpiryMonth = ((expiryMonth) < 10 ? '0' : '') + (expiryMonth);
      let bodyLambdaRequest = {
        reference_number: Math.floor(Math.random() * 1000000001),
        currency: Config.defaultCurrencyValue,
        payment_method: 'card',
        bill_to_email: '',
        locale: Config.defaultLocaleValue,
        bill_to_address_line1: '',
        bill_to_address_city: '',
        bill_to_address_state: '',
        bill_to_address_country: '',
        bill_to_address_postal_code: '',
        override_custom_receipt_page: '',
        override_custom_cancel_page: '',
      };
      const zoomArrayProfile = [
        'defaultcart',
        'defaultcart:total',
        'defaultprofile',
        'defaultprofile:addresses',
        'defaultprofile:addresses:element',
        'defaultprofile:emails',
        'defaultprofile:emails:element',
      ];
      login().then(() => {
        cortexFetch(`/?zoom=${zoomArrayProfile.join()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
          })
          .then(profileData => profileData.json())
          .then((profileData) => {
            bodyLambdaRequest = {
              ...bodyLambdaRequest,
              currency: profileData._defaultcart[0]._total[0].cost[0].currency,
              bill_to_email: profileData._defaultprofile[0]._emails[0]._element[0].email,
              bill_to_address_city: profileData._defaultprofile[0]._addresses[0]._element[0].address.locality,
              bill_to_address_state: profileData._defaultprofile[0]._addresses[0]._element[0].address.region,
              bill_to_address_country: profileData._defaultprofile[0]._addresses[0]._element[0].address['country-name'],
              bill_to_address_postal_code: profileData._defaultprofile[0]._addresses[0]._element[0].address['postal-code'],
              bill_to_address_line1: profileData._defaultprofile[0]._addresses[0]._element[0].address['street-address'],
              override_custom_receipt_page: window.location.href,
              override_custom_cancel_page: window.location.href,
            };
            fetch(Config.creditCardTokenization.lambdaURI, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bodyLambdaRequest),
            })
              .then(lambdaResponse => lambdaResponse.json())
              .then((lambdaResponse) => {
                const cardData = {
                  bill_to_forename: name[0],
                  bill_to_surname: name[1],
                  card_type: cardType,
                  card_number: cardNumber,
                  cardExpiryDate: `${formatedExpiryMonth}-${expiryYear}`,
                  card_cvn: securityCode,
                };
                const cybersourceBodyRequest = { ...cardData, ...lambdaResponse };
                this.setState({ cybersourceBodyRequest });
              });
          });
        // });
      })
        .catch((error) => {
          this.setState({
            showLoader: false,
          });
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    } else {
      login().then(() => {
        cortexFetch(link, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({
            'display-name': `${cardHolderName}'s ${card} ending in: ****${cardNumber.substring(cardNumber.length - 4)}`,
            token: Math.random()
              .toString(36)
              .substr(2, 9),
            /* token is being randomly generated here to be passed to the demo payment gateway
            ** in a true implementation this token should be received from the actual payment gateway
            ** when doing so, make sure you're compliant with PCI DSS
            */
          }),
        })
          .then((res) => {
            this.setState({
              showLoader: false,
            });
            if (res.status === 400) {
              this.setState({ failedSubmit: true });
            } else if (res.status === 201 || res.status === 200 || res.status === 204) {
              this.setState({ failedSubmit: false }, () => {
                fetchData();
                onCloseModal();
              });
            }
          })
          .catch((error) => {
            this.setState({
              showLoader: false,
            });
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  fetchCybersourceForm(cybersourceBodyRequest) {
    return (
      <form id="payment_confirmation" className="payment_confirmation col-md-12" action={cybersourceBodyRequest.cs_endpoint_url} method="post">
        <input type="text" id="transaction_type" name="transaction_type" value={cybersourceBodyRequest.transaction_type} />
        <input type="text" id="amount" name="amount" value={cybersourceBodyRequest.amount} />
        <input type="text" id="transaction_uuid" name="transaction_uuid" value={cybersourceBodyRequest.transaction_uuid} />
        <input type="text" id="signed_date_time" name="signed_date_time" value={cybersourceBodyRequest.signed_date_time} />
        <input type="text" id="unsigned_field_names" name="unsigned_field_names" value={cybersourceBodyRequest.unsigned_field_names} />
        <input type="text" id="bill_to_address_postal_code" name="bill_to_address_postal_code" value={cybersourceBodyRequest.bill_to_address_postal_code} />
        <input type="text" id="bill_to_address_state" name="bill_to_address_state" value={cybersourceBodyRequest.bill_to_address_state} />
        <input type="text" id="signed_field_names" name="signed_field_names" value={cybersourceBodyRequest.signed_field_names} />
        <input type="text" id="locale" name="locale" value={cybersourceBodyRequest.locale} />
        <input type="text" id="bill_to_email" name="bill_to_email" value={cybersourceBodyRequest.bill_to_email} />
        <input type="text" id="reference_number" name="reference_number" value={cybersourceBodyRequest.reference_number} />
        <input type="text" id="bill_to_address_country" name="bill_to_address_country" value={cybersourceBodyRequest.bill_to_address_country} />
        <input type="text" id="bill_to_surname" name="bill_to_surname" value={cybersourceBodyRequest.bill_to_surname} />
        <input type="text" id="bill_to_address_line1" name="bill_to_address_line1" value={cybersourceBodyRequest.bill_to_address_line1} />
        <input type="text" id="profile_id" name="profile_id" value={cybersourceBodyRequest.profile_id} />
        <input type="text" id="access_key" name="access_key" value={cybersourceBodyRequest.access_key} />
        <input type="text" id="bill_to_phone" name="bill_to_phone" value={cybersourceBodyRequest.bill_to_phone} />
        <input type="text" id="bill_to_address_city" name="bill_to_address_city" value={cybersourceBodyRequest.bill_to_address_city} />
        <input type="text" id="currency" name="currency" value={cybersourceBodyRequest.currency} />
        <input type="text" id="bill_to_forename" name="bill_to_forename" value={cybersourceBodyRequest.bill_to_forename} />
        <input type="text" id="payment_method" name="payment_method" value={cybersourceBodyRequest.payment_method} />
        <input type="text" id="signature" name="signature" value={cybersourceBodyRequest.signature} />
        <input type="text" id="override_custom_receipt_page" name="override_custom_receipt_page" value={cybersourceBodyRequest.override_custom_receipt_page} />
        <input type="text" id="override_custom_cancel_page" name="override_custom_cancel_page" value={cybersourceBodyRequest.override_custom_cancel_page} />
        <fieldset>
          <div id="UnsignedDataSection" className="">
            <input type="text" id="card_cvn" name="card_cvn" value={cybersourceBodyRequest.card_cvn} />
            <input type="text" id="card_type" name="card_type" value={cybersourceBodyRequest.card_type} />
            <input type="text" id="card_number" name="card_number" value={cybersourceBodyRequest.card_number} />
            <input type="text" id="card_expiry_date" name="card_expiry_date" value={cybersourceBodyRequest.cardExpiryDate} />
          </div>
        </fieldset>
      </form>
    );
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
      cardType, cardHolderName, cardNumber, expiryMonth, expiryYear, securityCode, saveToProfile, failedSubmit, showLoader, cybersourceBodyRequest,
    } = this.state;
    return (
      <div className="payment-method-container container">
        {cybersourceBodyRequest.access_key && this.fetchCybersourceForm(cybersourceBodyRequest)}
        <div className="feedback-label feedback-container" data-region="componentPaymentFeedbackRegion">
          {failedSubmit ? intl.get('failed-to-save-message') : ''}
        </div>
        <form className="form-horizontal" onSubmit={this.submitPayment}>
          {showLoader && (
            <div className="loader-wrapper">
              <div className="miniLoader" />
            </div>
          )}
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
                <option value="003">
                  {intl.get('american-express')}
                </option>
                <option value="002">
                  {intl.get('mastercard')}
                </option>
                <option value="001">
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
              <input id="SecurityCode" name="SecurityCode" className="form-control" maxLength={4} type="text" pattern="\d*" value={securityCode} onChange={this.setSecurityCode} />
            </div>
          </div>
          <div className="form-group save-to-profile-group" data-el-label="payment.saveToProfileFormGroup">
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input type="checkbox" id="saveToProfile" data-el-label="payment.saveToProfile" className="style-checkbox" checked={saveToProfile} onChange={this.setSaveToProfile} />
              <label htmlFor="saveToProfile" />
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
