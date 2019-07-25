/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import cartData from '../CommonMockHttpResponses/cart_main_data_response.json';

import CartLineItem from './cart.lineitem';

function handleQuantityChange() {}
function handleRemove() {}

storiesOf('CartLineItem', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('CartLineItem', () => (
    <div>
      {cartData._defaultcart[0]._lineitems[0]._element.map(product => (
        <CartLineItem handleQuantityChange={handleQuantityChange} item={product} key={product._item[0]._code[0].code} onRemove={handleRemove} />
      ))}
    </div>
  ));
