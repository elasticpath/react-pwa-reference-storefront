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
import { login, loginRegistered } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';

const Config = require('Config');

class CheckoutAuthPage extends React.Component {
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
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'PUBLIC') {
      loginRegistered(this.state.username, this.state.password).then((resStatus) => {
        if (resStatus === 401) {
          this.setState({ failedLogin: true });
        }
        if (resStatus === 400) {
          this.setState({ failedLogin: true });
        } else if (resStatus === 200) {
          this.setState({ failedLogin: false }, () => {
            this.props.history.push('/checkout');
          });
        }
      });
    }
  }

  submitEmail(event) {
    event.preventDefault();
    login().then(() => {
      let emailForm;
      fetch(`${Config.cortexApi.path}/?zoom=defaultprofile:emails:emailform`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          emailForm = res._defaultprofile[0]._emails[0]._emailform[0].self.href;
        })
        .then(() => {
          fetch(emailForm, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({ email: this.state.email }),
          })
            .then((res) => {
              if (res.status === 400) {
                this.setState({ badEmail: true });
              } else if (res.status === 201) {
                this.setState({ badEmail: false }, () => {
                  this.props.history.push('/checkout');
                });
              }
            }).catch((error) => {
              console.log(error);
            });
        });
    });
  }

  render() {
    return (
      <div>
        <AppHeaderMain />
        <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
          <div className="container">
            <h3>
Sign In to proceed to checkout
            </h3>
            <div className="checkout-auth-option-list equalize">
              <div data-region="checkoutAutRegisterOptionRegion" style={{ display: 'block' }}>
                <div className="checkout-auth-option-container" style={{ minHeight: '259px' }}>
                  <h3>
Create an account
                  </h3>
                  <p>
Create an account with us to enjoy fast and easy checkout, online address book, purchase history and more!
                  </p>
                  <button className="btn btn-primary checkout-auth-option-register-btn" data-el-label="checkoutAuthOption.register" onClick={() => { this.props.history.push('/registration', { returnPage: '/checkout' }); }}>
                                        Register
                  </button>
                </div>
              </div>
              <div data-region="checkoutAuthLoginOptionRegion" style={{ display: 'block' }}>
                <div className="checkout-auth-option-container" style={{ minHeight: '259px' }}>
                  <h3>
I have an account
                  </h3>
                  <form role="form" onSubmit={this.loginRegisteredUser}>
                    <div className="auth-feedback-container" data-region="authLoginFormFeedbackRegion">
                      {this.state.failedLogin ? ('Your username or password is invalid.') : ('')}
                    </div>

                    <div className="form-group checkout-auth-form-group">
                      <label htmlFor="OAuthUserName" data-el-label="checkoutAuthOption.username" className="control-label">
                        <span className="required-label">
*
                        </span>
                        {' '}
Username:
                      </label>
                      <input className="form-control" id="registration_form_emailUsername" name="OAuthUserName" type="text" autoFocus="autofocus" onChange={this.setUsername} />
                    </div>
                    <div className="form-group checkout-auth-form-group">
                      <label htmlFor="OAuthPassword" data-el-label="checkoutAuthOption.password" className="control-label">
                        <span className="required-label">
*
                        </span>
                        {' '}
Password:
                      </label>
                      <input className="form-control" id="registration_form_password" name="OAuthPassword" type="password" onChange={this.setPassword} />
                    </div>
                    <input id="OAuthScope" name="OAuthScope" list="oAuthScopeList" type="hidden" value="vestri" />
                    <input id="OAuthRole" name="OAuthRole" list="oAuthRoleList" type="hidden" value="REGISTERED" />
                    <button className="btn btn-primary checkout-auth-option-login-btn" data-el-label="checkoutAuthOption.login" type="submit">
Login and continue
                    </button>
                  </form>
                </div>
              </div>
              <div data-region="checkoutAuthAnonymousOptionRegion" style={{ display: 'block' }}>
                <div className="checkout-auth-option-container">
                  <h3>
Continue without an account
                  </h3>
                  <p>
To proceed without setting up an account, please enter a valid email and click on "Continue to checkout"
                    {' '}
                  </p>
                  <form role="form" onSubmit={this.submitEmail}>
                    <div className="anonymous-checkout-feedback-container" data-region="anonymousCheckoutFeedbackRegion">
                      {this.state.badEmail ? ('Your email is invalid/incomplete') : ('')}
                    </div>
                    <div className="form-group checkout-auth-form-group">
                      <label htmlFor="Email" data-el-label="checkoutAuthOption.email" className="control-label">
                        <span className="required-label">
*
                        </span>
                        {' '}
Email:
                      </label>
                      <input id="Email" name="Email" className="form-control" type="email" onChange={this.setEmail} />
                    </div>
                    <button className="btn btn-primary checkout-auth-option-anonymous-checkout-btn" data-el-label="checkoutAuthOption.anonymousCheckout" type="submit">
Continue to checkout
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
