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
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import './paymentform.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

const today = new Date();

interface PaymentFormMainProps {
  /** dictates whether to add tokenized payment data to the profile resource or checkout resource. */
  shouldPostToProfile: boolean,
  /** handle close modal */
  onCloseModal?: (...args: any[]) => any,
  /** handle fetch data */
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
    showSaveToProfile: boolean,
    saveToProfile: boolean,
    failedSubmit: boolean,
    paymentInstrumentFormFieldsToFill: object;
    submitPaymentFormOrderUri: string;
    submitPaymentFormProfileUri: string;
}

class PaymentFormMain extends Component<PaymentFormMainProps, PaymentFormMainState> {
  static defaultProps = {
    onCloseModal: () => {},
    fetchData: () => {},
    shouldPostToProfile: false,
  }

  formRef: React.RefObject<HTMLFormElement>;

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
      showSaveToProfile: true,
      saveToProfile: false,
      failedSubmit: false,
      paymentInstrumentFormFieldsToFill: {},
      submitPaymentFormOrderUri: '',
      submitPaymentFormProfileUri: '',
    };

    this.setCardType = this.setCardType.bind(this);
    this.setCardHolderName = this.setCardHolderName.bind(this);
    this.setCardNumber = this.setCardNumber.bind(this);
    this.setExpiryMonth = this.setExpiryMonth.bind(this);
    this.setExpiryYear = this.setExpiryYear.bind(this);
    this.setSecurityCode = this.setSecurityCode.bind(this);
    this.setSaveToProfile = this.setSaveToProfile.bind(this);
    this.submitPayment = this.submitPayment.bind(this);
    this.setPaymentInstrumentFormFieldsToFill = this.setPaymentInstrumentFormFieldsToFill.bind(this);
    this.fillPaymentInstrumentFormFields = this.fillPaymentInstrumentFormFields.bind(this);
    this.setSubmitPaymentFormUri = this.setSubmitPaymentFormUri.bind(this);
    this.makeSubmitPaymentRequest = this.makeSubmitPaymentRequest.bind(this);
    this.initializeState = this.initializeState.bind(this);
    this.areCreditCardFieldsValid = this.areCreditCardFieldsValid.bind(this);
    this.parsePaymentInstrumentFormFieldsFromResponse = this.parsePaymentInstrumentFormFieldsFromResponse.bind(this);
    this.setShouldShowSaveToProfile = this.setShouldShowSaveToProfile.bind(this);
    this.cancel = this.cancel.bind(this);
    this.formRef = React.createRef<HTMLFormElement>();
  }

  async initializeState() {
    const paymentInstrumentForm = await PaymentFormMain.fetchPaymentInstrumentForm();
    this.setShouldShowSaveToProfile();
    this.setPaymentInstrumentFormFieldsToFill(paymentInstrumentForm);
    this.setSubmitPaymentFormUri(paymentInstrumentForm);
  }

  async componentDidMount() {
    this.initializeState();
  }

  setSubmitPaymentFormUri(paymentInstrumentForm) {
    const submitPaymentFormOrderUri = PaymentFormMain.parseOrderPaymentInstrumentFormActionFromResponse(paymentInstrumentForm);
    const submitPaymentFormProfileUri = PaymentFormMain.parseProfilePaymentInstrumentFormActionFromResponse(paymentInstrumentForm);
    this.setState({ submitPaymentFormProfileUri, submitPaymentFormOrderUri });
  }

  setPaymentInstrumentFormFieldsToFill(paymentInstrumentForm) {
    const paymentFormFieldsToFill = this.parsePaymentInstrumentFormFieldsFromResponse(paymentInstrumentForm);
    this.setState({ paymentInstrumentFormFieldsToFill: paymentFormFieldsToFill });
  }

  async setShouldShowSaveToProfile() {
    const { shouldPostToProfile } = this.props;

    if (shouldPostToProfile || localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'PUBLIC') {
      this.setState({ showSaveToProfile: false });
    }
  }

  static parseOrderPaymentInstrumentFormActionFromResponse(paymentInstrumentForm) {
    try {
      return paymentInstrumentForm._defaultcart[0]._order[0]._paymentmethodinfo[0]._element[0]._paymentinstrumentform[0].self.uri;
    } catch (err) {
      return null;
    }
  }

  static parseProfilePaymentInstrumentFormActionFromResponse(paymentInstrumentForm) {
    try {
      return paymentInstrumentForm._defaultprofile[0]._paymentmethods[0]._element[0]._paymentinstrumentform[0].self.uri;
    } catch (err) {
      return null;
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { shouldPostToProfile } = this.props;

    if (shouldPostToProfile !== prevProps.shouldPostToProfile) {
      this.initializeState();
    }
  }

  static async fetchPaymentInstrumentForm() {
    let paymentInstrumentFormUnserialized;

    const zoomQuery = '/?zoom=defaultcart:order:paymentmethodinfo:element:paymentinstrumentform,defaultprofile:paymentmethods:element:paymentinstrumentform';

    try {
      await login();

      const paymentInstrumentForm = await cortexFetch(
        zoomQuery,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        },
      );

      paymentInstrumentFormUnserialized = await paymentInstrumentForm.json();

      return paymentInstrumentFormUnserialized;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to fetch PaymentInstrumentForm ', err);
    }

    return paymentInstrumentFormUnserialized;
  }

  parsePaymentInstrumentFormFieldsFromResponse(paymentInstrumentForm) {
    const { shouldPostToProfile } = this.props;
    let zoomResult;

    if (shouldPostToProfile) {
      // eslint-disable-next-line prefer-destructuring
      zoomResult = paymentInstrumentForm._defaultprofile[0]._paymentmethods[0]._element[0]._paymentinstrumentform[0];
    } else {
      // eslint-disable-next-line prefer-destructuring
      zoomResult = paymentInstrumentForm._defaultcart[0]._order[0]._paymentmethodinfo[0]._element[0]._paymentinstrumentform[0];
    }

    const paymentInstrumentFormKeys = Object.keys(zoomResult).filter((key) => {
      if (key === 'self' || key === 'links' || key === 'messages') {
        return false;
      }
      return true;
    });

    return paymentInstrumentFormKeys.reduce((acc, cKey) => ({
      ...acc,
      [cKey]: zoomResult[cKey],
    }), {});
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

  areCreditCardFieldsValid() {
    const {
      cardHolderName, cardNumber, securityCode,
    } = this.state;
    const holderName = cardHolderName.split(' ');

    if (!cardHolderName || !cardNumber || !securityCode || !(holderName[0] && holderName[1])) {
      return false;
    }

    return true;
  }

  static generateToken() {
    /*
    Function that will tokenize credit card information.
    Function returns random string as implementor will replace this function and have their own way of tokenizing.
    */
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   *  NOTE:
   *  This function makes a post request to the paymentinstrumentform resource in either the profile or orders resource depending on logged in status
   *  and if the checkbox to `save to profile` is checked.  In customer implementation this portion will need to be rewritten to suit specific needs.
   */
  async makeSubmitPaymentRequest() {
    const {
      fetchData,
      onCloseModal,
      shouldPostToProfile,
    } = this.props;
    const {
      paymentInstrumentFormFieldsToFill,
      submitPaymentFormOrderUri,
      submitPaymentFormProfileUri,
      saveToProfile,
    } = this.state;

    const formFieldsFilled = this.fillPaymentInstrumentFormFields(paymentInstrumentFormFieldsToFill);

    try {
      let submitPaymentFormUri;

      if (shouldPostToProfile || saveToProfile) {
        submitPaymentFormUri = submitPaymentFormProfileUri;
      } else {
        submitPaymentFormUri = submitPaymentFormOrderUri;
      }

      const addPaymentResponse = await cortexFetch(submitPaymentFormUri,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify(formFieldsFilled),
        });

      this.setState({
        showLoader: false,
      });

      if (addPaymentResponse.status === 400) {
        this.setState({ failedSubmit: true });
      } else if (addPaymentResponse.status === 201 || addPaymentResponse.status === 200 || addPaymentResponse.status === 204) {
        this.setState({ failedSubmit: false }, () => {
          fetchData();
          onCloseModal();
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  submitPayment(event) {
    event.preventDefault();

    if (this.areCreditCardFieldsValid()) {
      this.setState({ showLoader: true, failedSubmit: false });
      this.makeSubmitPaymentRequest();
    } else {
      this.setState({ failedSubmit: true });
    }
  }

  fillPaymentInstrumentFormFields(paymentInstrumentFormFieldsToFill) {
    const keys = Object.keys(paymentInstrumentFormFieldsToFill);
    const formFieldsToFill = paymentInstrumentFormFieldsToFill;

    for (let i = 0; i < keys.length; i++) {
      const cKey = keys[i];

      if (typeof paymentInstrumentFormFieldsToFill[cKey] === 'string') {
        formFieldsToFill[cKey] = PaymentFormMain.generateToken();
      } else {
        formFieldsToFill[cKey] = this.fillPaymentInstrumentFormFields(formFieldsToFill[cKey]);
      }
    }

    return paymentInstrumentFormFieldsToFill;
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
      cardType, cardHolderName, cardNumber, expiryMonth, expiryYear, securityCode, saveToProfile, failedSubmit, showLoader, showSaveToProfile,
    } = this.state;

    return (
      <div className="payment-method-container container">
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

          { showSaveToProfile
            ? (
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
            )
            : null }

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
