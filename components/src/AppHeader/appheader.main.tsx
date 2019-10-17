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
import AppHeaderSearchMain from '../AppHeaderSearch/appheadersearch.main';
import BloomreachAppHeaderSearchMain from '../Bloomreach/bloomreach.appheadersearch.main';
import AppHeaderLoginMain from '../AppHeaderLogin/appheaderlogin.main';
import AppHeaderLocaleMain from '../AppHeaderLocale/appheaderlocale.main';
import AppHeaderNavigationMain from '../AppHeaderNavigation/appheadernavigation.main';
import AppHeaderTop from '../AppHeaderTop/appheadertop.main';
import BulkOrderMain from '../BulkOrder/bulkorder.main';
import CartPopUp from '../CartPopUp/cartpopup';
import headerLogo from '../../../app/src/images/site-images/Company-Logo-v2.svg';
import { ReactComponent as CartIcon } from '../../../app/src/images/header-icons/cart-icon.svg';
import { ReactComponent as BulkCart } from '../../../app/src/images/header-icons/bulk-cart.svg';

import { cortexFetch } from '../utils/Cortex';
import { login } from '../utils/AuthService';

import './appheader.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

const zoomArray = [
  'defaultcart',
  'defaultcart:additemstocartform',
  'carts',
  'carts:element',
];

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
    cartData: any,
    isLoading: boolean,
    isOffline: boolean,
    isSearchFocused: boolean,
    isBulkModalOpened: boolean,
    multiCartModalOpened: boolean,
    multiCartData: any,
    isDesktop: boolean,
    isLoggedInUser: boolean,
    totalQuantity: number,
    itemsAddedCount: number,
}

class AppHeaderMain extends React.Component<AppHeaderMainProps, AppHeaderMainState> {
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

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      totalQuantity: 0,
      cartData: undefined,
      isLoading: true,
      isOffline: false,
      isSearchFocused: false,
      isBulkModalOpened: false,
      multiCartModalOpened: false,
      multiCartData: undefined,
      isDesktop: false,
      isLoggedInUser: localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED',
      itemsAddedCount: 0,
    };

    this.handleBulkModalClose = this.handleBulkModalClose.bind(this);
    this.handleMultiCartModalOpen = this.handleMultiCartModalOpen.bind(this);
    this.handleMultiCartModalClose = this.handleMultiCartModalClose.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
    this.fetchCartData();
  }

  componentWillReceiveProps() {
    this.fetchCartData();
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
            let quantity;
            if (res._carts) {
              quantity = res._carts[0]._element.reduce((accumulator, currentValue) => accumulator + currentValue['total-quantity'], 0);
              const user = localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserName`) || 'anonymous';
              const quantityKey = `${Config.cortexApi.scope}_cartItemsCount`;
              const stringCartsItemsCount = localStorage.getItem(quantityKey);
              const cartsItemsCount = stringCartsItemsCount && JSON.parse(stringCartsItemsCount);
              const userCartCount = cartsItemsCount && cartsItemsCount[user];

              this.setState({
                totalQuantity: quantity,
                multiCartData: res._carts[0],
                isLoading: false,
                cartData: res._defaultcart[0],
                itemsAddedCount: quantity - userCartCount,
              });

              if (cartsItemsCount && userCartCount < quantity) {
                this.handleMultiCartModalOpen();
              }
              localStorage.setItem(quantityKey, JSON.stringify({ ...cartsItemsCount, [user]: quantity }));
            } else {
              this.setState({
                cartData: res._defaultcart[0],
                totalQuantity: res._defaultcart[0]['total-quantity'],
                isLoading: false,
              });
            }
          } else {
            this.setState({
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

  goBack() {
    const { onGoBack } = this.props;
    onGoBack();
  }

  handleMultiCartModalOpen() {
    this.setState({
      multiCartModalOpened: true,
    });
    setTimeout(() => {
      this.setState({
        multiCartModalOpened: false,
      });
    }, 5000);
  }

  handleMultiCartModalClose() {
    this.setState({
      multiCartModalOpened: false,
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

  render() {
    const {
      isOffline, cartData, isLoading, isSearchFocused, isBulkModalOpened, isDesktop, isLoggedInUser, multiCartModalOpened, multiCartData, totalQuantity, itemsAddedCount,
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
              {Config.bloomreachSearch.enable ? (
                <BloomreachAppHeaderSearchMain isMobileView={false} onSearchPage={onSearchPage} />
              ) : (
                <AppHeaderSearchMain isMobileView={false} onSearchPage={onSearchPage} />
              )}
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
              <div>
                {!multiCartData ? (
                  <div className="cart-link-container">
                    <Link className="cart-link" to={appHeaderLinks.myCart}>
                      <CartIcon className="cart-icon" />
                      {cartData && cartData['total-quantity'] !== 0 && !isLoading && (
                      <span className="cart-link-counter">
                        {cartData['total-quantity']}
                      </span>
                      )}
                      {intl.get('shopping-cart-nav')}
                    </Link>
                  </div>
                ) : (
                  <div className={`cart-link-container multi-cart-dropdown dropdown ${multiCartModalOpened ? 'show' : ''}`}>
                    <Link className={`cart-link ${multiCartModalOpened ? 'modal-arrow' : ''}`} to={appHeaderLinks.myCart}>
                      <CartIcon className="cart-icon" />
                      {intl.get('shopping-cart-nav')}
                    </Link>
                    <div className={`multi-cart-container dropdown-menu dropdown-menu-right ${multiCartModalOpened ? 'show' : ''}`}>
                      <CartPopUp appHeaderLinks={appHeaderLinks} itemsQuantity={itemsAddedCount} handleMultiCartModalClose={this.handleMultiCartModalClose} />
                    </div>
                  </div>
                )}
              </div>
            )}
            {(Config.b2b.enable && availability) && (cartData && cartData._additemstocartform) && (
              <div className="bulk-container">
                <BulkCart className="bulk-button" onClick={() => { this.openModal(); }} />
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
            {Config.bloomreachSearch.enable ? (
              <BloomreachAppHeaderSearchMain isMobileView isFocused={isSearchFocused} onSearchPage={onSearchPage} />
            ) : (
              <AppHeaderSearchMain isMobileView isFocused={isSearchFocused} onSearchPage={onSearchPage} />
            )}
          </div>
          <div className="mobile-locale-container">
            <AppHeaderLocaleMain isMobileView onCurrencyChange={onCurrencyChange} onLocaleChange={onLocaleChange} />
          </div>

          {(!Config.b2b.enable || (Config.b2b.enable && availability)) && (
            <div className="mobile-cart-link-container">
              <Link
                className="cart-link"
                to={appHeaderLinks.myCart}
              >
                <div data-toggle="collapse" data-target=".collapsable-container">
                  {intl.get('shopping-cart-nav')}
                  <div className="cart-link-counter-container">
                    {cartData && totalQuantity !== 0 && !isLoading && !multiCartData && (
                      <span className="cart-link-counter">
                        {totalQuantity}
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
