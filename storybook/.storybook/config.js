import { configure } from '@storybook/react';
import epConfig from '../../src/ep.config';
import intl from 'react-intl-universal';
import { addParameters } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { addons } from '@storybook/addons';
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

addons.setConfig({
  theme: themes.light,
});

const locales = {};
epConfig.supportedLocales.forEach((locale) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  locales[locale.value] = require(`../../src/localization/${locale.value}.json`);
});

const guides = require.context('../../src/components/guide', true, /.stories.(j|t)sx$/);
const comps = require.context('../../src/components/src', true, /.stories.(j|t)sx$/);

intl.init({
  currentLocale: 'en-CA',
  locales,
})
  .then(() => {
    configure(() => {
      guides.keys().forEach(filename => guides(filename));
      comps.keys().forEach(filename => comps(filename));
    }, module);
  });
