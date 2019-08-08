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

import React from 'react';
import { Link } from 'react-router-dom';
import * as cortex from '@elasticpath/cortex-client';
import AppHeaderSearchMain from '../AppHeaderSearch/appheadersearch.main';
import AppHeaderLoginMain from '../AppHeaderLogin/appheaderlogin.main';
import AppHeaderLocaleMain from '../AppHeaderLocale/appheaderlocale.main';
import AppHeaderNavigationMain from '../AppHeaderNavigation/appheadernavigation.main';
import AppHeaderTop from '../AppHeaderTop/appheadertop.main';
import BulkOrderMain from '../BulkOrder/bulkorder.main';
import headerLogo from '../images/site-images/Company-Logo-v2.svg';
import { ClientContext } from '../ClientContext';

import './appheader.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

const headerLogoFileName = 'Company-Logo-v2.svg';
interface AppHeaderMainProps {
  onSearchPage: (...args: any[]) => any,
    redirectToMainPage: (...args: any[]) => any,
    handleResetPassword: (...args: any[]) => any,
    onCurrencyChange: (...args: any[]) => any,
    onLocaleChange: (...args: any[]) => any,
    onContinueCart: (...args: any[]) => any,
    onGoBack: (...args: any[]) => any,
    checkedLocation: boolean,
    isInStandaloneMode: boolean,
    locationSearchData: string,
    appHeaderLinks: {
        [key: string]: any
    },
    appHeaderLoginLinks: {
        [key: string]: any
    },
    appHeaderNavigationLinks: {
        [key: string]: any
    },
    appHeaderTopLinks: {
        [key: string]: any
    },
    appModalLoginLinks: {
        [key: string]: any
    },
}

interface AppHeaderMainState {
    cartData: cortex.Cart,
    isLoading: boolean,
    isOffline: boolean,
    isSearchFocused: boolean,
    isBulkModalOpened: boolean,
    isDesktop: boolean,
    isLoggedInUser: boolean,
}
// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultcart',
  'defaultcart:additemstocartform',
];

class AppHeaderMain extends React.Component<AppHeaderMainProps, AppHeaderMainState> {
  static contextType = ClientContext;

  static defaultProps = {
    checkedLocation: false,
    isInStandaloneMode: false,
    locationSearchData: undefined,
    onSearchPage: () => {},
    redirectToMainPage: () => {},
    handleResetPassword: () => {},
    onLocaleChange: () => {},
    onCurrencyChange: () => {},
    onContinueCart: () => {},
    onGoBack: () => {},
    appHeaderLinks: {},
    appHeaderLoginLinks: {},
    appHeaderNavigationLinks: {},
    appHeaderTopLinks: {},
    appModalLoginLinks: {},
  };

