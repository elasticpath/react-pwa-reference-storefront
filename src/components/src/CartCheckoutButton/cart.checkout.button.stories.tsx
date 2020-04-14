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
import { text, object } from '@storybook/addon-knobs/react';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';
import mockCartDataProc from './cartData_procurement_response.json';
import CartCheckoutButton from './cart.checkout.btn';
import Readme from './README.md';

storiesOf('Components|CartCreate', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('CartCheckoutButton Procurement', () => {
    const checkoutCallback = text('checkoutCallback', '() => {alert("checkoutCallback invoked")}');

    return (
      <CartCheckoutButton
        checkout={() => { textToFunc(checkoutCallback); }}
        cartData={object('CartData', mockCartDataProc)}
      />
    );
  });
//   .add('CartCheckoutButton OOTB', () => {
//     // mockFetchMultiCart();
//     // const handleModalCloseFuncText = text('handleModalClose','() => {alert("handleModalClose invoked")}');
//     // const handleCartsUpdateFuncText = text('handleCartsUpdate','() => {alert("handleCartsUpdate invoked")}');
//     // const handleCartElementSelectFuncText = text('handleCartElementSelect','() => {alert("handleCartElementSelect invoked")}');

//     // return (
//     //   <CartCreate
//     //     handleModalClose={() => { textToFunc(handleModalCloseFuncText)}}
//     //     openModal={boolean('openModal', true)}
//     //     handleCartsUpdate={() => { textToFunc(handleCartsUpdateFuncText)}}
//     //     handleCartElementSelect={() => { textToFunc(handleCartElementSelectFuncText)}}
//     //     updateCartModal={boolean('updateCartModal', true)}
//     //   />
//     // );
//     return null;
//   });
