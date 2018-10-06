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
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import AppHeaderSearchMain from './appheadersearch.main';
import AppHeaderLoginMain from './appheaderlogin.main';
import AppModalLoginMain from './appmodallogin.main';
import AppHeaderLocaleMain from './appheaderlocale.main';
import AppHeaderNavigationMain from './appheadernavigation.main';
import headerLogo from '../images/site-images/Company-Logo-v1.png';

import './appheader.main.less';

const Config = require('Config');

const headerLogoFileName = 'Company-Logo-v1.png';

class AppHeaderMain extends React.Component {
  static goBack() {
    window.history.back();
  }

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
    };
  }

  handleIsOffline = (isOfflineValue) => {
    this.setState({
      isOffline: isOfflineValue,
    });
  }

  render() {
    const { isOffline } = this.state;
    return [
      <header key="app-header" className="app-header">

        <div className="main-container">

          <div className="back-btn-container">
            <button className="back-btn" type="button" onClick={AppHeaderMain.goBack}>
              <span className="icon glyphicon glyphicon-chevron-left" />
            </button>
          </div>

          <div className="logo-container">
            <Link to="/" className="logo">
              <img
                className="logo-image"
                alt="Header logo"
                src={Config.siteImagesUrl.replace('%fileName%', headerLogoFileName)}
                onError={(e) => { e.target.src = headerLogo; }}
              />
            </Link>
          </div>

          <div className="central-container">
            <div className="horizontal-menu">
              <AppHeaderNavigationMain isOfflineCheck={this.handleIsOffline} isMobileView={false} />
            </div>
          </div>

          <div className="search-container">
            <AppHeaderSearchMain isMobileView={false} />
          </div>

          <div className="login-container">
            <AppHeaderLoginMain isMobileView={false} />
          </div>

          <div className="cart-link-container">
            <Link className="cart-link" to="/mycart" />
          </div>

          <div className="locale-container">
            <AppHeaderLocaleMain isMobileView={false} />
          </div>

          <div className="toggle-btn-container">
            <button
              className="toggle-btn"
              type="button"
              data-toggle="collapse"
              data-target=".collapsable-container"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="icon glyphicon glyphicon-list" />
            </button>
          </div>

        </div>

        <div className="collapsable-container collapse collapsed">
          <div className="mobile-search-container">
            <AppHeaderSearchMain isMobileView />
          </div>
          <div className="mobile-locale-container">
            <AppHeaderLocaleMain isMobileView />
          </div>
          <div className="mobile-cart-link-container">
            <Link
              className="cart-link"
              to="/mycart"
              data-toggle="collapse"
              data-target=".collapsable-container"
            >
              {intl.get('shopping-bag-nav')}
            </Link>
          </div>
          <div className="mobile-navigation-container">
            <AppHeaderNavigationMain isOfflineCheck={this.handleIsOffline} isMobileView />
          </div>
          <div className="mobile-login-container">
            <AppHeaderLoginMain isMobileView />
          </div>
        </div>

        {(isOffline) ? (
          <div className="alert alert-primary fade in alert-dismissible">
            <strong className="text-center">
              {intl.get('network-offline')}
            </strong>
          </div>
        ) : ''}
      </header>,
      <AppModalLoginMain key="app-modal-login-main" />,
    ];
  }
}

export default AppHeaderMain;
