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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import uuidv4 from 'uuid/v4';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import AppModalLoginMain from '../AppModalLogin/appmodallogin.main';
import CountInfoPopUp from '../CountInfoPopUp/countinfopopup';
import AppModalCartSelectMain from '../AppModalCartSelect/appmodalcartselect.main';
import { useRequisitionListCountState } from '../requisition-list-count-context';
import {
  login, logout, logoutAccountManagementUser, getAccessToken,
} from '../utils/AuthService';
import { cortexFetch, adminFetch } from '../utils/Cortex';
import { ReactComponent as AccountIcon } from '../../../images/header-icons/account-icon.svg';

import './appheaderlogin.main.less';

const oidcDiscoveryEndpoint = '/.well-known/openid-configuration';

let Config: IEpConfig | any = {};

interface AppHeaderLoginMainProps {
  /** is mobile view */
  isMobileView?: boolean,
  /** permission */
  permission: boolean,
  /** handle logout */
  onLogout?: (...args: any[]) => any,
  /** handle login */
  onLogin?: (...args: any[]) => any,
  /** handle continue cart */
  onContinueCart?: (...args: any[]) => any,
  /** handle reset password */
  onResetPassword?: (...args: any[]) => any,
  /** data search location */
  locationSearchData?: string,
  /** location path name */
  locationPathName?: string,
  /** links in app header */
  appHeaderLinks: {
    [key: string]: any
  },
  /** links in app header login  */
  appHeaderLoginLinks: {
    [key: string]: any
  },
  /** links in app modal login */
  appModalLoginLinks: {
    [key: string]: any
  },
  /** is logged in */
  isLoggedIn: boolean,
  /** disable login */
  disableLogin?: boolean,
}
interface AppHeaderLoginMainState {
  openModal: boolean,
  openCartModal: boolean,
  showForgotPasswordLink: boolean,
  accountData: any,
  loginUrlAddress: string,
  oidcParameters: any,
  showRequisitionListsLink: boolean,
  profileData: any,
}

interface OidcParameters {
  clientId: string;
  scopes: string;
  authorizationEndpoint: string;
  endSessionEndpoint: string;
}

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'passwordresetform',
];

class AppHeaderLoginMain extends Component<AppHeaderLoginMainProps, AppHeaderLoginMainState, OidcParameters> {
    static defaultProps = {
      isMobileView: false,
      locationSearchData: '',
      locationPathName: '',
      disableLogin: false,
      onLogout: () => {},
      onLogin: () => {},
      onContinueCart: () => {},
      onResetPassword: () => {},
      appHeaderLinks: {},
    }

    constructor(props) {
      super(props);

      const epConfig = getConfig();
      Config = epConfig.config;

      this.state = {
        openModal: false,
        openCartModal: false,
        showForgotPasswordLink: false,
        accountData: undefined,
        oidcParameters: {},
        loginUrlAddress: '',
        showRequisitionListsLink: false,
        profileData: undefined,
      };

      this.handleModalClose = this.handleModalClose.bind(this);
      this.fetchProfileData = this.fetchProfileData.bind(this);
    }

