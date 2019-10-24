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

import B2bEditAccount from './b2b.editaccount';

function handleAccountSettingsClose() {}
function handleAccountSettingsUpdate() {}
const isSettingsDialogOpen = true;
const accountData = {
  name: 'Cabana',
  legalName: 'Cabana, LLC',
  externalId: 'externalId',
  registrationNumber: 'cust-00062',
  selfSignUpCode: '123',
  uri: 'uri',
};
const editSubAccountUri = null;
const editMetadataUri = null;

storiesOf('B2bEditAccount', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('B2bEditAccount', () => (
    <B2bEditAccount
      handleClose={handleAccountSettingsClose}
      handleUpdate={handleAccountSettingsUpdate}
      isOpen={isSettingsDialogOpen}
      accountData={accountData}
      editSubAccountUri={editSubAccountUri}
      editMetadataUri={editMetadataUri}
    />
  ));
