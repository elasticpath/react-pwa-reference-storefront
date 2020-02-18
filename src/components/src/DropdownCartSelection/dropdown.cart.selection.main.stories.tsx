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
import DropdownCartSelection from './dropdown.cart.selection.main';
import Readme from './README.md';

const multiCartData = [
  {
    self: { uri: '/carts/default' },
    _descriptor: [{ name: 'Default' }],
  },
  {
    self: { uri: '/carts/office' },
    _descriptor: [{ name: 'Office' }],
  },
  {
    self: { uri: '/carts/showroom' },
    _descriptor: [{ name: 'Showroom' }],
  },
];

storiesOf('Components|DropdownCartSelection', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('DropdownCartSelection', () => (
    <div style={{ display: 'inline-block' }}>
      <DropdownCartSelection multiCartData={multiCartData} addToSelectedCart={() => {}} btnTxt="Add to Cart" />
    </div>
  ));
