import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import intl from 'react-intl-universal';
import './theme/index.less';
import epConfig from './ep.config.json';
import * as UserPrefs from './utils/UserPrefs';
import { init } from '@elasticpath/store-components';

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
      intl
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
