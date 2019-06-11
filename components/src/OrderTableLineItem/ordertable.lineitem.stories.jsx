import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import data from '../CommonMockHttpResponses/cart_data_response';

import OrderTableLineItem from './ordertable.lineitem';

storiesOf('OrderTableLineItem', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
  .add('OrderTableLineItem', () => {
      return (
          <table>
              <tbody>
                 {data._defaultcart[0]._lineitems[0]._element.map(product => (
                    <OrderTableLineItem key={product._item[0]._code[0].code} item={product} itemDetailLink='/' />
                 ))}
              </tbody>
        </table>
      );
  }
);
