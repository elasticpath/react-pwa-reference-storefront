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
import {
  BrowserRouter as Router, Switch, withRouter, Route,
} from 'react-router-dom';
import {
  AppHeaderMain, FacebookChat, AppFooterMain, ChatComponent, Messagecontainer, CountProvider, RequisitionListCountProvider,
} from '@elasticpath/store-components';
import intl from 'react-intl-universal';
import packageJson from '../package.json';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import routes from './routes';
import withAnalytics from './utils/Analytics';
import Config from './ep.config.json';
import { ErrorContext, ErrorDisplayBoundary } from './utils/MessageContext';
import { LoginRedirectPage } from './containers/LoginRedirectPage';

import './App.less';

declare global {
  interface Window { fbAsyncInit: any; }
}

// eslint-disable-next-line
declare var FB: any;

function redirectToProfilePage(keywords) {
  window.location.href = `/search/${keywords}`;
}

function redirectToMainPage() {
  window.location.href = '/';
}

function handlePathName() {
  const checkLocation = window.location.pathname === '/maintenance';
  return checkLocation;
}

function handleResetPassword() {
  window.location.href = '/password_reset';
}

function handleCurrencyChange() {
  window.location.reload();
}

function handleLocaleChange() {
  window.location.reload();
}

function handleContinueCart() {
  window.location.reload();
}

function handleGoBack() {
  window.history.back();
}

function handleFbAsyncInit() {
  // eslint-disable-next-line
  window.fbAsyncInit = function () {
    // eslint-disable-next-line
    FB.init({
      appId: Config.facebook.applicationId,
      status: true,
      xfbml: true,
      version: 'v2.10',
    });
  };
}

const locationData = window.location.search;
// @ts-ignore: Property 'standalone' does not exist on type 'Navigator'.
const isInStandaloneMode = window.navigator.standalone;
const appFooterLinks = {
  aboutus: '/aboutus',
  contactus: '/contactus',
  shippingreturns: '/shippingreturns',
  termsandconditions: '/termsandconditions',
  shareFacebook: '/',
  shareTwitter: '/',
  shareInstagram: '/',
};
const appHeaderLinks = {
  mainPage: '/',
  myCart: '/mycart',
  requisitionLists: '/b2b/requisition-lists',
};
const appHeaderLoginLinks = {
  profile: '/profile',
  wishlists: '/wishlists',
};
const appHeaderNavigationLinks = {
  categories: '/category/',
  subCategories: '/category/',
};
const appHeaderTopLinks = {
  shippingreturns: '/shippingreturns',
  aboutus: '/aboutus',
  contactus: '/contactus',
};
const appModalLoginLinks = {
  registration: '/registration',
};

const VersionContainer = (props) => {
  const { appVersion, componentsVersion } = props;
  return (
    <div className="version" style={{ display: 'none' }}>
      <span>{ `${intl.get('app-version')}: ${appVersion}` }</span>
      <span>{ `${intl.get('components-version')}: ${componentsVersion}` }</span>
    </div>
  );
};

const Root = (props) => {
  const { componentsData } = props;
  const { error } = React.useContext(ErrorContext);
  return [
    <VersionContainer key="version-container" componentsVersion={componentsData.version} appVersion={packageJson.version} />,
    <FacebookChat key="facebook-chat" config={Config.facebook} handleFbAsyncInit={handleFbAsyncInit} />,
    <AppHeaderMain
      key="app-header"
      onSearchPage={keywords => redirectToProfilePage(keywords)}
      redirectToMainPage={redirectToMainPage}
      checkedLocation={handlePathName()}
      handleResetPassword={handleResetPassword}
      onCurrencyChange={handleCurrencyChange}
      onLocaleChange={handleLocaleChange}
      onContinueCart={handleContinueCart}
      onGoBack={handleGoBack}
      locationSearchData={locationData}
      isInStandaloneMode={isInStandaloneMode}
      appHeaderLinks={appHeaderLinks}
      appHeaderLoginLinks={appHeaderLoginLinks}
      appHeaderNavigationLinks={appHeaderNavigationLinks}
      appHeaderTopLinks={appHeaderTopLinks}
      appModalLoginLinks={appModalLoginLinks}
    />,
    <Messagecontainer message={error} />,
    <div key="app-content" className="app-content">
      <Switch>
        {routes.map(route => (
          <RouteWithSubRoutes key={`${route.path}_${Math.random().toString(36).substr(2, 9)}`} {...route} />
        ))}
      </Switch>
    </div>,
    <AppFooterMain key="app-footer" appFooterLinks={appFooterLinks} />,
    <ChatComponent key="chat-component" />,
  ];
};

const App = withRouter(withAnalytics(Root));
const AppWithRouter = (props) => {
  const { componentsData } = props;
  return (
    <Router>
      <ErrorDisplayBoundary>
        <CountProvider>
          <RequisitionListCountProvider>
            <Switch>
              <Route path="/loggedin" exact component={LoginRedirectPage} />
              <Route path="/" exact={false} render={passedProps => <App {...passedProps} componentsData={componentsData} />} />
            </Switch>
          </RequisitionListCountProvider>
        </CountProvider>
      </ErrorDisplayBoundary>
    </Router>
  );
};
export default AppWithRouter;
