import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import cartData from './MockHttpResponses/cart_data_response';

import CartLineItem from './cart.lineitem';

function handleQuantityChange(){}

storiesOf('CartLineItem', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('CartLineItem', () => {
    return (
        <div>
            {cartData._defaultcart[0]._lineitems[0]._element.map(product => (
             <CartLineItem handleQuantityChange={handleQuantityChange} item={product} key={product._item[0]._code[0].code} />
            ))}
        </div>
      );
  });
