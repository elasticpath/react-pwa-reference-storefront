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
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { getConfig } from '../utils/ConfigProvider';
import productData from './MockHttpResponses/bundle_constituents_response.json';

import IndiRecommendationsDisplayMain from './indirecommendations.main';

let Config:any = {};
const epConfig = getConfig();
Config = epConfig.config;

storiesOf('IndiRecommendationsDisplayMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('IndiRecommendationsDisplayMain', () => <IndiRecommendationsDisplayMain render={['carousel', 'product']} configuration={Config.indi} keywords={productData._code[0].code} />);
