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
import { text, boolean, number } from '@storybook/addon-knobs/react';
import Readme from './README.md';
import QuantitySelector from './quantitySelector';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';

storiesOf('Components|QuantitySelector', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .add('PurchaseDetailsMain', () => {
    const handleQuantityDecrement = text('handleQuantityDecrement', '() => {alert("handleQuantityDecrement invoked")}');
    const handleQuantityIncrement = text('handleQuantityIncrement', '() => {alert("handleQuantityIncrement invoked")}');
    const handleQuantityChange = text('handleQuantityChange', '() => {alert("handleQuantityChange invoked")}');

    return (
      <QuantitySelector
        handleQuantityDecrement={() => { textToFunc(handleQuantityDecrement); }}
        handleQuantityIncrement={() => { textToFunc(handleQuantityIncrement); }}
        handleQuantityChange={() => { textToFunc(handleQuantityChange); }}
        isLoading={boolean('isLoading', false)}
        itemQuantity={number('itemQuantity', 1)}
      />
    );
  });
