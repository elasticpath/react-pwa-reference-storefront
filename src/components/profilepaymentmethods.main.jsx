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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

class ProfilePaymentMethodsMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    paymentMethods: PropTypes.objectOf(PropTypes.any).isRequired,
    onChange: PropTypes.func.isRequired,
  }

  newPayment() {
    const { history } = this.props;
    history.push('/newpaymentform', { returnPage: '/profile' });
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
                <button className="btn profile-delete-payment-btn" type="button" onClick={() => { this.handleDelete(paymentElement.self.uri); }}>
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
      paymentMethods,
    } = this.props;
    if (paymentMethods) {
      return (
        <div data-region="paymentMethodsRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('payment-methods')}
            </h2>
            {this.renderPaymentMethods()}
            <button className="btn btn-primary profile-new-address-btn" type="button" onClick={() => { this.newPayment(); }}>
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
