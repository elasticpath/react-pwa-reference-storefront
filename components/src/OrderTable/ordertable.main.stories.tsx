import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import data from '../CommonMockHttpResponses/cart_data_response.json';

import OrderTableMain from './ordertable.main';

storiesOf('OrderTableMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('OrderTableMain', () => <OrderTableMain data={data._defaultcart[0]} itemDetailLink='/' />);
