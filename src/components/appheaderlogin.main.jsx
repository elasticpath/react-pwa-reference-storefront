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

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openCartModal: false,
    };
    this.handleModalClose = this.handleModalClose.bind(this);
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

  handleModalOpen() {
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

  render() {
    const { isMobileView } = this.props;
    const {
      openModal, openCartModal,
    } = this.state;
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
                    <div>
                      <span id="header_navbar_login_menu_profile_link">
                        {intl.get('my-profile')}
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/wishlists" className="wishlist-link">
                    <div>
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
              {(Config.b2bFeatures) ? (
                <div className="dropdown-login-cart">
                  <ul>
                    <li className="dropdown-item change-carts">
                      {intl.get('using-cart')}
                      <p className="using-cart">
                        {` ${localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`)}`}
                      </p>
                    </li>
                  </ul>
                  <ul className="login-cart-list">
                    <li className="dropdown-item">
                      <button className="cart-select-btn" type="button" data-toggle="modal" onClick={() => this.handleCartModalOpen()} data-target="#cart-select-modal">
                        {intl.get('change-carts')}
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
        {(Config.b2bFeatures) ? (
          <button className="login-btn" id={`${isMobileView ? 'mobile_' : ''}header_navbar_loggedIn_button`} type="button" data-toggle="modal" onClick={() => this.handleModalOpen()} data-target="#login-modal">
            {(isMobileView)
              ? (
                intl.get('account-login')
              ) : (
                intl.get('login')
              )}
          </button>
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
        <AppModalLoginMain key="app-modal-login-main" handleModalClose={this.handleModalClose} openModal={openModal} />
        <div data-region="authMainRegion" className="auth-nav-container" />
      </div>
    );
  }
}

export default withRouter(AppHeaderLoginMain);