  client: cortex.IClient;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      cartData: undefined,
      isLoading: true,
      isOffline: false,
      isSearchFocused: false,
      isBulkModalOpened: false,
      isDesktop: false,
      isLoggedInUser: localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED',
    };

    this.handleBulkModalClose = this.handleBulkModalClose.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  async componentDidMount() {
    this.client = this.context;
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
    await this.fetchCartData();
  }

  async componentWillReceiveProps() {
    await this.fetchCartData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  handleIsOffline = (isOfflineValue) => {
    this.setState({
      isOffline: isOfflineValue,
    });
  };

  handleInputFocus = () => {
    this.setState({
      isSearchFocused: true,
    });
  };

  updatePredicate() {
    this.setState({
      isDesktop: window.innerWidth > 1092,
    });
  }

  async fetchCartData() {
    const root = await this.client.root().fetch({
      defaultcart: {
        additemstocartform: {},
      },
    });

    this.setState({
      cartData: root.defaultcart,
      isLoading: false,
    });
  }

  goBack() {
    const { onGoBack } = this.props;
    onGoBack();
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

  render() {
    const {
      isOffline, cartData, isLoading, isSearchFocused, isBulkModalOpened, isDesktop, isLoggedInUser,
    } = this.state;
    const {
      checkedLocation,
      handleResetPassword,
      onCurrencyChange,
      onLocaleChange,
      onContinueCart,
      locationSearchData,
      isInStandaloneMode,
      onSearchPage,
      redirectToMainPage,
      appHeaderLinks,
      appHeaderLoginLinks,
      appHeaderNavigationLinks,
      appHeaderTopLinks,
      appModalLoginLinks,
    } = this.props;
    const availability = Boolean(cartData);
    return [
      <header key="app-header" className="app-header">
        <AppHeaderTop onCurrencyChange={onCurrencyChange} onLocaleChange={onLocaleChange} appHeaderTopLinks={appHeaderTopLinks} />

        <div className={`main-container ${isInStandaloneMode ? 'in-standalone' : ''}`}>

          <div className="logo-container">
            <Link to={appHeaderLinks.mainPage} className="logo">
              <img
                className="logo-image"
                alt="Header logo"
                src={Config.siteImagesUrl.replace('%fileName%', headerLogoFileName)}
                onError={(e) => {
                  const element: any = e.target;
                  element.src = headerLogo;
                }}
              />
            </Link>
          </div>

          <div className="central-container">
            <div className="horizontal-menu">
              {isDesktop && (!isOffline && !isLoading) ? (
                <AppHeaderNavigationMain
                  isOfflineCheck={this.handleIsOffline}
                  isOffline={isOffline}
                  isMobileView={false}
                  onFetchNavigationError={redirectToMainPage}
                  checkedLocation={checkedLocation}
                  appHeaderNavigationLinks={appHeaderNavigationLinks}
                />
              ) : ('')}
            </div>
          </div>

          <div className="icons-header-container">
            <div className="search-container">
              <AppHeaderSearchMain isMobileView={false} onSearchPage={onSearchPage} />
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
                <Link className="cart-link" to={appHeaderLinks.myBag}>
                  {cartData && cartData.totalQuantity !== 0 && !isLoading && (
                    <span className="cart-link-counter">
                      {cartData.totalQuantity}
                    </span>
                  )}
                  {intl.get('shopping-bag-nav')}
                </Link>
              </div>
            )}
            {(Config.b2b.enable && availability) && (cartData && cartData.additemstocartform) && (
              <div className="bulk-container">
                <button type="button" className="bulk-button" onClick={() => { this.openModal(); }} />
              </div>
            )}
          </div>

          <div className="login-container">
            <AppHeaderLoginMain
              isMobileView={false}
              permission={availability}
              onLogout={redirectToMainPage}
              onLogin={redirectToMainPage}
              onResetPassword={handleResetPassword}
              onContinueCart={onContinueCart}
              locationSearchData={locationSearchData}
              appHeaderLoginLinks={appHeaderLoginLinks}
              appModalLoginLinks={appModalLoginLinks}
              isLoggedIn={isLoggedInUser}
            />
          </div>

          <div className="toggle-btn-container">
            {(isInStandaloneMode) ? (
              <button className="back-btn" aria-label="back button" type="button" onClick={this.goBack}>
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
            <AppHeaderSearchMain isMobileView isFocused={isSearchFocused} onSearchPage={onSearchPage} />
          </div>
          <div className="mobile-locale-container">
            <AppHeaderLocaleMain isMobileView onCurrencyChange={onCurrencyChange} onLocaleChange={onLocaleChange} />
          </div>

          {(!Config.b2b.enable || (Config.b2b.enable && availability)) && (
            <div className="mobile-cart-link-container">
              <Link
                className="cart-link"
                to={appHeaderLinks.myBag}
              >
                <div data-toggle="collapse" data-target=".collapsable-container">
                  {intl.get('shopping-bag-nav')}
                  <div className="cart-link-counter-container">
                    {cartData && cartData.totalQuantity !== 0 && !isLoading && (
                      <span className="cart-link-counter">
                        {cartData.totalQuantity}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          <hr className="mobile-navigation-separator" />

          <div className="mobile-navigation-container">
            {!isDesktop && (!isOffline && !isLoading) ? (
              <AppHeaderNavigationMain
                isOfflineCheck={this.handleIsOffline}
                isMobileView
                onFetchNavigationError={redirectToMainPage}
                checkedLocation={checkedLocation}
                appHeaderNavigationLinks={appHeaderNavigationLinks}
              />
            ) : ('')}
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
