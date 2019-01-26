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
import AppHeaderLocaleMain from './appheaderlocale.main';
import AppHeaderNavigationMain from './appheadernavigation.main';
import AppHeaderTop from './appheadertop.main';
import headerLogo from '../images/site-images/Company-Logo-v1.png';
import cortexFetch from '../utils/Cortex';
import { login } from '../utils/AuthService';

import './appheader.main.less';

const Config = require('Config');

const headerLogoFileName = 'Company-Logo-v1.png';

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultcart',
];

class AppHeaderMain extends React.Component {
  static goBack() {
    window.history.back();
  }

  constructor(props) {
    super(props);
    this.state = {
      cartData: undefined,
      isLoading: false,
      isOffline: false,
      isSearchFocused: false,
    };
  }

  componentDidMount() {
    this.fetchCartData();
  }

  componentWillReceiveProps() {
    this.fetchCartData();
  }

  handleIsOffline = (isOfflineValue) => {
    this.setState({
      isOffline: isOfflineValue,
    });
  }

  handleInputFocus = () => {
    this.setState({
      isSearchFocused: true,
    });
  }

  fetchCartData() {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            cartData: res._defaultcart[0],
            isLoading: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  render() {
    const {
      isOffline, cartData, isLoading, isSearchFocused,
    } = this.state;
    const isInStandaloneMode = window.navigator.standalone;
    const isB2B = localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`);
    return [
      <header key="app-header" className="app-header">
        <AppHeaderTop />

        <div className={`main-container ${isInStandaloneMode ? 'in-standalone' : ''}`}>

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
              <AppHeaderNavigationMain isOfflineCheck={this.handleIsOffline} isOffline={isOffline} isMobileView={false} />
            </div>
          </div>

          {!isB2B && !Config.b2b.enable && (
            <div className="search-container">
              <AppHeaderSearchMain isMobileView={false} />
            </div>
          )}

          <div className="search-toggle-btn-container">
            <button
              className="search-toggle-btn"
              type="button"
              data-toggle="collapse"
              data-target=".collapsable-container"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={this.handleInputFocus}
            >
              <div className="search-icon" />
            </button>
          </div>

          <div className="login-container">
            <AppHeaderLoginMain isMobileView={false} />
          </div>

          {!isB2B && !Config.b2b.enable && (
            <div className="cart-link-container">
              <Link className="cart-link" to="/mybag">
                {cartData && cartData['total-quantity'] !== 0 && !isLoading && (
                  <span className="cart-link-counter">
                    {cartData['total-quantity']}
                  </span>
                )}
                {intl.get('shopping-bag-nav')}
              </Link>
            </div>
          )}

          <div className="toggle-btn-container">
            {(isInStandaloneMode) ? (
              <button className="back-btn" aria-label="back button" type="button" onClick={AppHeaderMain.goBack}>
                <span className="icon glyphicon glyphicon-chevron-left" />
              </button>
            ) : ('')
            }
            <button
              className="toggle-btn"
              type="button"
              data-toggle="collapse"
              data-target=".collapsable-container"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="icon glyphicon glyphicon-align-justify" />
            </button>
          </div>

        </div>

        <div className="collapsable-container collapse collapsed">
          {!isB2B && !Config.b2b.enable && (
            <div className="search-container">
              <AppHeaderSearchMain isMobileView isFocused={isSearchFocused} />
            </div>
          )}
          <div className="mobile-locale-container">
            <AppHeaderLocaleMain isMobileView />
          </div>

          {!isB2B && !Config.b2b.enable && (
            <div className="mobile-cart-link-container">
              <Link
                className="cart-link"
                to="/mybag"
              >
                <div data-toggle="collapse" data-target=".collapsable-container">
                  {intl.get('shopping-bag-nav')}
                  <div className="cart-link-counter-container">
                    {cartData && cartData['total-quantity'] !== 0 && !isLoading && (
                      <span className="cart-link-counter">
                        {cartData['total-quantity']}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          <hr className="mobile-navigation-separator" />

          <div className="mobile-navigation-container">
            <AppHeaderNavigationMain isOfflineCheck={this.handleIsOffline} isMobileView />
          </div>
          {/* <hr className="mobile-navigation-separator" />
          <div className="mobile-login-container">
            <AppHeaderLoginMain isMobileView />
          </div> */}
        </div>

        {(isOffline) ? (
          <div className="network-offline alert alert-primary fade in">
            <strong className="text-center">
              {intl.get('network-offline')}
            </strong>
          </div>
        ) : ''}
      </header>,
    ];
  }
}

export default AppHeaderMain;
