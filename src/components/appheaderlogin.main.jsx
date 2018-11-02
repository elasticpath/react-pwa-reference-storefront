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
import { login, logout } from '../utils/AuthService';

import './appheaderlogin.main.less';

const Config = require('Config');

class AppHeaderLoginMain extends React.Component {
  static isLoggedIn() {
    return (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    isMobileView: PropTypes.bool,
  }

  static defaultProps = {
    isMobileView: false,
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
    const { isMobileView } = this.props;
    if (AppHeaderLoginMain.isLoggedIn()) {
      return (
        <div className={`app-login-component ${isMobileView ? 'mobile-view' : ''}`}>
          <div className="auth-container dropdown">
            <button className="dropdown-toggle btn-auth-menu" type="button" id={`${isMobileView ? 'mobile_' : ''}header_navbar_loggedIn_button`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {(isMobileView)
                ? (
                  intl.get('account-logged-in')
                ) : (
                  <span className="icon" />
                )}
            </button>
            <div data-region="authMainRegion" className="auth-nav-container dropdown-menu dropdown-menu-right" aria-label="header_navbar_login_button ">
              <ul data-el-container="global.profileMenu" className="auth-profile-menu-list">
                <li className="dropdown-header">
                  {localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserName`)}
                </li>
                <li className="dropdown-item">
                  <Link to="/profile" className="profile-link">
                    <div data-toggle="collapse" data-target=".collapsable-container">
                      <span id="header_navbar_login_menu_profile_link">
                        {intl.get('profile')}
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/wishlists" className="wishlist-link">
                    <div data-toggle="collapse" data-target=".collapsable-container">
                      <span id="header_navbar_login_menu_wishlist_link">
                        {intl.get('wishlists')}
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <button className="logout-link" type="button" data-el-label="auth.logout" onClick={() => this.logoutRegisteredUser()}>
                    <span className="icon" />
                    {intl.get('logout')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`app-login-component ${isMobileView ? 'mobile-view' : ''}`}>
        <button className="login-btn" id={`${isMobileView ? 'mobile_' : ''}header_navbar_loggedIn_button`} type="button" data-toggle="modal" data-target="#login-modal">
          {(isMobileView)
            ? (
              intl.get('account-login')
            ) : (
              intl.get('login')
            )}
        </button>
        <div data-region="authMainRegion" className="auth-nav-container" />
      </div>
    );
  }
}

export default withRouter(AppHeaderLoginMain);
