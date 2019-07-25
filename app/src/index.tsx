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
import { init } from '@elasticpath/store-components';
import App from './App';
import './theme/index.less';
import epConfig from './ep.config.json';
import * as UserPrefs from './utils/UserPrefs';

import '@elasticpath/store-components/src/style/reset.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@elasticpath/store-components/src/style/style.less';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const locales = {};
epConfig.supportedLocales.forEach((locale) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  locales[locale.value] = require(`./localization/${locale.value}.json`);
});

// localisation init
intl.init({
  currentLocale: UserPrefs.getSelectedLocaleValue(),
  locales,
})
  .then(() => {
    // EP Configs init
    init({
      config: epConfig,
      intl,
    })
      .then(() => {
        ReactDOM.render(<App />, document.getElementById('root'));

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
            // eslint-disable-next-line no-console
            .then(() => console.log('Service Worker registered successfully.'))
            // eslint-disable-next-line no-console
            .catch(error => console.log('Service Worker registration failed:', error));
        }
      });
  });
