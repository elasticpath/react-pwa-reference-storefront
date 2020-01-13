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
import { object, text } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';
import Readme from './README.md';
import { mockAddressFormSubmitSuccess, mockAddressFormSubmitFailure } from './addressform.main.api.mocks';

import AddressFormMain from './addressform.main';


storiesOf('Components|AddressFormMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .add('AddressFormMain edit', () => {
    mockAddressFormSubmitSuccess();
    const addressData = {
      address: '/addresses/vestri_b2c',
    };
    const onCloseModalFuncText = text('onCloseModal', '() => {alert("onCloseModal invoked")}');
    const fetchDataFuncText = text('fetchData', '() => {alert("fetchData invoked")}');

    return <AddressFormMain
      addressData={object('addressData', addressData)}
      onCloseModal={() => textToFunc(onCloseModalFuncText)}
      fetchData={() => textToFunc(fetchDataFuncText)}
    />;
  })
  .add('AddressFormMain on save failure', () => {
    mockAddressFormSubmitFailure();
    const addressData = {
      address: '/addresses/vestri_b2c',
    };
    const onCloseModalFuncText = text('onCloseModal', '() => {alert("onCloseModal invoked")}');
    const fetchDataFuncText = text('fetchData', '() => {alert("fetchData invoked")}');

    return <AddressFormMain
      addressData={object('addressData', addressData)}
      onCloseModal={() => textToFunc(onCloseModalFuncText)}
      fetchData={() => textToFunc(fetchDataFuncText)}
    />;
  });
