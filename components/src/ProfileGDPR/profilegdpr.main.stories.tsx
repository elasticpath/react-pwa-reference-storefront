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

import onePolicy_consented_response from './MockHttpResponses/GET/onePolicy_consented_response.json';
import onePolicy_notConsented_response from './MockHttpResponses/GET/onePolicy_notConsented_response.json';
import threePolicies_mixed_response from './MockHttpResponses/GET/threePolicies_mixed_response.json';
import ProfileGDPRMain from './profilegdpr.main';

import { text, object } from "@storybook/addon-knobs/react";
import { textToFunc } from "../../../storybook/utils/storybookUtils";

let onChangeFuncText;

storiesOf('ProfileGDPRMain', module)
  .addDecorator(story => {
    onChangeFuncText = text('onChange', '() => {alert("onChange invoked")}');
    return <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  })
  .add('ProfilGDPRMain One policy consented', () => <ProfileGDPRMain dataPolicies={object('dataPolicies', onePolicy_consented_response['_data-policies'][0])} onChange={()=>{textToFunc(onChangeFuncText)}} />)
  .add('ProfilGDPRMain One policy not consented', () => <ProfileGDPRMain dataPolicies={object('dataPolicies', onePolicy_notConsented_response['_data-policies'][0])} onChange={()=>{textToFunc(onChangeFuncText)}} />)
  .add('ProfilGDPRMain Three policies mixed', () => <ProfileGDPRMain dataPolicies={object('dataPolicies', threePolicies_mixed_response['_data-policies'][0])} onChange={()=>{textToFunc(onChangeFuncText)}} />)
;
