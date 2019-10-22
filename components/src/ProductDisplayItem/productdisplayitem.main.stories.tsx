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
import '../../../app/src/theme/reset.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../app/src/theme/style.less';

import {
  mockProductDisplayItemMainPlain,
  mockProductDisplayItemMainColorAndSize,
  mockProductDisplayItemMainInput,
  mockProductDisplayItemMainMultiCart,
} from './productdisplayitem.main.api.mocks';

// Import custom required scripts
import 'bootstrap/dist/js/bootstrap.bundle.min';

import ProductDisplayItemMain from './productdisplayitem.main';

function dummyOnChangeProductFeature(path) {
  // TODO: aChan - May want to include: https://github.com/gvaldambrini/storybook-router into project to show multi sku option transitions.
  alert(`container passed in callback invoked with selected options sku: ${path}`);
  window.location.reload();
}

function dummyHandleAddToCart() {
  alert('container passed addToCart callback invoked');
  window.location.reload();
}

storiesOf('ProductDisplayItemMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/itemdetail']}>{story()}</MemoryRouter>
  ))
  .add('ProductDisplayItemMain Plain', () => {
    mockProductDisplayItemMainPlain();

    return <ProductDisplayItemMain productId="83992" onAddToCart={dummyHandleAddToCart} />;
  })
  .add('ProductDisplayItemMain Color/size', () => {
    mockProductDisplayItemMainColorAndSize();
    return <ProductDisplayItemMain productId="VESTRI_WORDMARK_FITTED_HAT_RD" onChangeProductFeature={dummyOnChangeProductFeature} onAddToCart={dummyHandleAddToCart} />;
  })
  .add('ProductDisplayItemMain Input', () => {
    mockProductDisplayItemMainInput();
    return <ProductDisplayItemMain productId="250HR_PMKIT" onAddToCart={dummyHandleAddToCart} />;
  })
  .add('ProductDisplayItemMain Multi-cart', () => {
    mockProductDisplayItemMainMultiCart();

    return <ProductDisplayItemMain productId="83992" onAddToCart={dummyHandleAddToCart} />;
  });
