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
import { Link, withRouter } from 'react-router-dom';
import { loginRegistered } from '../utils/AuthService';
import './appmodallogin.main.less';

const Config = require('Config');

class AppModalLoginMain extends React.Component {
  static registerNewUser() {
    if (document.getElementById('login_modal_close_button')) {
      document.getElementById('login_modal_close_button').click();
    }
  }

  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      failedLogin: false,
      isLoading: false,
    };
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.loginRegisteredUser = this.loginRegisteredUser.bind(this);
  }

  setUsername(event) {
    this.setState({ username: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  loginRegisteredUser(event) {
    const { username, password } = this.state;
    const { history } = this.props;
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
          document.getElementById('login_modal_close_button').click();
          history.push('/');
        }
      });
      event.preventDefault();
    }
  }

  render() {
    const { failedLogin, isLoading } = this.state;
    return (
      <div className="modal login-modal-content" id="login-modal">
        <div className="modal-dialog">
          <div className="modal-content" id="simplemodal-container">
            <button type="button" id="login_modal_close_button" className="close" data-dismiss="modal">
              &times;
            </button>
            <div className="form-container">
              <div className="panel">
                <h2>
                  {intl.get('login')}
                </h2>
              </div>
              <form id="login_modal_form" onSubmit={this.loginRegisteredUser}>
                <div className="form-group">
                  <input className="form-control" id="login_modal_username_input" placeholder={intl.get('username')} type="text" onChange={this.setUsername} />
                </div>
                <div className="form-group">
                  <input className="form-control" id="login_modal_password_input" placeholder={intl.get('password')} type="password" onChange={this.setPassword} />
                </div>
                <div className="feedback-label auth-feedback-container" id="login_modal_auth_feedback_container" data-region="authLoginFormFeedbackRegion" data-i18n="">
                  {failedLogin ? (intl.get('invalid-username-or-password')) : ('')}
                </div>
                <div className="form-group action-row">
                  {
                    (isLoading) ? <div className="miniLoader" /> : ('')
                  }
                  <div className="form-input btn-container">
                    <button className="ep-btn primary btn-auth-login" id="login_modal_login_button" data-cmd="login" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                      {intl.get('login')}
                    </button>
                    <Link to="/registration">
                      <button className="ep-btn btn-auth-register" id="login_modal_register_button" data-toggle="collapse" data-target=".navbar-collapse" type="button" onClick={AppModalLoginMain.registerNewUser}>
                        {intl.get('register')}
                      </button>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AppModalLoginMain);
