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
import intl from 'react-intl-universal';
import { RouteComponentProps } from 'react-router-dom';
import { login, loginRegistered } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import Config from '../ep.config.json';

import './CheckoutAuthPage.less';

interface CheckoutAuthPageState{
    username: string,
    password: string,
    email: string,
    failedLogin: boolean,
    badEmail: boolean,
}

class CheckoutAuthPage extends React.Component<RouteComponentProps, CheckoutAuthPageState> {
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
            window.location.reload();
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
        <div className="app-main" data-region="appMain">
          <div className="container">
            <h3 className="view-title">
              {intl.get('sign-in-to-proceed')}
            </h3>
            <div className="checkout-auth-option-list equalize">
              <div className="checkoutAutRegisterOptionRegion" data-region="checkoutAutRegisterOptionRegion">
                <div className="checkout-auth-option-container">
                  <h2>
                    {intl.get('create-an-account')}
                  </h2>
                  <p>
                    {intl.get('create-an-account-message')}
                  </p>
                  <button className="ep-btn primary wide checkout-auth-option-register-btn" type="button" onClick={() => { history.push('/registration', { returnPage: '/checkout' }); }}>
                    {intl.get('register')}
                  </button>
                </div>
              </div>
              <div className="checkoutAuthLoginOptionRegion" data-region="checkoutAuthLoginOptionRegion">
                <div className="checkout-auth-option-container">
                  <h2>
                    {intl.get('i-have-an-account')}
                  </h2>
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
                      <input className="form-control" id="registration_form_emailUsername" name="OAuthUserName" type="email" onChange={this.setUsername} />
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
                    <input id="OAuthScope" name="OAuthScope" list="oAuthScopeList" type="hidden" value="BelleVie" />
                    <input id="OAuthRole" name="OAuthRole" list="oAuthRoleList" type="hidden" value="REGISTERED" />
                    <button className="ep-btn primary wide checkout-auth-option-login-btn" data-el-label="checkoutAuthOption.login" type="submit">
                      {intl.get('login-and-continue')}
                    </button>
                  </form>
                </div>
              </div>
              <div className="checkoutAuthAnonymousOptionRegion" data-region="checkoutAuthAnonymousOptionRegion">
                <div className="checkout-auth-option-container">
                  <h2>
                    {intl.get('continue-without-account')}
                  </h2>
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
                    <button className="ep-btn primary wide checkout-auth-option-anonymous-checkout-btn" data-el-label="checkoutAuthOption.anonymousCheckout" type="submit">
                      {intl.get('continue-to-checkout')}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutAuthPage;
