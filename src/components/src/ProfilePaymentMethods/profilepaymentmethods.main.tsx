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
import Modal from 'react-responsive-modal';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import PaymentFormMain from '../PaymentForm/paymentform.main';

import './profilepaymentmethods.main.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface ProfilePaymentMethodsMainProps {
  /** payment methods */
  paymentMethods: {
      [key: string]: any
  },
  /** handle payment method change */
  onChange: (...args: any[]) => any,
  /** disable add a new payment method */
  disableAddPayment?: boolean,

  paymentInstruments?: {
    [key: string]: any,
  }
}
interface ProfilePaymentMethodsMainState {
    openNewPaymentModal: boolean
  paymentInstrumentsAvailable?: boolean;
}
class ProfilePaymentMethodsMain extends Component<ProfilePaymentMethodsMainProps, ProfilePaymentMethodsMainState> {
  constructor(props) {
    super(props);
    this.state = {
      openNewPaymentModal: false,
      paymentInstrumentsAvailable: undefined,
    };
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.handleCloseNewPaymentModal = this.handleCloseNewPaymentModal.bind(this);
  }

  componentDidMount() {
    login().then(() => {
      cortexFetch('/?zoom=defaultcart:order:paymentinstrumentselector', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(r => r.json())
        .then((res) => {
          this.setState({
            paymentInstrumentsAvailable: !!(
              res._defaultcart
              && res._defaultcart[0]
              && res._defaultcart[0]._order
              && res._defaultcart[0]._order[0]
              && res._defaultcart[0]._order[0]._paymentinstrumentselector
              && res._defaultcart[0]._order[0]._paymentinstrumentselector[0]
            ),
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleDelete(link) {
    login().then(() => {
      cortexFetch(link, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        const { onChange } = this.props;
        onChange();
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  handleCloseNewPaymentModal() {
    this.setState({ openNewPaymentModal: false });
  }

  newPayment() {
    this.setState({ openNewPaymentModal: true });
  }

  renderPaymentMethods() {
    const { paymentInstrumentsAvailable } = this.state;
    const { paymentMethods, paymentInstruments } = this.props;
    const paymentMethodElems = (paymentMethods && paymentMethods._element) ? paymentMethods._element : [];
    const paymentInstrumentsElems = (paymentInstruments && paymentInstruments._element) ? paymentInstruments._element : [];

    const paymentListElems = paymentInstrumentsAvailable ? paymentInstrumentsElems : paymentMethodElems;

    return paymentListElems.length > 0
      ? (
        paymentListElems.map(paymentElement => (
          <ul key={`profile_payment_${Math.random().toString(36).substr(2, 9)}`} className="profile-payment-methods-listing">
            <li className="profile-payment-method-container">
              <div data-region="paymentMethodComponentRegion" className="profile-payment-method-label-container" style={{ display: 'block' }}>
                <span data-el-value="payment.token" className="payment-method-container">
                  {paymentInstrumentsAvailable ? paymentElement.name : paymentElement['display-name']}
                </span>
              </div>
              <button className="ep-btn small profile-delete-payment-btn" type="button" onClick={() => { this.handleDelete(paymentElement.self.uri); }}>
                {intl.get('delete')}
              </button>
            </li>
          </ul>
        ))
      )
      : (
        <div>
          <p>
            {intl.get('no-saved-payment-method-message')}
          </p>
        </div>
      );
  }

  render() {
    const { paymentInstrumentsAvailable, openNewPaymentModal } = this.state;
    const { paymentMethods, onChange, disableAddPayment } = this.props;

    if (paymentInstrumentsAvailable !== undefined && paymentMethods) {
      return (
        <div className="paymentMethodsRegions" data-region="paymentMethodsRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('payment-methods')}
            </h2>
            {this.renderPaymentMethods()}
            <button className="ep-btn primary wide new-payment-btn" type="button" disabled={disableAddPayment} onClick={() => { this.newPayment(); }}>
              {intl.get('add-new-payment-method')}
            </button>
            <Modal open={openNewPaymentModal} onClose={this.handleCloseNewPaymentModal}>
              <div className="modal-lg new-payment-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2 className="modal-title">
                      {intl.get('new-payment-method')}
                    </h2>
                  </div>
                  <div className="modal-body">
                    <PaymentFormMain
                      defaultPostSelection
                      onCloseModal={this.handleCloseNewPaymentModal}
                      fetchData={onChange}
                    />
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProfilePaymentMethodsMain;
