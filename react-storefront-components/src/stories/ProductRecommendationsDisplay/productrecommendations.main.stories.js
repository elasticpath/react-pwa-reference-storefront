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

// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import {
  withKnobs, object,
} from '@storybook/addon-knobs/react';
import twoProductRecommendations from './MockHttpResponses/color_size_option_cortex_response_3_recommended.json';

import ProductRecommendationsDisplayMain from '../../components/productrecommendations.main';

// Import custom required styles
import '../../style/reset.less';
import '../../style/style.less';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import readMeCra from './ProductRecommendationsCRA.md';

storiesOf('ProductRecommendationsDisplay/CRA', module)
  .addParameters({
    readme: {
      sidebar: readMeCra,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/productdetails']} keyLength={0}>{story()}</MemoryRouter>
  ))
  .addDecorator(withKnobs)
  .add('3 Crossells from ProductDisplayItem query', () => {
    const label = '2 Crossells from ProductDisplayItem query';
    // BUG - object in knobs can't handle special characters.  apostrophe's turned in character code.
    return <ProductRecommendationsDisplayMain productData={object(label, twoProductRecommendations)} />;
  });
