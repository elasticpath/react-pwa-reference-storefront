import { configure, addDecorator } from '@storybook/react';
import { addReadme } from 'storybook-readme';
import { withConsole } from '@storybook/addon-console';
import { withA11y } from '@storybook/addon-a11y';
import intl from 'react-intl-universal';
import Config from '../src/ep.config.json';

window.config = Config;

const locales = {};

Config.supportedLocales.forEach((locale) => {
  locales[locale.value] = require(`../src/localization/${locale.value}.json`);
});

// TODO: aChan -- Placing internationalization here causes the first refresh on browser to not have translations -- needs more investigation.
intl.init({
  currentLocale: "en-CA",
  locales,
}).then(() => {
  window.intlFunc = (stringToTranslate) => {
    return intl.get(stringToTranslate);
  };  
});

addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(addReadme);
addDecorator(withA11y);

configure(loadStories, module);

function loadStories() {
  require('../src/stories/ProductDisplayItem/productdisplayitem.main.stories');
  require('../src/stories/ProductRecommendationsDisplay/productrecommendations.main.stories');
  require('../src/stories/BundleConstituents/bundleconstituents.main.stories.js');
}
