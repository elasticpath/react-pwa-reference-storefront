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
import intl from 'react-intl-universal';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import {
  login, loginRegistered, registerUser, getRegistrationForm,
} from '../utils/AuthService';
import './registrationform.main.less';

let Config: IEpConfig | any = {};

interface RegistrationFormMainProps {
  /** handle register success */
  onRegisterSuccess?: (...args: any[]) => any
}

interface RegistrationFormMainState {
  firstname: any | string,
  lastname: any | string,
  username: any | string,
  password: any | string,
  passwordConfirm: any | string,
  failedRegistration: boolean,
  registrationErrors: string,
  isLoading: boolean,
}

class RegistrationFormMain extends Component<RegistrationFormMainProps, RegistrationFormMainState> {
  static defaultProps = {
    onRegisterSuccess: () => {},
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      failedRegistration: false,
      registrationErrors: '',
      passwordConfirm: '',
      isLoading: false,
    };

    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.registerNewUser = this.registerNewUser.bind(this);
    this.setPasswordConfirmation = this.setPasswordConfirmation.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  componentDidMount() {
    login().then(() => {
      getRegistrationForm();
    });
  }

  setFirstName(event) {
    this.setState({ firstname: event.target.value });
  }

  setLastName(event) {
    this.setState({ lastname: event.target.value });
  }

  setUsername(event) {
    this.setState({ username: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  setPasswordConfirmation(event) {
    this.setState({ passwordConfirm: event.target.value });
  }

  registerNewUser() {
    const {
      lastname, firstname, username, password, passwordConfirm,
    } = this.state;
    if (password !== passwordConfirm) {
      this.setState({
        registrationErrors: `- ${intl.get('password-confirm-error')}`,
        failedRegistration: true,
      });
      return;
    }
    this.setState({
      registrationErrors: '',
      failedRegistration: false,
    });

    this.setState({ isLoading: true });
    const { onRegisterSuccess } = this.props;
    login().then(() => {
      registerUser(lastname, firstname, username, password).then((res) => {
        this.setState({ isLoading: false });
        if (res.status === 201) {
          if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'PUBLIC') {
            loginRegistered(username, password).then((resStatus) => {
              if (resStatus === 200) {
                onRegisterSuccess();
              }
            });
          }
        }
      });
    });
  }

  handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
      this.registerNewUser();
    }
  }

  render() {
    const {
      failedRegistration,
      registrationErrors,
      isLoading,
    } = this.state;
    return (
      <div className="registration-container container">
        <h3>
          {intl.get('register-new-account')}
        </h3>

        <div className="feedback-label registration-form-feedback-container feedback-display-linebreak" id="registration_form_feedback_container" data-region="registrationFeedbackMsgRegion">
          {failedRegistration ? (registrationErrors) : ('')}
        </div>

        <div data-region="registrationFormRegion">
          <div className="container">
            <form className="form-horizontal">
              <div className="form-group">
                <label htmlFor="registration_form_firstName_label" data-el-label="registrationForm.firstName" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  {intl.get('first-name')}
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_firstName" name="given-name" className="form-control" type="text" onChange={this.setFirstName} onKeyDown={this.handleEnterKeyPress} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registration_form_lastName_label" data-el-label="registrationForm.lastName" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  {intl.get('last-name')}
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_lastName" name="family-name" className="form-control" type="text" onChange={this.setLastName} onKeyDown={this.handleEnterKeyPress} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registration_form_emailUsername_label" data-el-label="registrationForm.emailUsername" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  {intl.get('email-slash-username')}
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_emailUsername" name="username" className="form-control" type="email" onChange={this.setUsername} onKeyDown={this.handleEnterKeyPress} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registration_form_password_label" data-el-label="registrationForm.password" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  {intl.get('password')}
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_password" name="password" className="form-control" type="password" onChange={this.setPassword} onKeyDown={this.handleEnterKeyPress} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registration_form_passwordConfirm_label" data-el-label="registrationForm.passwordConfirm" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  {intl.get('password-confirmation')}
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_passwordConfirm" name="passwordConfirm" className="form-control" type="password" onChange={this.setPasswordConfirmation} onKeyDown={this.handleEnterKeyPress} />
                </div>
              </div>
              <div className="form-group register-btn-wrap">
                {
                  (isLoading) ? <div className="miniLoader" /> : ('')
                }
                <input className="ep-btn primary registration-save-btn" id="registration_form_register_button" data-cmd="register" type="button" onClick={this.registerNewUser} value="Submit" />
              </div>
            </form>
          </div>
        </div>

      </div>
    );
  }
}

export default RegistrationFormMain;
