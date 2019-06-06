import { configure } from '@storybook/react';
import { init } from '@elasticpath/store-components';
import epConfig from '../../app/src/ep.config';
// import { themes } from '@storybook/theming';

// addParameters({
// 	options: {
// 		// theme: themes.dark
// 	}
// });

const comps = require.context('@elasticpath/store-components/src', true, /.stories.(j|t)sx$/);
init({
  config: epConfig,
  intl: { get: src => src }
}).then(() => {
  configure(() => {
    comps.keys().forEach(filename => comps(filename));
  }, module);
});
