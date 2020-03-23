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
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import queryString from 'query-string';
import { loginRegistered, loginRegisteredAuthService } from '../utils/AuthService';
import './appmodallogin.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};

interface AppModalLoginMainProps {
  /** handle modal close */
  handleModalClose: (...args: any[]) => any,
  /** handle open modal */
  openModal: boolean,
  /** handle login */
  onLogin?: (...args: any[]) => any,
  /** handle reset password */
  onResetPassword?: (...args: any[]) => any,
  /** location search data */
  locationSearchData?: string,
  /** location path name */
  locationPathName?: string,
  /** links for app modal login */
  appModalLoginLinks: {
    [key: string]: any
  },
  /** show forgot password link */
  showForgotPasswordLink: boolean,
  /** disable login */
  disableLogin?: boolean,
  /** Open Id Connect Parameters */
  oidcParameters?: {
    [key: string]: any
  },
}
interface AppModalLoginMainState {
    username: string,
    password: string,
    failedLogin: boolean,
    isLoading: boolean,
}
class AppModalLoginMain extends Component<AppModalLoginMainProps, AppModalLoginMainState> {
  static defaultProps = {
    onLogin: () => {},
    onResetPassword: () => {},
    locationSearchData: '',
    locationPathName: '',
    disableLogin: false,
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      username: '',
      password: '',
      failedLogin: false,
      isLoading: false,
    };

    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.loginRegisteredUser = this.loginRegisteredUser.bind(this);
    this.registerNewUser = this.registerNewUser.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  componentWillMount() {
    const {
      locationSearchData, onLogin, oidcParameters, locationPathName,
    } = this.props;
    const url = locationSearchData;

    const params = queryString.parse(url);
    if (params.code && oidcParameters) {
      if (Config.b2b.openId && Config.b2b.openId.enable) {
        localStorage.setItem(`${Config.cortexApi.scope}_openIdcCode`, params.code);
        localStorage.setItem(`${Config.cortexApi.scope}_openIdcSessionState`, params.session_state);
        localStorage.removeItem('OidcSecret');
      } else {
        localStorage.setItem(`${Config.cortexApi.scope}_keycloakCode`, params.code);
        localStorage.setItem(`${Config.cortexApi.scope}_keycloakSessionState`, params.session_state);
      }
      if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) !== 'REGISTERED') {
        loginRegisteredAuthService(params.code, encodeURIComponent(((Config.b2b.openId && Config.b2b.openId.enable) ? `${locationPathName}/loggedin` : Config.b2b.keycloak.callbackUrl)), encodeURIComponent(((Config.b2b.openId && Config.b2b.openId.enable) ? oidcParameters.clientId : Config.b2b.keycloak.client_id))).then((resStatus) => {
          if (resStatus === 401) {
            this.setState({
              failedLogin: true,
              isLoading: false,
            });
          }
          if (resStatus === 400) {
            this.setState({
              failedLogin: true,
              isLoading: false,
            });
          } else if (resStatus === 200) {
            this.setState({ failedLogin: false });
            onLogin();
          }
        });
      }
    }
  }

  setUsername(event) {
    this.setState({ username: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  registerNewUser() {
    const { handleModalClose } = this.props;
    handleModalClose();
  }

  loginRegisteredUser(event) {
    const { username, password } = this.state;
    const { handleModalClose, onLogin, disableLogin } = this.props;
    this.setState({ isLoading: true });
    if (!disableLogin) {
      if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'PUBLIC') {
        loginRegistered(username, password).then((resStatus) => {
          if (resStatus === 401) {
            this.setState({
              failedLogin: true,
              isLoading: false,
            });
          }
          if (resStatus === 400) {
            this.setState({
              failedLogin: true,
              isLoading: false,
            });
          } else if (resStatus === 200) {
            this.setState({ failedLogin: false });
            handleModalClose();
            onLogin();
          }
        });
        event.preventDefault();
      }
    } else {
      this.setState({ isLoading: false });
      event.preventDefault();
    }
  }

  handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
      this.loginRegisteredUser(e);
    }
  }

  resetPassword() {
    const { handleModalClose, onResetPassword } = this.props;
    onResetPassword();
    handleModalClose();
  }

  render() {
    const { failedLogin, isLoading } = this.state;
    const {
      handleModalClose, openModal, appModalLoginLinks, showForgotPasswordLink,
    } = this.props;

    return (
      <Modal open={openModal} onClose={handleModalClose} classNames={{ modal: 'login-modal-content' }}>
        <div id="login-modal">
          <div className="modal-content" id="simplemodal-container">

            <div className="modal-header">
              <h2 className="modal-title">
                {intl.get('login')}
              </h2>
            </div>

            <div className="feedback-label auth-feedback-container" id="login_modal_auth_feedback_container" data-region="authLoginFormFeedbackRegion" data-i18n="">
              {failedLogin ? (intl.get('invalid-username-or-password')) : ('')}
            </div>

            <div className="modal-body">
              <form id="login_modal_form" onSubmit={this.loginRegisteredUser}>
                <div className="form-group">
                  <span>
                    {intl.get('username')}
                    :
                  </span>
                  <input className="form-control" id="login_modal_username_input" type="text" onChange={this.setUsername} onKeyDown={this.handleEnterKeyPress} />
                </div>
                <div className="form-group">
                  <span>
                    {intl.get('password')}
                    :
                  </span>
                  <input className="form-control" id="login_modal_password_input" type="password" onChange={this.setPassword} onKeyDown={this.handleEnterKeyPress} />
                </div>
                <div className="form-group action-row">
                  {
                    (isLoading) ? <div className="miniLoader" /> : ('')
                  }
                  {showForgotPasswordLink && <button type="button" className="label-link" onClick={this.resetPassword}>{intl.get('forgot-password')}</button>}
                  <div className="form-input btn-container">
                    <button className="ep-btn primary btn-auth-login" id="login_modal_login_button" data-cmd="login" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                      {intl.get('login')}
                    </button>
                    <Link to={appModalLoginLinks.registration}>
                      <button className="ep-btn btn-auth-register" id="login_modal_register_button" data-toggle="collapse" data-target=".navbar-collapse" type="button" onClick={this.registerNewUser}>
                        {intl.get('register')}
                      </button>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AppModalLoginMain;
