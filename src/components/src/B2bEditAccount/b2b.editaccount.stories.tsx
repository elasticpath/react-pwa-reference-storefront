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
import { object, text, boolean } from "@storybook/addon-knobs/react";
import B2bEditAccount from './b2b.editaccount';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';

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

storiesOf('Components|B2bEditAccount', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('B2bEditAccount', () => {
    let handleCloseFuncText = text('handleClose','() => {alert("handleClose invoked")}');
    let handleUpdateFuncText = text('handleUpdate', '() => {alert("handleUpdate invoked")}');
    
    return (
      <B2bEditAccount
        handleClose={()=>{textToFunc(handleCloseFuncText)}}
        editSubAccountUri={text('editSubAccountUri', editSubAccountUri)}
        handleUpdate={()=>{textToFunc(handleUpdateFuncText)}}
        isOpen={boolean('isOpen', true)}
        accountData={object('accountData', accountData)}
        editMetadataUri={text('editMetadataUri', editMetadataUri)}
      />
    );
  });