    componentDidMount() {
      const { locationSearchData } = this.props;
      const url = locationSearchData;
      const params = queryString.parse(url);
      this.fetchProfileData();
      if (params.userId && params.role && params.token) {
        this.impersonate(params);
      } else if (params.role && params.token) {
        this.logoutRegisteredUser();
      } else if (Config.b2b.enable && localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`) !== null && localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`) === null) {
        this.handleCartModalOpen();
      }
      if (Config.b2b.enable && localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`) !== null) {
        this.getAccountData();
        this.fetchRequisitionListsData();
      }
      if (Config.b2b.enable && Config.b2b.openId && Config.b2b.openId.enable) {
        this.login();
      }
    }

    async login() {
      const { locationPathName } = this.props;
      const oidcSecret = uuidv4();
      localStorage.setItem('OidcSecret', oidcSecret);
      const oidcParameters: OidcParameters = await AppHeaderLoginMain.discoverOIDCParameters();
      this.setState({
        oidcParameters,
      });

      const oidcStateObject = {
        secret: oidcSecret,
        pathname: window.location.pathname,
      };

      const oidcStateEncoded = btoa(JSON.stringify(oidcStateObject));
      const redirectUrl = `${locationPathName}/loggedin`;

      const query = [
        `scope=${encodeURIComponent(oidcParameters.scopes)}`,
        'response_type=code',
        `client_id=${encodeURIComponent(oidcParameters.clientId)}`,
        `redirect_uri=${encodeURIComponent(redirectUrl)}`,
        `state=${oidcStateEncoded}`,
      ].join('&');

      const loginUrl = `${oidcParameters.authorizationEndpoint}?${query}`;
      this.setState({
        loginUrlAddress: loginUrl,
      });
    }

    static async discoverOIDCParameters() {
      try {
        const data = await adminFetch(oidcDiscoveryEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
          },
        });
        const res = await data.json();
        return {
          clientId: res.account_management_client_id,
          scopes: res.account_management_required_scopes,
          authorizationEndpoint: res.authorization_endpoint,
          endSessionEndpoint: res.end_session_endpoint,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error.message);
        return {
          clientId: '',
          scopes: '',
          authorizationEndpoint: '',
          endSessionEndpoint: '',
        };
      }
    }

    logoutRegisteredUser() {
      logout().then(() => {
        const { onLogout } = this.props;
        onLogout();
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

    async handleModalClose() {
      this.setState({
        openModal: false,
        openCartModal: false,
      });
      const data = await this.getAccountData();
      return data;
    }

    async getAccountData() {
      if (Config.b2b.enable) {
        try {
          await login();
          const account = await adminFetch('/?zoom=accounts,myprofile,myprofile:primaryemail', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
            },
          });
          const accountJson = await account.json();
          this.setState({ accountData: accountJson });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error.message);
        }
      }
    }

    fetchProfileData() {
      login().then(() => {
        cortexFetch('/?zoom=defaultprofile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
          .then(res => res.json())
          .then((res) => {
            if (res && res._defaultprofile) {
              this.setState({
                profileData: res._defaultprofile[0],
              });
            }
          })
          .catch((error) => {
          // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    }

    impersonate(params) {
      const { onLogin } = this.props;
      logout().then(() => {
        login().then(() => {
          getAccessToken(params.token).then((res) => {
            localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${res['access-token']}`);
            localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, params.role);
            localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserId`, params.userId);
            localStorage.setItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`, params.token);
            onLogin();
          });
        });
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

    fetchRequisitionListsData() {
      cortexFetch('?zoom=itemlistinfo', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(r => r.json())
        .then((res) => {
          if (res && res._itemlistinfo) {
            this.setState({ showRequisitionListsLink: true });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    }

    render() {
      const {
        isMobileView, permission, onLogin, onResetPassword, onContinueCart, locationSearchData, appHeaderLoginLinks, appModalLoginLinks, isLoggedIn, disableLogin, locationPathName,
      } = this.props;
      const {
        openModal, openCartModal, showForgotPasswordLink, accountData, loginUrlAddress, oidcParameters, showRequisitionListsLink, profileData,
      } = this.state;
      let keycloakLoginRedirectUrl = '';
      if (Config.b2b.enable && Config.b2b.openId && !Config.b2b.openId.enable) {
        keycloakLoginRedirectUrl = `${Config.b2b.keycloak.loginRedirectUrl}?client_id=${Config.b2b.keycloak.client_id}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(Config.b2b.keycloak.callbackUrl)}`;
      }
      const userName = localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserName`) || localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserId`);
      const b2cUserName = profileData ? `${profileData['given-name']} ${profileData['family-name']}` : '';
      const b2bUserName = accountData ? accountData._myprofile && accountData._myprofile[0].name : '';
      const email = accountData && accountData._myprofile && accountData._myprofile[0]._primaryemail[0].email;

      const RequisitionListsLink = () => {
        const { count, name }: any = useRequisitionListCountState();
        const countData = {
          count,
          name,
          link: '/b2b/requisition-lists',
          entity: intl.get('list'),
        };

        return (
          <div className={`requisition-list-container ${count ? 'show' : ''}`}>
            <div className={`dropdown-menu ${count ? 'show' : ''}`}>
              <CountInfoPopUp countData={countData} />
            </div>
          </div>);
      };

      const accountLinkName = Config.b2b.enable && accountData ? 'my-account' : 'my-profile';

      if (isLoggedIn) {
        return (
          <div className={`app-login-component ${isMobileView ? 'mobile-view' : ''}`}>
            {showRequisitionListsLink ? (<RequisitionListsLink />) : ('')}
            <div className="auth-container dropdown">
              <button className="dropdown-toggle btn-auth-menu" type="button" id={`${isMobileView ? 'mobile_' : ''}header_navbar_loggedIn_button`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {(isMobileView)
                  ? (
                    intl.get('account-logged-in')
                  ) : (
                    <AccountIcon className="account-icon" />
                  )}
              </button>
              <div data-region="authMainRegion" className="auth-nav-container dropdown-menu dropdown-menu-right" aria-label="header_navbar_login_button ">
                <ul data-el-container="global.profileMenu" className="auth-profile-menu-list">
                  {Config.b2b.enable ? (
                    <li className="dropdown-item shop-for">
                      <div className="user-name">{b2bUserName}</div>
                      <div className="email-title">{email}</div>
                      <div className="shopping-small">
                        <span>
                          {localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`)}
                        </span>
                      </div>
                    </li>
                  ) : (
                    <li className="dropdown-item shop-for b2c">
                      <span className="user-name">{b2cUserName}</span>
                      {userName !== 'undefined' ? (
                        <span className="email-title">{userName}</span>
                      ) : ('')}
                    </li>
                  )}
                  <li className="dropdown-item">
                    <Link to={appHeaderLoginLinks.profile} className="profile-link">
                      <div>
                        <span id="header_navbar_login_menu_profile_link">
                          {intl.get(accountLinkName)}
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to={appHeaderLoginLinks.purchaseHistory} className="purchase-history-link">
                      <div>
                        <span id="header_navbar_login_menu_purchase_history_link">
                          {intl.get('purchase-history')}
                        </span>
                      </div>
                    </Link>
                  </li>
                  {permission && (
                    <li className="dropdown-item">
                      <Link to={appHeaderLoginLinks.wishlists} className="wishlist-link">
                        <div>
                          <span id="header_navbar_login_menu_wishlist_link">
                            {intl.get('wishlists')}
                          </span>
                        </div>
                      </Link>
                    </li>
                  )}
                  {(Config.b2b.enable && accountData && accountData._accounts) ? (
                    <li className="dropdown-item">
                      <Link to={appHeaderLoginLinks.accounts} className="dashboard-link">
                        <div>
                          <span className="dashboard-nav">
                            {intl.get('accounts')}
                          </span>
                        </div>
                      </Link>
                    </li>) : ('')}
                  {(showRequisitionListsLink) ? (
                    <li className="dropdown-item">
                      <Link to={appHeaderLoginLinks.requisitionLists} className="dashboard-link link-item">
                        <div>
                          <span className="dashboard-nav">
                            {intl.get('requisition-lists')}
                          </span>
                        </div>
                      </Link>
                    </li>) : ('')}
                  {(Config.b2b.enable) ? (
                    <li>
                      <button className="dropdown-item" type="button" onClick={() => this.handleCartModalOpen()}>
                        <span className="cart-select-btn">{intl.get('shop-for')}</span>
                      </button>
                      <AppModalCartSelectMain key="app-modal-cart-selection-main" handleModalClose={this.handleModalClose} openModal={openCartModal} onContinueCart={onContinueCart} />
                    </li>
                  ) : ('')}
                  <li className="dropdown-item">
                    {(Config.b2b.enable) ? (
                      <button className="ep-btn primary logout-link" type="button" data-el-label="auth.logout" onClick={() => logoutAccountManagementUser()}>
                        <span className="icon" />
                        {intl.get('logout')}
                      </button>
                    ) : (
                      <button className="ep-btn primary logout-link" type="button" data-el-label="auth.logout" onClick={() => this.logoutRegisteredUser()}>
                        <span className="icon" />
                        {intl.get('logout')}
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={`app-login-component ${isMobileView ? 'mobile-view' : ''}`}>
          {(Config.b2b.enable) ? (
            <a href={`${(Config.b2b.openId && Config.b2b.openId.enable) ? loginUrlAddress : keycloakLoginRedirectUrl}`} className="login-auth-service-btn">
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
          <AppModalLoginMain
            key="app-modal-login-main"
            oidcParameters={oidcParameters}
            handleModalClose={this.handleModalClose}
            openModal={openModal}
            onLogin={onLogin}
            onResetPassword={onResetPassword}
            locationSearchData={locationSearchData}
            locationPathName={locationPathName}
            appModalLoginLinks={appModalLoginLinks}
            showForgotPasswordLink={showForgotPasswordLink}
            disableLogin={disableLogin}
          />
          <div data-region="authMainRegion" className="auth-nav-container" />
        </div>
      );
    }
}

export default AppHeaderLoginMain;
