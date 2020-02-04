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
import { text, object } from "@storybook/addon-knobs/react";
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import Readme from './README.md';

import profileData from '../CommonMockHttpResponses/profile_data_response.json';
// eslint-disable-next-line camelcase
import orderPaymentSelector from './MockHttpResponses/profile_default_payment_selector.json';

import PaymentSelectorMain from './paymentselector.main';
import { mockPaymentFormSuccessWithRegisteredUser } from '../PaymentForm/paymentform.main.api.mocks';
import { textToFunc } from "../../../../storybook/utils/storybookUtils";

storiesOf('Components|ProfilePaymentMethodsMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProfilePaymentMethodsMain', () => {
    const onChangeFuncText = text('handleDataChange', '() => {alert("handleDataChange invoked")}');

    return (
      <PaymentSelectorMain
        paymentInstrumentSelector={{}}
        onChange={() => { textToFunc(onChangeFuncText); }}
        disableAddPayment={false}
      />
    );
  })
  .add('^Cortex@7.6 | 3 Payment Instruments Available', () => {
    const onChangeFuncText = text('onChange', '() => {alert("onChangeFuncText invoked")}');

    mockPaymentFormSuccessWithRegisteredUser();

    return (
      <PaymentSelectorMain
        paymentInstrumentSelector={orderPaymentSelector}
        onChange={() => { textToFunc(onChangeFuncText); }}
        disableAddPayment={false}
      />
    );
  })
  .add('Development No Mocks', () => {
    const onChangeFuncText = text('onChange', '() => {alert("onChangeFuncText invoked")}');

    return (
      <PaymentSelectorMain
        paymentInstrumentSelector={orderPaymentSelector}
        onChange={() => { textToFunc(onChangeFuncText); }}
        disableAddPayment={false}
      />
    );
  });
