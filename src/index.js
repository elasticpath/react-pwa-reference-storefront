/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
