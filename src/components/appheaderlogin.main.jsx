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
import AppModalLoginMain from './appmodallogin.main';
import AppModalCartSelectMain from './appmodalcartselect.main';
import { logout } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';

import './appheaderlogin.main.less';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex

const zoomArray = [
  'passwordresetform',
];

class AppHeaderLoginMain extends React.Component {
  static isLoggedIn() {
    return (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    isMobileView: PropTypes.bool,
    permission: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isMobileView: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openCartModal: false,
      showForgotPasswordLink: false,
    };
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  componentDidMount() {
    if (Config.b2b.enable && localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`) !== null && localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`) === null) {
      this.handleCartModalOpen();
    }
  }

  logoutRegisteredUser() {
    logout().then(() => {
      const { history } = this.props;
      history.push('/');
      window.location.reload();
    });
  }

  handleModalOpen() {
    this.fetchPasswordResetData();
    this.setState({
      openModal: true,
    });
  }

  handleCartModalOpen() {
    this.setState({
      openCartModal: true,
    });
  }

  handleModalClose() {
    this.setState({
      openModal: false,
      openCartModal: false,
    });
  }

  fetchPasswordResetData() {
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
  }

  render() {
    const {
      isMobileView, permission,
    } = this.props;
    const {
      openModal, openCartModal, showForgotPasswordLink,
    } = this.state;
    let keycloakLoginRedirectUrl = '';
    let keycloakLogoutRedirectUrl = '';
    if (Config.b2b.enable) {
      keycloakLoginRedirectUrl = `${Config.b2b.keycloak.loginRedirectUrl}?client_id=${Config.b2b.keycloak.client_id}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(Config.b2b.keycloak.callbackUrl)}`;
      keycloakLogoutRedirectUrl = `${Config.b2b.keycloak.logoutRedirectUrl}?redirect_uri=${encodeURIComponent(Config.b2b.keycloak.callbackUrl)}`;
    }
    const userName = localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserName`);

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
                {userName !== 'undefined' ? (
                  <li className="dropdown-header">
                    {userName}
                  </li>
                ) : ('')}
                <li className="dropdown-item">
                  <Link to="/profile" className="profile-link">
                    <div>
                      <span id="header_navbar_login_menu_profile_link">
                        {intl.get('my-profile')}
                      </span>
                    </div>
                  </Link>
                </li>
                {permission && (
                  <li className="dropdown-item">
                    <Link to="/wishlists" className="wishlist-link">
                      <div>
                        <span id="header_navbar_login_menu_wishlist_link">
                          {intl.get('wishlists')}
                        </span>
                      </div>
                    </Link>
                  </li>
                )}
                <li className="dropdown-item">
                  {(Config.b2b.enable) ? (
                    <a href={`${keycloakLogoutRedirectUrl}`} className="login-auth-service-btn">
                      <button className="logout-link" type="button" data-el-label="auth.logout" onClick={() => this.logoutRegisteredUser()}>
                        <span className="icon" />
                        {intl.get('logout')}
                      </button>
                    </a>
                  ) : (
                    <button className="logout-link" type="button" data-el-label="auth.logout" onClick={() => this.logoutRegisteredUser()}>
                      <span className="icon" />
                      {intl.get('logout')}
                    </button>
                  )}
                </li>
              </ul>
              {(Config.b2b.enable) ? (
                <div className="dropdown-login-cart">
                  {(localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`)) ? (
                    <ul>
                      <li className="dropdown-item change-carts">
                        {intl.get('using-cart')}
                        <p className="using-cart">
                          {` ${(localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`))}`}
                        </p>
                      </li>
                    </ul>
                  ) : ('')
                  }
                  <ul className="login-cart-list">
                    <li>
                      <button className="dropdown-item" type="button" data-toggle="modal" onClick={() => this.handleCartModalOpen()} data-target="#cart-select-modal">
                        <span className="cart-select-btn">{intl.get('change-carts')}</span>
                      </button>
                      <AppModalCartSelectMain key="app-modal-cart-selection-main" handleModalClose={this.handleModalClose} openModal={openCartModal} />
                    </li>
                  </ul>
                </div>
              ) : ('')}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`app-login-component ${isMobileView ? 'mobile-view' : ''}`}>
        {(Config.b2b.enable) ? (
          <a href={`${keycloakLoginRedirectUrl}`} className="login-auth-service-btn">
            <button className="login-btn" id={`${isMobileView ? 'mobile_' : ''}header_navbar_loggedIn_button`} type="button">
              {(isMobileView)
                ? (
                  intl.get('account-login')
                ) : (
                  intl.get('login')
                )}
            </button>
          </a>
        ) : (
          <button className="login-btn" id={`${isMobileView ? 'mobile_' : ''}header_navbar_loggedIn_button`} type="button" data-toggle="modal" onClick={() => this.handleModalOpen()} data-target="#login-modal">
            {(isMobileView)
              ? (
                intl.get('account-login')
              ) : (
                intl.get('login')
              )}
          </button>
        )}
        <AppModalLoginMain key="app-modal-login-main" handleModalClose={this.handleModalClose} openModal={openModal} showForgotPasswordLink={showForgotPasswordLink} />
        <div data-region="authMainRegion" className="auth-nav-container" />
      </div>
    );
  }
}

export default withRouter(AppHeaderLoginMain);
