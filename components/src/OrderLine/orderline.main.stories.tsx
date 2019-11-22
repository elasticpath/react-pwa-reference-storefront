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
import Readme from './README.md';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { object } from "@storybook/addon-knobs/react";
import OrderLine from './orderline.main';

// Option defaults.

const orderLine = {
  'monetary-total': [
    {
      amount: 84.54,
      currency: 'USD',
      display: '$84.54',
    },
  ],
  'purchase-date': {
    'display-value': 'June 6, 2019 2:37:16 PM',
    value: 1559831836000,
  },
  'purchase-number': '20108',
  status: 'IN_PROGRESS',
  'tax-total': {
    amount: 3.25,
    currency: 'USD',
    display: '$3.25',
  },
};

storiesOf('Components|OrderLine', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('OrderLine', () => <OrderLine orderLine={object('orderline', orderLine)} />);
