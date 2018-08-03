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
import { Link, withRouter } from 'react-router-dom';
import { login, logout } from '../utils/AuthService';

const Config = require('Config');

class AppHeaderLoginMain extends React.Component {
  static isLoggedIn() {
    return (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

  logoutRegisteredUser() {
    logout().then(() => {
      login().then(() => {
        const { history } = this.props;
        history.push('/');
        window.location.reload();
      });
    });
  }

  render() {
    if (AppHeaderLoginMain.isLoggedIn()) {
      return (
        <li data-region="authMenuItemRegion" className="authMenuItemRegion">
          <div className="auth-container">
            <div className="auth-container dropdown">
              <button className="btn btn-secondary dropdown-toggle global-nav-link global-nav-login btn-auth-menu" type="button" id="header_navbar_loggedIn_button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserName`)}
              </button>
              <div data-region="authMainRegion" className="auth-nav-container dropdown-menu" aria-label="header_navbar_login_button ">
                <ul data-el-container="global.profileMenu" className="auth-profile-menu-list">
                  <li className="dropdown-item">
                    <Link to="/profile">
                      <span className="profile-link" id="header_navbar_login_menu_profile_link">
                        {intl.get('profile')}
                      </span>
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <button className="btn-cmd btn-auth-logout" id="header_navbar_login_menu_logout_button" type="button" data-el-label="auth.logout" onClick={() => this.logoutRegisteredUser()}>
                      <span className="icon" />
                      {intl.get('logout')}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      );
    }

    return (
      <li data-region="authMenuItemRegion" className="authMenuItemRegion">
        <div className="auth-container">
          <div className="auth-container">
            <button className="global-nav-link global-nav-login btn-auth-menu" id="header_navbar_login_button" type="button" data-toggle="modal" data-target="#login-modal">
              {intl.get('login')}
            </button>
            <div data-region="authMainRegion" className="auth-nav-container" />
          </div>
        </div>
      </li>
    );
  }
}

export default withRouter(AppHeaderLoginMain);
