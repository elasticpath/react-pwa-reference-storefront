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

import React, { Component, Suspense, lazy } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import AppHeaderSearchMain from '../AppHeaderSearch/appheadersearch.main';
import BloomreachAppHeaderSearchMain from '../Bloomreach/bloomreach.appheadersearch.main';
import AppHeaderLoginMain from '../AppHeaderLogin/appheaderlogin.main';
import AppHeaderLocaleMain from '../AppHeaderLocale/appheaderlocale.main';
import AppHeaderNavigationMain from '../AppHeaderNavigation/appheadernavigation.main';
import CountInfoPopUp from '../CountInfoPopUp/countinfopopup';
import { useCountState } from '../cart-count-context';
import { cortexFetch } from '../utils/Cortex';
import { login } from '../utils/AuthService';
import ImageContainer from '../ImageContainer/image.container';
import Config from '../../../ep.config.json';

import './appheader.main.scss';

import { ReactComponent as CartIcon } from '../../../images/header-icons/cart-icon.svg';
import { ReactComponent as BulkCart } from '../../../images/header-icons/bulk-cart.svg';
import headerLogo from '../../../images/site-images/Company-Logo-v3.svg';


const zoomArray = [
  'defaultcart',
  'defaultcart:additemstocartform',
  'carts',
  'carts:element',
  'carts:element:additemstocartform',
];

const headerLogoFileName = 'Company-Logo-v3.svg';
interface AppHeaderMainProps {
  /** handle search page */
  onSearchPage: (...args: any[]) => any,
  /** handle redirect to main page */
  redirectToMainPage: (...args: any[]) => any,
  /** handle reset password */
  handleResetPassword: (...args: any[]) => any,
  /** handle currency change */
  onCurrencyChange: (...args: any[]) => any,
  /** handle locale change */
  onLocaleChange: (...args: any[]) => any,
  /** handle continue cart */
  onContinueCart: (...args: any[]) => any,
  /** handle go back */
  onGoBack: (...args: any[]) => any,
  /** checked location */
  checkedLocation: boolean,
  /** is in standalone mode */
  isInStandaloneMode: boolean,
  /** data location search */
  locationSearchData?: string,
  /** location path name */
  locationPathName?: string,
  /** links in app header */
  appHeaderLinks: {
    [key: string]: any
  },
  /** links in app header login */
  appHeaderLoginLinks: {
    [key: string]: any
  },
  /** links in app header navigation */
  appHeaderNavigationLinks: {
    [key: string]: any
  },
  /** links in app header top */
  appHeaderTopLinks: {
    [key: string]: any
  },
  /** links in app modal login */
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
  multiCartData: any,
  isDesktop: boolean,
  isLoggedInUser: boolean,
  totalQuantity: number,
}

const BulkOrderImport = Config.b2b.enable ? import(/* webpackChunkName: "bulkorder" */ '../BulkOrder/bulkorder.main') : null;
const BulkOrderMain = lazy(() => BulkOrderImport);

class AppHeaderMain extends Component<AppHeaderMainProps, AppHeaderMainState> {
  static defaultProps = {
    checkedLocation: false,
    isInStandaloneMode: false,
    locationSearchData: '',
    locationPathName: '',
    onSearchPage: () => { },
    redirectToMainPage: () => { },
    handleResetPassword: () => { },
    onLocaleChange: () => { },
    onCurrencyChange: () => { },
    onContinueCart: () => { },
    onGoBack: () => { },
    appHeaderLinks: {},
    appHeaderLoginLinks: {},
    appHeaderNavigationLinks: {},
    appHeaderTopLinks: {},
    appModalLoginLinks: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      totalQuantity: 0,
      cartData: undefined,
      isLoading: true,
      isOffline: false,
      isSearchFocused: false,
      isBulkModalOpened: false,
      multiCartData: undefined,
      isDesktop: false,
      isLoggedInUser: localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED',
    };

    this.handleBulkModalClose = this.handleBulkModalClose.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.goBack = this.goBack.bind(this);
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
            if (res._carts) {
              this.setState({
                multiCartData: res._carts[0],
                isLoading: false,
                cartData: res._defaultcart[0],
              });
            } else {
              this.setState({
                cartData: res._defaultcart[0],
                totalQuantity: res._defaultcart[0]['total-quantity'],
                isLoading: false,
              });
            }
          } else {
            this.setState({
              multiCartData: res._carts[0],
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
      isOffline, cartData, isLoading, isSearchFocused, isBulkModalOpened, isDesktop, isLoggedInUser, multiCartData, totalQuantity,
    } = this.state;
    const {
      checkedLocation,
      handleResetPassword,
      onCurrencyChange,
      onLocaleChange,
      onContinueCart,
      locationSearchData,
      locationPathName,
      isInStandaloneMode,
      onSearchPage,
      redirectToMainPage,
      appHeaderLinks,
      appHeaderLoginLinks,
      appHeaderNavigationLinks,
      appHeaderTopLinks,
      appModalLoginLinks,
    } = this.props;
    const availability = Boolean(cartData || multiCartData);
    const impersonating = localStorage.getItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`);
    const userName = localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserName`) || localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserId`);

    const Cart = () => {
      const { count, name }: any = useCountState();
      const countData = {
        count,
        name,
        link: appHeaderLinks.myCart,
        entity: intl.get('cart'),
      };
      return (
        <div className={`cart-link-container multi-cart-dropdown dropdown ${count ? 'show' : ''}`}>
          <Link className={`cart-link ${count ? 'modal-arrow' : ''}`} to={appHeaderLinks.myCart}>
            <CartIcon className="cart-icon" />
            {intl.get('shopping-cart-nav')}
          </Link>
          <div className={`multi-cart-container dropdown-menu dropdown-menu-right ${count ? 'show' : ''}`} data-region="cart_success_popup">
            <CountInfoPopUp countData={countData} />
          </div>
        </div>);
    };

    return [
      <header key="app-header" className="app-header">
        {
          impersonating ? (
            <div className="impersonation-notification">
              {intl.get('shopper-impersonation-message')}
              {userName}
            </div>
          ) : ''
        }
        <div className={`main-container ${isInStandaloneMode ? 'in-standalone' : ''}`}>

          <div className="main-container-col">
            <div className="logo-container">
              <Link to={appHeaderLinks.mainPage} className="logo">
                <ImageContainer
                  alt="logo image"
                  imgClassName="logo-image"
                  fileName={headerLogoFileName}
                  types={['svg']}
                  imgUrl={headerLogo}
                />
              </Link>
            </div>

            <div className="search-container">
              {Config.bloomreachSearch.enable ? (
                <BloomreachAppHeaderSearchMain isMobileView={false} onSearchPage={onSearchPage} />
              ) : (
                <AppHeaderSearchMain isMobileView={false} onSearchPage={onSearchPage} />
              )}
            </div>

          </div>

          <div className="main-container-col">

            <div className="icons-header-container">
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
              <div>
                {(multiCartData || cartData) ? (
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
                      <Cart />
                    )}
                  </div>
                ) : ''}
              </div>
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
                locationPathName={locationPathName}
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
            <div className="locale-container">
              <AppHeaderLocaleMain onCurrencyChange={onCurrencyChange} onLocaleChange={onLocaleChange} />
            </div>
            {Config.b2b.enable && (
              <Suspense fallback={<div />}>
                <BulkOrderMain isBulkModalOpened={isBulkModalOpened} handleClose={this.handleBulkModalClose} cartData={cartData} />
              </Suspense>)
            }
          </div>
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
