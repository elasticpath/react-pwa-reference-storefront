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
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';
import PaymentFormMain from './paymentform.main';
import { mockPaymentFormSuccessWithAnonUser, mockPaymentFormFailureWithAnonUser, mockPaymentFormSuccessWithRegisteredUser } from './paymentform.main.api.mocks';

import Readme from './README.md';


storiesOf('Components|PaymentFormMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .add('PaymentFormMain with Successful Submission Response', () => {
    mockPaymentFormSuccessWithAnonUser();
    const onCloseModalFuncText = text('onCloseModal', '() => {alert("onCloseModal invoked")}');
    const fetchDataFuncText = text('fetchData', '() => {alert("fetchData invoked")}');

    return (
      <PaymentFormMain
        defaultPostSelection
        onCloseModal={() => { textToFunc(onCloseModalFuncText); }}
        fetchData={() => { textToFunc(fetchDataFuncText); }}
      />
    );
  })
  .add('PaymentFormMain with SaveToProfile Checkbox and Successful Submission Response', () => {
    mockPaymentFormSuccessWithRegisteredUser();

    const onCloseModalFuncText = text('onCloseModal', '() => {alert("onCloseModal invoked")}');
    const fetchDataFuncText = text('fetchData', '() => {alert("fetchData invoked")}');

    return (
      <PaymentFormMain
        onCloseModal={() => { textToFunc(onCloseModalFuncText); }}
        fetchData={() => { textToFunc(fetchDataFuncText); }}
        showSaveToProfileOption
      />
    );
  })
  .add('PaymentFormMain with Failure Submission Response', () => {
    mockPaymentFormFailureWithAnonUser();

    const onCloseModalFuncText = text('onCloseModal', '() => {alert("onCloseModal invoked")}');
    const fetchDataFuncText = text('fetchData', '() => {alert("fetchData invoked")}');

    return (
      <PaymentFormMain
        defaultPostSelection
        onCloseModal={() => { textToFunc(onCloseModalFuncText); }}
        fetchData={() => { textToFunc(fetchDataFuncText); }}
        showSaveToProfileOption
      />
    );
  });
