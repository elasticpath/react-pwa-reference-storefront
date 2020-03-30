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
import { text } from '@storybook/addon-knobs/react';
import Readme from './README.md';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';

import {
  mockProductDisplayItemMainPlain,
  mockProductDisplayItemMainColorAndSize,
  mockProductDisplayItemMainInput,
  mockProductDisplayItemMainMultiCart,
} from './productdisplayitem.main.api.mocks';

// Import custom required scripts
import 'bootstrap/dist/js/bootstrap.bundle.min';

import ProductDisplayItemMain from './productdisplayitem.main';

let handleAddToCartFuncText;
let onChangeProductFeatureFuncText;

function processProductDisplayItemKnobCallbacks() {
  handleAddToCartFuncText = text('handleAddToCart', '() => {alert("handleQuantityChange invoked")}');
  onChangeProductFeatureFuncText = text('onChangeProductFeature', '() => {alert("onChangeProductFeature invoked")}');
}

storiesOf('Components|ProductDisplayItemMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/itemdetail']}>{story()}</MemoryRouter>
  ))
  .add('ProductDisplayItemMain Plain', () => {
    processProductDisplayItemKnobCallbacks();
    mockProductDisplayItemMainPlain();
    return <ProductDisplayItemMain productId={text('productId', '83992')} onAddToCart={() => { textToFunc(handleAddToCartFuncText); }} />;
  })
  .add('ProductDisplayItemMain Color/size', () => {
    processProductDisplayItemKnobCallbacks();
    mockProductDisplayItemMainColorAndSize();
    return <ProductDisplayItemMain productId={text('productId', 'VESTRI_WORDMARK_FITTED_HAT_RD')} onChangeProductFeature={() => { textToFunc(onChangeProductFeatureFuncText); }} onAddToCart={() => { textToFunc(handleAddToCartFuncText); }} />;
  })
  .add('ProductDisplayItemMain Input', () => {
    processProductDisplayItemKnobCallbacks();
    mockProductDisplayItemMainInput();
    return <ProductDisplayItemMain productId={text('productId', '250HR_PMKIT')} onAddToCart={() => { textToFunc(handleAddToCartFuncText); }} />;
  })
  .add('ProductDisplayItemMain Multi-cart', () => {
    processProductDisplayItemKnobCallbacks();
    mockProductDisplayItemMainMultiCart();
    return <ProductDisplayItemMain productId={text('productId', '83992')} onAddToCart={() => { textToFunc(handleAddToCartFuncText); }} />;
  });
