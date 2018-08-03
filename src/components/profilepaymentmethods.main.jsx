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
        console.error(error);
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
