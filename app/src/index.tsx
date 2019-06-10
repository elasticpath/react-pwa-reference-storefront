import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import intl from 'react-intl-universal';
import './theme/index.less';
import * as serviceWorker from './serviceWorker';
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

        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: http://bit.ly/CRA-PWA
        serviceWorker.unregister();
      });
});
