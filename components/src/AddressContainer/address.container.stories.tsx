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

import AddressContainer from './address.container';

const dataName = {
  'family-name': 'family-name',
  'given-name': 'given-name',
};
const dataAddress = {
  'country-name': 'country-name',
  'extended-address': 'extended-address',
  locality: 'locality',
  organization: 'organization',
  'phone-number': 'phone-number',
  'postal-code': 'postal-code',
  region: 'region',
  'street-address': 'street-address',
};

storiesOf('AddressContainer', module)
  .add('AddressContainer', () => <AddressContainer name={dataName} address={dataAddress} />);
