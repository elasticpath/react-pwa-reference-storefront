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

import profileData from '../CommonMockHttpResponses/profile_data_response.json';
import ProfileAddressesMain from './profileaddresses.main';

function fetchProfileData() {}
function handleNewAddress() {}
function handleEditAddress() {}

storiesOf('ProfileAddressesMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProfileAddressesMain', () => <ProfileAddressesMain addresses={profileData._defaultprofile[0]._addresses[0]} onChange={fetchProfileData} onAddNewAddress={handleNewAddress} onEditAddress={handleEditAddress} />);
