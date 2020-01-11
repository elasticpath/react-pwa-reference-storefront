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
import ShippingOptionContainer from './shippingoption.container';

const option = {
  self: {
    type: 'shipmentdetails.shipping-option',
    uri: '/shipmentdetails/vestri/qkug64temvzc22le3esdmndegjrgentbfu2tgztcfu2dgytffvqtanzsfuzten3gha4dqyrzgi3gnk3tnbuxa3lfnz2c22levbjuqskqjvcu4va=/shippingoptions/izswirlyknugs4dqnfxgo=',
    href: 'http://reference.epdemos.com/cortex/shipmentdetails/vestri/qkug64temvzc22le3esdmndegjrgentbfu2tgztcfu2dgytffvqtanzsfuzten3gha4dqyrzgi3gnk3tnbuxa3lfnz2c22levbjuqskqjvcu4va=/shippingoptions/izswirlyknugs4dqnfxgo=',
  },
  messages: [],
  links: [],
  carrier: 'Fed Ex',
  cost: [
    {
      amount: 29.99,
      currency: 'USD',
      display: '$29.99',
    },
  ],
  'display-name': 'FedEx Shipping',
  name: 'FedExShipping',
};

storiesOf('Components|ShippingOptionContainer', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ShippingOptionContainer', () => <ShippingOptionContainer option={object('option', option)} />);
