import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { getConfig } from '../utils/ConfigProvider';
import productData from './MockHttpResponses/bundle_constituents_response';

import IndiRecommendationsDisplayMain from './indirecommendations.main';

let Config = {};
const epConfig = getConfig();
Config = epConfig.config;

storiesOf('IndiRecommendationsDisplayMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('IndiRecommendationsDisplayMain', () => <IndiRecommendationsDisplayMain render={['carousel', 'product']} configuration={Config.indi} keywords={productData._code[0].code} />);
