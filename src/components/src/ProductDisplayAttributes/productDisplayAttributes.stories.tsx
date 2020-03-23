/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
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
// Import custom required styles
import '../../../theme/reset.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../theme/style.less';
import { text, object } from '@storybook/addon-knobs/react';
import Readme from './README.md';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';
// Import custom required scripts
import 'bootstrap/dist/js/bootstrap.bundle.min';

import detailsProductDataClosed from './MockHttpResponses/detailsProductData_closed.json';
import detailsProductDataOpened from './MockHttpResponses/detailsProductData_opened.json';

import ProductDisplayAttributes from './productDisplayAttributes';


storiesOf('Components|ProductDisplayAttributes', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/itemdetail']}>{story()}</MemoryRouter>
  ))
  .add('ProductDisplayAttribute Closed', () => {
    const handleDataAttribute = text('handleDataAttribute', '() => {alert("handleDataAttribute invoked")}');

    return <ProductDisplayAttributes
      handleDetailAttribute={() => { textToFunc(handleDataAttribute); }}
      detailsProductData={object('detailsProductData', detailsProductDataClosed)}
    />;
  })
  .add('ProductDisplayAttribute Open', () => {
    const handleDataAttribute = text('handleDataAttribute', '() => {alert("handleDataAttribute invoked")}');

    return <ProductDisplayAttributes
      handleDetailAttribute={() => { textToFunc(handleDataAttribute); }}
      detailsProductData={object('detailsProductData', detailsProductDataOpened)}
    />;
  });
