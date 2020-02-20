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
import { text } from "@storybook/addon-knobs/react";
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import Readme from './README.md';

import paymentSelector from './MockHttpResponses/payment_selector.json';
import paymentMethodInfo from './MockHttpResponses/payment_method_info.json';
import paymentMethod from './MockHttpResponses/payment_methods.json';

import PaymentSelectorMain from './paymentselector.main';
import { textToFunc } from "../../../../storybook/utils/storybookUtils";
import { mockPaymentInstrumentSelectionWithAnonUser, mockPaymentMethodSelectionWithAnonUser } from './paymentselector.main.api.mocks';

// TODO: Should add more stories here! - aChan
storiesOf('Components|PaymentSelectorMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Post Cortex@7.6 | 2 Payment Instruments Available', () => {
    const onChangeFuncText = text('onChange', '() => {alert("onChangeFuncText invoked")}');

    mockPaymentInstrumentSelectionWithAnonUser();

    return (
      <PaymentSelectorMain
        paymentInstrumentSelector={paymentSelector}
        onChange={() => { textToFunc(onChangeFuncText); }}
        disableAddPayment={false}
      />
    );
  })
  .add('Pre Cortex@7.6 | 2 Payment Method Infos Available', () => {
    const onChangeFuncText = text('onChange', '() => {alert("onChangeFuncText invoked")}');

    mockPaymentMethodSelectionWithAnonUser();

    return (
      <PaymentSelectorMain
        paymentMethodInfo={paymentMethodInfo}
        onChange={() => { textToFunc(onChangeFuncText); }}
        disableAddPayment={false}
      />
    );
  })
  .add('Pre Cortex@7.6 | 2 Payment Methods Available', () => {
    const onChangeFuncText = text('onChange', '() => {alert("onChangeFuncText invoked")}');

    return (
      <PaymentSelectorMain
        paymentMethods={paymentMethod}
        onChange={() => { textToFunc(onChangeFuncText); }}
        disableAddPayment={false}
      />
    );
  });
