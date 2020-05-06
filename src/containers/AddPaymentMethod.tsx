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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import { cortexFetch } from '../utils/Cortex';
import { login } from '../utils/AuthService';

import * as Config from '../ep.config.json';

interface AddPaymentMethodProps {
  match: any,
  history: any,
}
interface AddPaymentMethodState {
  isLoading: boolean,
  errorMessage: string,
}

class AddPaymentMethod extends React.Component<AddPaymentMethodProps, AddPaymentMethodState> {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      errorMessage: '',
    };
    this.submitPayment = this.submitPayment.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.goToBack = this.goToBack.bind(this);
  }

  componentDidMount() {
    this.submitPayment();
  }

  submitPayment() {
    const data = window.location.search.replace('?', '');
    const paymentData = JSON.parse(`{"${decodeURI(data.replace(/&/g, '","')
      .replace(/=/g, '":"'))}"}`);
    let codeCardType = '';
    let cardType = '';
    let paymentForm;

    if (paymentData.payment_token && paymentData.req_card_type && paymentData.req_bill_to_forename && paymentData.req_bill_to_surname && paymentData.req_card_number) {
      codeCardType = paymentData.req_card_type ? paymentData.req_card_type : '';
      switch (codeCardType) {
        case '001':
          cardType = 'Visa';
          break;
        case '002':
          cardType = 'Mastercard';
          break;
        case '003':
          cardType = 'American Express';
          break;
        default:
      }
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
            paymentForm = paymentFormLink.uri;
            cortexFetch(paymentForm, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
              body: JSON.stringify({
                'display-name': `${paymentData.req_bill_to_forename} ${paymentData.req_bill_to_surname}'s ${cardType} ending in: ${paymentData.req_card_number}`,
                token: paymentData.payment_token,
              }),
            })
              .then(() => {
                this.setState({
                  isLoading: false,
                });
                this.handleClose();
              })
              .catch((error) => {
                this.setState({
                  isLoading: false,
                });
                // eslint-disable-next-line no-console
                console.error(error.message);
              });
          })
          .catch((error) => {
            this.setState({
              isLoading: false,
            });
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    } else {
      const errorMessage = paymentData.message ? paymentData.message.replace(/\+/g, ' ') : '';
      this.setState({
        errorMessage,
        isLoading: false,
      });
    }
  }

  handleClose() {
    const { history } = this.props;
    history.push('/profile');
  }

  goToBack() {
    const { history } = this.props;
    history.push('/profile');
  }

  render() {
    const { isLoading, errorMessage } = this.state;
    return (
      <div>
        {isLoading ? (<div className="loader" />) : ''}
        {errorMessage.length ? (
          <div style={{ margin: '20px' }} className="error-message">
            <div style={{ color: 'red', padding: '20px 0' }}>
              {errorMessage}
            </div>
            <div>
              <button className="ep-btn payment-cancel-btn" data-el-label="paymentForm.cancel" type="button" onClick={() => { this.goToBack(); }}>
                {intl.get('go-back')}
              </button>
              <button className="ep-btn primary new-payment-btn" type="button" onClick={() => { this.goToBack(); }}>
                {intl.get('add-new-payment-method')}
              </button>
            </div>
          </div>
        ) : ''}
      </div>
    );
  }
}

export default AddPaymentMethod;
