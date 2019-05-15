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
import {
  withKnobs, text, boolean,
} from '@storybook/addon-knobs/react';
import Config from 'Config';
import { init } from '../../utils/ConfigProvider';
import { mockSizeAndColorProductAPI, mockB2BProductAPI } from './productdisplayitem.main.api.mocks';
import ProductDisplayItemMain from '../../components/productdisplayitem.main';
import setUpUseMockApiToggle from '../StoryUtilities';

// Import custom required styles
import '../../style/reset.less';
import '../../style/style.less';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import DataAttributeComponent from '../../utils/DataAttributeComponent';

import readMeCra from './ProductDisplayItemCRA.md';
import readMeDrupal from './ProductDisplayItemDrupal.md';

init({
  config: Config,
  intl: { get: str => str },
});

storiesOf('ProductDisplayItem/CRA', module)
  .addParameters({
    readme: {
      sidebar: readMeCra,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/productdetails']} keyLength={0}>{story()}</MemoryRouter>
  ))
  .addDecorator(withKnobs)
  .add('a ProductDisplayItem with color and size options', () => {
    window.config.arKit.enable = boolean('Config_arKit_enable', false);
    setUpUseMockApiToggle(mockSizeAndColorProductAPI);
    return <ProductDisplayItemMain productId={text('productId', '19038')} />;
  })
  .add('a ProductDisplayItem with B2B Options', () => {
    window.config.arKit.enable = boolean('Config_arKit_enable', false);
    setUpUseMockApiToggle(mockB2BProductAPI);
    return <ProductDisplayItemMain productId={text('productId', '59264')} />;
  });

storiesOf('ProductDisplayItem/Drupal', module)
  .addParameters({
    readme: {
      sidebar: readMeDrupal,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/productdetails']} keyLength={0}>{story()}</MemoryRouter>
  ))
  .addDecorator(storyFn => (
    <ep-product-detail id="ep-product-detail-eebd7878-3846-4186-9f71-fe69052e7e8b" data-cart-btn-override="VGhlIE92ZXJyaWRlbiBCdXR0b24=" data-field-default-sku="10008" data-field-image-url="">
      {storyFn()}
    </ep-product-detail>
  ))
  .addDecorator(withKnobs)
  .add('a ProductDisplayItem with color and size options', () => {
    window.config.arKit.enable = boolean('Config_arKit_enable', false);
    setUpUseMockApiToggle(mockSizeAndColorProductAPI);
    const DataProductDisplayItemMain = DataAttributeComponent(ProductDisplayItemMain);
    return <DataProductDisplayItemMain productId={text('productId', '19038')} />;
  })
  .add('a ProductDisplayItem with B2B Options', () => {
    window.config.arKit.enable = boolean('Config_arKit_enable', false);
    setUpUseMockApiToggle(mockB2BProductAPI);
    const DataProductDisplayItemMain = DataAttributeComponent(ProductDisplayItemMain);
    return <DataProductDisplayItemMain productId={text('productId', '59264')} />;
  });
