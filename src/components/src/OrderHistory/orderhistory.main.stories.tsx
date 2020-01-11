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
import OrderHistoryMain from './orderhistory.main';

// Option defaults.

const purchaseHistory = {
  self: {
    type: 'purchases.purchases',
    uri: '/purchases/vestri',
    href: 'http://reference.epdemos.com/cortex/purchases/vestri',
  },
  messages: [],
  links: [],
  _element: [
    {
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
    },
    {
      'monetary-total': [
        {
          amount: 90.46,
          currency: 'USD',
          display: '$90.46',
        },
      ],
      'purchase-date': {
        'display-value': 'May 31, 2019 11:36:32 AM',
        value: 1559302592000,
      },
      'purchase-number': '20058',
      status: 'IN_PROGRESS',
      'tax-total': {
        amount: 3.48,
        currency: 'USD',
        display: '$3.48',
      },
    },
    {
      'monetary-total': [
        {
          amount: 138.88,
          currency: 'USD',
          display: '$138.88',
        },
      ],
      'purchase-date': {
        'display-value': 'May 21, 2019 11:00:01 AM',
        value: 1558436401000,
      },
      'purchase-number': '20048',
      status: 'IN_PROGRESS',
      'tax-total': {
        amount: 5.34,
        currency: 'USD',
        display: '$5.34',
      },
    },
  ],
};


storiesOf('Components|OrderHistoryMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('OrderHistoryMain', () => <OrderHistoryMain purchaseHistory={object('purchaseHistory', purchaseHistory)} />);
