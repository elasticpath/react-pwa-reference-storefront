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
import mockAddressFormSubmitSuccess from './addressform.main.api.mocks';
import { textToFunc } from "../../../storybook/utils/storybookUtils"
import { object, text } from "@storybook/addon-knobs/react";

import AddressFormMain from './addressform.main';

storiesOf('AddressFormMain', module)
  .add('AddressFormMain edit mode', () => {
    mockAddressFormSubmitSuccess();
    // Adjusting the address link to anything other then the below value will result in the address form responding to a failure.
    // Look into `mockAddressFormSubmitSuccess` for more detail.
    const addressData = {
      address: '/addresses/vestri_b2c',
    };
    let onCloseModalFuncText = text('onCloseModal','() => {alert("onCloseModal invoked")}');
    let fetchDataFuncText = text('fetchData','() => {alert("fetchData invoked")}');
    
    return <AddressFormMain 
      addressData={object('addressData', addressData)} 
      onCloseModal={()=>textToFunc(onCloseModalFuncText)}
      fetchData={()=>textToFunc(fetchDataFuncText)}
    />
  });
