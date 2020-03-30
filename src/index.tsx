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
import ReactDOM from 'react-dom';
import intl from 'react-intl-universal';
import App from './App';
import './theme/index.less';
import epConfig from './ep.config.json';
import componentsPackageJson from './components/package.json';
import * as UserPrefs from './utils/UserPrefs';

import './theme/reset.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme/style.less';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const locales = {};
epConfig.supportedLocales.forEach((locale) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const localeMessages = require(`./localization/${locale.value}.json`);
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const debugMessages = require(`./localization/messages-${locale.value}.json`);
  locales[locale.value] = { ...localeMessages, ...debugMessages };
});

// localisation init
intl.init({
  currentLocale: UserPrefs.getSelectedLocaleValue(),
  locales,
})
  .then(() => {
    ReactDOM.render(
      <App componentsData={componentsPackageJson} />,
      document.getElementById('root'),
    );

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        // eslint-disable-next-line no-console
        .then(() => console.log('Service Worker registered successfully.'))
        // eslint-disable-next-line no-console
        .catch(error => console.log('Service Worker registration failed:', error));
    }
  });
