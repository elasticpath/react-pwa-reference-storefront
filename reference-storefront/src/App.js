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
import {
  BrowserRouter as Router, Switch, withRouter, Route,
} from 'react-router-dom';
import {
  init, AppHeaderMain, FacebookChat, AppFooterMain,
} from '@elasticpath/react-storefront-components';
import intl from 'react-intl-universal';
import router from './routes';
import withAnalytics from './utils/Analytics';

import './App.less';

const Config = require('Config');

init({
  config: Config,
  intl,
});

// eslint-disable-next-line react/no-array-index-key
const routeComponents = router.map(({ path, component }, key) => <Route exact path={path} component={component} key={key} />);

function redirectToProfilePage(keywords) {
  window.location = `/search/${keywords}`;
}

function redirectToMainPage() {
  window.location = '/';
}

function handlePathName() {
  const checkLocation = window.location.pathname === '/maintenance';
  return checkLocation;
}

function handleResetPassword() {
  window.location = ('/password_reset', { returnPage: '/' });
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
const isInStandaloneMode = window.navigator.standalone;

const Root = () => [
  <FacebookChat key="FacebookChat" config={Config.facebook} handleFbAsyncInit={handleFbAsyncInit} />,
  <AppHeaderMain
    key="AppHeaderMain"
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
  />,
  <div key="app-content" className="app-content">
    <Switch>
      {routeComponents}
    </Switch>
  </div>,
  <AppFooterMain key="AppFooterMain" />,
];

const App = withRouter(withAnalytics(Root));
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);
export default AppWithRouter;
