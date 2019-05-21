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
import { withRouter } from 'react-router';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig } from '../utils/ConfigProvider';

import './profilepaymentmethods.main.less';

let Config = {};
let intl = { get: str => str };

class ProfilePaymentMethodsMain extends React.Component {
  static propTypes = {
    paymentMethods: PropTypes.objectOf(PropTypes.any).isRequired,
    onChange: PropTypes.func.isRequired,
    onAddNewPayment: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
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

  renderPaymentMethods() {
    const { paymentMethods } = this.props;
    if (paymentMethods._element) {
      return (
        paymentMethods._element.map((paymentElement) => {
          const displayName = paymentElement['display-name'];
          return (
            <ul key={`profile_payment_${Math.random().toString(36).substr(2, 9)}`} className="profile-payment-methods-listing">
              <li className="profile-payment-method-container">
                <div data-region="paymentMethodComponentRegion" className="profile-payment-method-label-container" style={{ display: 'block' }}>
                  <span data-el-value="payment.token" className="payment-method-container">
                    {displayName}
                  </span>
                </div>
                <button className="ep-btn small profile-delete-payment-btn" type="button" onClick={() => { this.handleDelete(paymentElement.self.uri); }}>
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
    const {
      paymentMethods, onAddNewPayment,
    } = this.props;
    const isDisabled = !paymentMethods._paymenttokenform;
    if (paymentMethods) {
      return (
        <div className="paymentMethodsRegions" data-region="paymentMethodsRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('payment-methods')}
            </h2>
            {this.renderPaymentMethods()}
            <button className="ep-btn primary wide new-payment-btn" type="button" disabled={isDisabled} onClick={onAddNewPayment}>
              {intl.get('add-new-payment-method')}
            </button>
          </div>
        </div>
      );
    }
    return (<div className="loader" />);
  }
}

export default withRouter(ProfilePaymentMethodsMain);
