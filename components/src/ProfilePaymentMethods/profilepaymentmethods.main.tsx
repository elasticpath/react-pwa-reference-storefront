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
import Modal from 'react-responsive-modal';
import { PaymentFormMain } from '@elasticpath/store-components';
import { withRouter } from 'react-router';
import * as cortex from '@elasticpath/cortex-client';
import { ClientContext } from '../ClientContext';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './profilepaymentmethods.main.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface ProfilePaymentMethodsMainProps {
  paymentMethods: {
      [key: string]: any
  },
  onChange: (...args: any[]) => any,
}
interface ProfilePaymentMethodsMainState {
    openNewPaymentModal: boolean
}
class ProfilePaymentMethodsMain extends React.Component<ProfilePaymentMethodsMainProps, ProfilePaymentMethodsMainState> {
  static contextType = ClientContext;

  client: cortex.IClient;

  constructor(props) {
    super(props);
    this.state = {
      openNewPaymentModal: false,
    };
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.handleCloseNewPaymentModal = this.handleCloseNewPaymentModal.bind(this);
  }

  async componentDidMount() {
    this.client = this.context;
  }

  async handleDelete(link) {
    const { onChange } = this.props;

    await this.client.paymentmethod(link).delete();
    onChange();
  }

  handleCloseNewPaymentModal() {
    this.setState({ openNewPaymentModal: false });
  }

  newPayment() {
    this.setState({ openNewPaymentModal: true });
  }

  renderPaymentMethods() {
    const { paymentMethods } = this.props;
    if (paymentMethods.elements) {
      return (
        paymentMethods.elements.map((paymentElement) => {
          const { displayName } = paymentElement;
          return (
            <ul key={`profile_payment_${Math.random().toString(36).substr(2, 9)}`} className="profile-payment-methods-listing">
              <li className="profile-payment-method-container">
                <div data-region="paymentMethodComponentRegion" className="profile-payment-method-label-container" style={{ display: 'block' }}>
                  <span data-el-value="payment.token" className="payment-method-container">
                    {displayName}
                  </span>
                </div>
                <button className="ep-btn small profile-delete-payment-btn" type="button" onClick={() => { this.handleDelete(paymentElement.uri); }}>
                  {intl.get('delete')}
                </button>
              </li>
            </ul>
          );
        })
      );
    }
    return (
      <div>
        <p>
          {intl.get('no-payment-methods-message')}
        </p>
      </div>
    );
  }

  render() {
    const { openNewPaymentModal } = this.state;
    const {
      paymentMethods, onChange,
    } = this.props;
    const isDisabled = !paymentMethods.paymenttokenform;
    if (paymentMethods) {
      return (
        <div className="paymentMethodsRegions" data-region="paymentMethodsRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('payment-methods')}
            </h2>
            {this.renderPaymentMethods()}
            <button className="ep-btn primary wide new-payment-btn" type="button" disabled={isDisabled} onClick={() => { this.newPayment(); }}>
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
                    <PaymentFormMain onCloseModal={this.handleCloseNewPaymentModal} fetchData={onChange} />
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

export default withRouter(ProfilePaymentMethodsMain);
