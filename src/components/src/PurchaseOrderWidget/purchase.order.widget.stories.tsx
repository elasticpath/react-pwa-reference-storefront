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
import { text } from '@storybook/addon-knobs/react';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';
import poPaymentNotAvaialble from './MockHttpResponses/GET/po_payment_not_available.json';
import availablePONotSelected from './MockHttpResponses/GET/available_po_not_selected.json';
import poPaymentSelected from './MockHttpResponses/GET/po_payment_selected.json';
import PurchaseOrderWidget from './purchase.order.widget';

storiesOf('Components|PurchaseOrderWidget', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('PO Payment Instrument Selected', () => {
    // Should show the PO number available
    const onChangeFuncText = text('onChange', '() => {alert("onChange invoked")}');

    return <PurchaseOrderWidget
      orderPaymentData={poPaymentSelected}
      onChange={() => (textToFunc(onChangeFuncText))}
    />;
  })
  .add('PO Payment Method Available', () => {
    // Should show the PO number available
    const onChangeFuncText = text('onChange', '() => {alert("onChange invoked")}');

    return <PurchaseOrderWidget
      orderPaymentData={availablePONotSelected}
      onChange={() => (textToFunc(onChangeFuncText))}
    />;
  })
  .add('PO Payment Method N/A', () => {
    // Nothing should show here because PO Method is not available.
    const onChangeFuncText = text('onChange', '() => {alert("onChange invoked")}');

    return <PurchaseOrderWidget
      orderPaymentData={poPaymentNotAvaialble}
      onChange={() => (textToFunc(onChangeFuncText))}
    />;
  });
