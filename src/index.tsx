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
import './theme/index.scss';
import * as UserPrefs from './components/src/utils/UserPrefs';

import './theme/reset.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme/style.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  const axe = require('react-axe');
  axe(React, ReactDOM, 1000);
}

const locales = {};
const currentlang = UserPrefs.getSelectedLocaleValue();
// eslint-disable-next-line import/no-dynamic-require, global-require
const localeMessages = require(`./localization/${currentlang}.json`);
// eslint-disable-next-line import/no-dynamic-require, global-require
const debugMessages = require(`./localization/messages-${currentlang}.json`);
locales[currentlang] = { ...localeMessages, ...debugMessages };

// localisation init
intl.init({
  currentLocale: currentlang,
  locales,
})
  .then(() => {
    const newLocale = UserPrefs.getSelectedLocaleValue().split('-')[0];
    document.documentElement.lang = newLocale;
    ReactDOM.render(
      <App />,
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
