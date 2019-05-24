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
import PropTypes from 'prop-types';
import AppHeaderSearchMain from './appheadersearch.main';
import AppHeaderLoginMain from './appheaderlogin.main';
import AppHeaderLocaleMain from './appheaderlocale.main';
import AppHeaderNavigationMain from './appheadernavigation.main';
import AppHeaderTop from './appheadertop.main';
import BulkOrderMain from './bulkorder.main';
import headerLogo from '../images/site-images/Company-Logo-v2.png';
import { cortexFetch } from '../utils/Cortex';
import { login } from '../utils/AuthService';

import './appheader.main.less';
import { getConfig } from '../utils/ConfigProvider';

let Config = {};
let intl = { get: str => str };

const headerLogoFileName = 'Company-Logo-v2.png';

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultcart',
  'defaultcart:additemstocartform',
];

class AppHeaderMain extends React.Component {
  static goBack() {
    const { onGoBack } = this.props;
    onGoBack();
  }

  static propTypes = {
    onSearchPage: PropTypes.func,
    redirectToMainPage: PropTypes.func,
    handlePathName: PropTypes.func,
    handleResetPassword: PropTypes.func,
    onCurrencyChange: PropTypes.func,
    onLocaleChange: PropTypes.func,
    onContinueCart: PropTypes.func,
    onGoBack: PropTypes.func,
    checkedLocation: PropTypes.bool,
    isInStandaloneMode: PropTypes.bool,
    locationSearchData: PropTypes.string,
  }

  static defaultProps = {
    checkedLocation: false,
    isInStandaloneMode: false,
    locationSearchData: undefined,
    onSearchPage: () => {},
    redirectToMainPage: () => {},
    handlePathName: () => {},
    handleResetPassword: () => {},
    onLocaleChange: () => {},
    onCurrencyChange: () => {},
    onContinueCart: () => {},
    onGoBack: () => {},
  }

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      cartData: undefined,
      isLoading: false,
      isOffline: false,
      isSearchFocused: false,
      isBulkModalOpened: false,
    };

    this.handleBulkModalClose = this.handleBulkModalClose.bind(this);
    this.handleSearchPage = this.handleSearchPage.bind(this);
    this.handleMainPage = this.handleMainPage.bind(this);
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
          if (res && res._defaultcart) {
            this.setState({
              cartData: res._defaultcart[0],
              isLoading: false,
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  openModal() {
    const { isBulkModalOpened } = this.state;
    this.setState({
      isBulkModalOpened: !isBulkModalOpened,
    });
  }

  handleBulkModalClose() {
    this.setState({
      isBulkModalOpened: false,
    });
  }

  handleSearchPage(keywords) {
    const { onSearchPage } = this.props;
    onSearchPage(keywords);
  }

  handleMainPage(keywords) {
    const { redirectToMainPage } = this.props;
    redirectToMainPage(keywords);
  }

  handlePathName() {
    const { handlePathName } = this.props;
    handlePathName();
  }

  render() {
    const {
      isOffline, cartData, isLoading, isSearchFocused, isBulkModalOpened,
    } = this.state;
    const {
      checkedLocation, handleResetPassword, onCurrencyChange, onLocaleChange, onContinueCart, locationSearchData, isInStandaloneMode,
    } = this.props;
    const availability = Boolean(cartData);
    return [
      <header key="app-header" className="app-header">
        <AppHeaderTop onCurrencyChange={onCurrencyChange} onLocaleChange={onLocaleChange} />

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
              <AppHeaderNavigationMain isOfflineCheck={this.handleIsOffline} isOffline={isOffline} isMobileView={false} onFetchNavigationError={this.handleMainPage} checkedLocation={checkedLocation} />
            </div>
          </div>

          <div className="icons-header-container">
            <div className="search-container">
              <AppHeaderSearchMain isMobileView={false} onSearchPage={keywords => this.handleSearchPage(keywords)} />
            </div>
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

            {(!Config.b2b.enable || (Config.b2b.enable && availability)) && (
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
            {(Config.b2b.enable && availability) && (cartData && cartData._additemstocartform) && (
              <div className="bulk-container">
                <button type="button" className="bulk-button" onClick={() => { this.openModal(); }} />
              </div>
            )}
          </div>

          <div className="login-container">
            <AppHeaderLoginMain isMobileView={false} permission={availability} onLogout={this.handleMainPage} onLogin={this.handleMainPage} onResetPassword={handleResetPassword} onContinueCart={onContinueCart} locationSearchData={locationSearchData} />
          </div>

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
          <BulkOrderMain isBulkModalOpened={isBulkModalOpened} handleClose={this.handleBulkModalClose} cartData={cartData} />
        </div>

        <div className="collapsable-container collapse collapsed">
          <div className="search-container">
            <AppHeaderSearchMain isMobileView isFocused={isSearchFocused} onSearchPage={keywords => this.handleSearchPage(keywords)} />
          </div>
          <div className="mobile-locale-container">
            <AppHeaderLocaleMain isMobileView onCurrencyChange={onCurrencyChange} onLocaleChange={onLocaleChange} />
          </div>

          {(!Config.b2b.enable || (Config.b2b.enable && availability)) && (
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
            <AppHeaderNavigationMain isOfflineCheck={this.handleIsOffline} isMobileView onFetchNavigationError={this.handleMainPage} checkedLocation={checkedLocation} />
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
