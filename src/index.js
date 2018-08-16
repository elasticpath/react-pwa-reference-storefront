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
import ReactDOM from 'react-dom';
import intl from 'react-intl-universal';
import App from './App';
import * as UserPrefs from './utils/UserPrefs';

// Import custom required styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/style.css';

// Import custom required scripts
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Config = require('Config');

const locales = {};
Config.supportedLocales.forEach((locale) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  locales[locale.value] = require(`./localization/${locale.value}.json`);
});

intl.init({
  currentLocale: UserPrefs.getSelectedLocaleValue(),
  locales,
})
  .then(() => {
    ReactDOM.render(<App />, document.getElementById('root'));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js', { scope: '/' })
        // eslint-disable-next-line no-console
        .then(() => console.log('Service Worker registered successfully.'))
        // eslint-disable-next-line no-console
        .catch(error => console.log('Service Worker registration failed:', error));
    }
  });
