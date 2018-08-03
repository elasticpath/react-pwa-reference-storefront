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
import { login, loginRegistered } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

class CheckoutAuthPage extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      failedLogin: false,
      badEmail: false,
    };
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.loginRegisteredUser = this.loginRegisteredUser.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
  }

  setUsername(event) {
    this.setState({ username: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  setEmail(event) {
    this.setState({ email: event.target.value });
  }

  loginRegisteredUser(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const { history } = this.props;
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'PUBLIC') {
      loginRegistered(username, password).then((resStatus) => {
        if (resStatus === 401) {
          this.setState({ failedLogin: true });
        }
        if (resStatus === 400) {
          this.setState({ failedLogin: true });
        } else if (resStatus === 200) {
          this.setState({ failedLogin: false }, () => {
            history.push('/checkout');
          });
        }
      });
    }
  }

  submitEmail(event) {
    event.preventDefault();
    const { email } = this.state;
    const { history } = this.props;
    login().then(() => {
      let emailForm;
      cortexFetch('/?zoom=defaultprofile:emails:emailform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          emailForm = res._defaultprofile[0]._emails[0]._emailform[0].links.find(link => link.rel === 'createemailaction').uri;
        })
        .then(() => {
          cortexFetch(emailForm, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({ email }),
          })
            .then((res) => {
              if (res.status === 400) {
                this.setState({ badEmail: true });
              } else if (res.status === 201) {
                this.setState({ badEmail: false }, () => {
                  history.push('/checkout');
                });
              }
            }).catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
            });
        });
    });
  }

  render() {
    const { history } = this.props;
    const { failedLogin, badEmail } = this.state;
    return (
      <div>
        <AppHeaderMain />
        <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
          <div className="container">
            <h3>
              {intl.get('sign-in-to-proceed')}
            </h3>
            <div className="checkout-auth-option-list equalize">
              <div data-region="checkoutAutRegisterOptionRegion" style={{ display: 'block' }}>
                <div className="checkout-auth-option-container" style={{ minHeight: '259px' }}>
                  <h3>
                    {intl.get('create-an-account')}
                  </h3>
                  <p>
                    {intl.get('create-an-account-message')}
                  </p>
                  <button className="btn btn-primary checkout-auth-option-register-btn" type="button" onClick={() => { history.push('/registration', { returnPage: '/checkout' }); }}>
                    {intl.get('register')}
                  </button>
                </div>
              </div>
              <div data-region="checkoutAuthLoginOptionRegion" style={{ display: 'block' }}>
                <div className="checkout-auth-option-container" style={{ minHeight: '259px' }}>
                  <h3>
                    {intl.get('i-have-an-account')}
                  </h3>
                  <form onSubmit={this.loginRegisteredUser}>
                    <div className="auth-feedback-container" data-region="authLoginFormFeedbackRegion">
                      {failedLogin ? intl.get('invalid-username-or-password') : ''}
                    </div>

                    <div className="form-group checkout-auth-form-group">
                      <label htmlFor="OAuthUserName" data-el-label="checkoutAuthOption.username" className="control-label">
                        <span className="required-label">
                          *
                        </span>
                        {' '}
                        {intl.get('username')}
                        :
                      </label>
                      <input className="form-control" id="registration_form_emailUsername" name="OAuthUserName" type="text" onChange={this.setUsername} />
                    </div>
                    <div className="form-group checkout-auth-form-group">
                      <label htmlFor="OAuthPassword" data-el-label="checkoutAuthOption.password" className="control-label">
                        <span className="required-label">
                          *
                        </span>
                        {' '}
                        {intl.get('password')}
                        :
                      </label>
                      <input className="form-control" id="registration_form_password" name="OAuthPassword" type="password" onChange={this.setPassword} />
                    </div>
                    <input id="OAuthScope" name="OAuthScope" list="oAuthScopeList" type="hidden" value="vestri" />
                    <input id="OAuthRole" name="OAuthRole" list="oAuthRoleList" type="hidden" value="REGISTERED" />
                    <button className="btn btn-primary checkout-auth-option-login-btn" data-el-label="checkoutAuthOption.login" type="submit">
                      {intl.get('login-and-continue')}
                    </button>
                  </form>
                </div>
              </div>
              <div data-region="checkoutAuthAnonymousOptionRegion" style={{ display: 'block' }}>
                <div className="checkout-auth-option-container">
                  <h3>
                    {intl.get('continue-without-account')}
                  </h3>
                  <p>
                    {intl.get('continue-without-account-message')}
                    {' '}
                  </p>
                  <form onSubmit={this.submitEmail}>
                    <div className="anonymous-checkout-feedback-container" data-region="anonymousCheckoutFeedbackRegion">
                      {badEmail ? (intl.get('bad-email-message')) : ''}
                    </div>
                    <div className="form-group checkout-auth-form-group">
                      <label htmlFor="Email" data-el-label="checkoutAuthOption.email" className="control-label">
                        <span className="required-label">
                          *
                        </span>
                        {' '}
                        {intl.get('email')}
                        :
                      </label>
                      <input id="Email" name="Email" className="form-control" type="email" onChange={this.setEmail} />
                    </div>
                    <button className="btn btn-primary checkout-auth-option-anonymous-checkout-btn" data-el-label="checkoutAuthOption.anonymousCheckout" type="submit">
                      {intl.get('continue-to-checkout')}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AppFooterMain />
      </div>
    );
  }
}

export default CheckoutAuthPage;
