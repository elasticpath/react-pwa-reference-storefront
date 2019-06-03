import { addParameters, configure } from '@storybook/react';
// import { themes } from '@storybook/theming';

// addParameters({
// 	options: {
// 		// theme: themes.dark
// 	}
// });

const comps = require.context('@elasticpath/store-components/src', true, /.stories.(j|t)sx$/);

configure(() => {
	comps.keys().forEach(filename => comps(filename));
}, module);
