import { configure } from '@storybook/react';
import { init } from '@elasticpath/store-components';
import epConfig from '../../app/src/ep.config';
import intl from 'react-intl-universal';
import { addParameters } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';
import { addReadme } from 'storybook-readme';
import elasticpath from './elasticpath';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);
addDecorator(addReadme);

addParameters({
  options: {
    theme: elasticpath,
  },
});

const locales = {};
epConfig.supportedLocales.forEach((locale) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  locales[locale.value] = require(`../../app/src/localization/${locale.value}.json`);
});

const comps = require.context('@elasticpath/store-components/src', true, /.stories.(j|t)sx$/);

intl.init({
  currentLocale: 'en-CA',
  locales,
}).then(() => {
  init({
    config: epConfig,
    intl
  }).then(() => {
    configure(() => {
      comps.keys().forEach(filename => comps(filename));
    }, module);
  });
});
