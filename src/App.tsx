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

import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router, Switch, withRouter, Route,
} from 'react-router-dom';
import intl from 'react-intl-universal';
import { EpStore } from './hooks/store';

import AppHeaderMain from './components/src/AppHeader/appheader.main';
import AppFooterMain from './components/src/AppFooterMain/appfooter.main';
import Messagecontainer from './components/src/MessageContainer/messagecontainer';
import { CountProvider } from './components/src/cart-count-context';
import { RequisitionListCountProvider } from './components/src/requisition-list-count-context';
import ComplianceSupportModal from './components/src/ComplianceSupport/compliancesupport.main';

import packageJson from '../package.json';
import RouteWithSubRoutes from './containers/RouteContainers/RouteWithSubRoutes';
import withAnalytics from './utils/Analytics';
import Config from './ep.config.json';
import { ErrorContext, ErrorDisplayBoundary, ErrorRemoveAll } from './components/src/utils/MessageContext';
import baseRoutes from './containers/RouteContainers/baseRouter';
import './App.scss';

declare global {
  interface Window { fbAsyncInit: any; }
}

// eslint-disable-next-line
declare var FB: any;

const routes: any [] = baseRoutes;
let AdditionalRoutes: any;

let ChatComponent;
const isLoggedInUser = localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED';
if (Config.chatbot.enable && isLoggedInUser) {
  const ChatComponentImport = import(/* webpackChunkName: "chatbot" */ './components/src/ChatBot/chatbot');
  ChatComponent = lazy(() => ChatComponentImport);
}

let FacebookChat;
if (Config.facebook.enable) {
  const FacebookChatImport = import(/* webpackChunkName: "facebookchat" */ './components/src/FacebookChat/facebookchat.main');
  FacebookChat = lazy(() => FacebookChatImport);
}

if (Config.b2b.enable) {
  const additionalB2bRoutesContainer = import(/* webpackChunkName: "AdditionalB2bRoutes" */ './containers/RouteContainers/AdditionalB2bRoutesContainer');
  AdditionalRoutes = lazy(() => additionalB2bRoutesContainer);
} else {
  const additionalB2cRoutesContainer = import(/* webpackChunkName: "AdditionalB2cRoutes" */ './containers/RouteContainers/AdditionalB2cRoutesContainer');
  AdditionalRoutes = lazy(() => additionalB2cRoutesContainer);
}

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

function handleAcceptDataPolicy() {
  window.location.reload();
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
  profile: '/account',
  wishlists: '/account/wishlists',
  purchaseHistory: '/account/purchase-history',
  accounts: '/account/accounts',
  requisitionLists: '/account/requisition-lists',
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

const showCompliance = Config.Compliance.enable;
const isComplianceAccepted = localStorage.getItem(`${Config.cortexApi.scope}_Compliance_Accept`);
const isComplianceDeclined = localStorage.getItem(`${Config.cortexApi.scope}_Compliance_Decline`);

const complianceSupportModal = showCompliance && !isComplianceAccepted && !isComplianceDeclined ? <ComplianceSupportModal onAcceptDataPolicy={handleAcceptDataPolicy} /> : '';

const VersionContainer = (props) => {
  const { appVersion, componentsVersion } = props;
  return (
    <div className="version" style={{ display: 'none' }}>
      <span>{ `${intl.get('app-version')}: ${appVersion}` }</span>
      <span>{ `${intl.get('components-version')}: ${componentsVersion}` }</span>
    </div>
  );
};

const Root = () => {
  const { error } = React.useContext(ErrorContext);
  const locationPathName = window.location.origin;

  return (
    <>
      <VersionContainer appVersion={packageJson.version} />
      {Config.facebook.enable && (
        <Suspense fallback={<div />}>
          <FacebookChat config={Config.facebook} handleFbAsyncInit={handleFbAsyncInit} />
        </Suspense>
      )}
      <AppHeaderMain
        onSearchPage={keywords => redirectToProfilePage(keywords)}
        redirectToMainPage={redirectToMainPage}
        checkedLocation={handlePathName()}
        handleResetPassword={handleResetPassword}
        onCurrencyChange={handleCurrencyChange}
        onLocaleChange={handleLocaleChange}
        onContinueCart={handleContinueCart}
        onGoBack={handleGoBack}
        locationSearchData={locationData}
        locationPathName={locationPathName}
        isInStandaloneMode={isInStandaloneMode}
        appHeaderLinks={appHeaderLinks}
        appHeaderLoginLinks={appHeaderLoginLinks}
        appHeaderNavigationLinks={appHeaderNavigationLinks}
        appHeaderTopLinks={appHeaderTopLinks}
        appModalLoginLinks={appModalLoginLinks}
      />
      <main className="app-content" role="main">
        <Messagecontainer key="message-container" message={error} />
        <Switch>
          {routes.map(route => (
            <RouteWithSubRoutes key={route.path} {...route} />
          ))}
          <Suspense fallback={<div />}>
            <AdditionalRoutes />
          </Suspense>
        </Switch>
        {complianceSupportModal}
      </main>
      <AppFooterMain appFooterLinks={appFooterLinks} />
      {Config.chatbot.enable && isLoggedInUser && (
        <Suspense fallback={<div />}>
          <ChatComponent />
        </Suspense>
      )}
    </>
  );
};

const withTracker = (WrappedComponent) => {
  const trackPage = () => {
    ErrorRemoveAll();
  };

  const HOC = (props) => {
    trackPage();
    return (
      <WrappedComponent {...props} />
    );
  };

  return HOC;
};

const App = withRouter(withAnalytics(withTracker(Root)));
const AppWithRouter = (props) => {
  const { componentsData } = props;
  return (
    <Router>
      <ErrorDisplayBoundary>
        <EpStore>
          <CountProvider>
            <RequisitionListCountProvider>
              <Switch>
                <Route path="/" exact={false} render={passedProps => <App {...passedProps} componentsData={componentsData} />} />
              </Switch>
            </RequisitionListCountProvider>
          </CountProvider>
        </EpStore>
      </ErrorDisplayBoundary>
    </Router>
  );
};

export default AppWithRouter;
