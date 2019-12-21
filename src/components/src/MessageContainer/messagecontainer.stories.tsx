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
import MessageContainer from './messagecontainer';
import { object } from '@storybook/addon-knobs';
const errorMessage = {
  debugMessages: 'Customer email address must be specified.',
  type: 'error',
  id: 'need.email',
};
const warningMessage = {
  debugMessages: 'not a well-formed email address',
  type: 'error',
  id: 'field.invalid.email.format',
};
const darkMessage = {
  debugMessages: 'Shipping option must be specified',
  type: 'needinfo',
  id: 'need.shipping.option',
};


storiesOf('Components|MessageContainer', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('MessageContainer Error Message', () => <MessageContainer message={object('message', [errorMessage])} />)
  .add('ProductDisplayItemMain Warning Message', () => <MessageContainer message={object('message', [warningMessage])} />)
  .add('ProductDisplayItemMain Dark Message', () => <MessageContainer message={object('message', [darkMessage])} />);
