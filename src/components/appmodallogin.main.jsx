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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import queryString from 'query-string';
import { login, loginRegistered, loginRegisteredAuthService } from '../utils/AuthService';
import './appmodallogin.main.less';
import { cortexFetch } from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex

const zoomArray = [
  'passwordresetform',
];

class AppModalLoginMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    handleModalClose: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      failedLogin: false,
      isLoading: false,
      showForgotPasswordLink: false,
    };
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.loginRegisteredUser = this.loginRegisteredUser.bind(this);
    this.registerNewUser = this.registerNewUser.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentWillMount() {
    const { location, history } = this.props;
    const url = location.search;
    const params = queryString.parse(url);
    if (params.code) {
      localStorage.setItem(`${Config.cortexApi.scope}_keycloakCode`, params.code);
      localStorage.setItem(`${Config.cortexApi.scope}_keycloakSessionState`, params.session_state);
      if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) !== 'REGISTERED') {
        loginRegisteredAuthService(params.code, encodeURIComponent(Config.b2b.keycloak.callbackUrl), encodeURIComponent(Config.b2b.keycloak.client_id)).then((resStatus) => {
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
            history.push('/');
            window.location.reload();
          }
        });
      }
    }
  }

  componentDidMount() {
    this.fetchPasswordResetData();
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

  fetchPasswordResetData() {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          if (res && res._passwordresetform) {
            this.setState({ showForgotPasswordLink: true });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  loginRegisteredUser(event) {
    const { username, password } = this.state;
    const { history, handleModalClose } = this.props;
    this.setState({ isLoading: true });
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
          history.push('/');
        }
      });
      event.preventDefault();
    }
  }

  resetPassword() {
    const { history, handleModalClose } = this.props;
    history.push('/password_reset', { returnPage: '/' });
    handleModalClose();
  }

  render() {
    const { failedLogin, isLoading, showForgotPasswordLink } = this.state;
    const { handleModalClose, openModal } = this.props;

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
                  <input className="form-control" id="login_modal_username_input" type="text" onChange={this.setUsername} />
                </div>
                <div className="form-group">
                  <span>
                    {intl.get('password')}
                    :
                  </span>
                  <input className="form-control" id="login_modal_password_input" type="password" onChange={this.setPassword} />
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
                    <Link to="/registration">
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

export default withRouter(AppModalLoginMain);
