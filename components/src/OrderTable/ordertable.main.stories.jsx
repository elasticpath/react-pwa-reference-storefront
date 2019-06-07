import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import data from './MockHttpResponses/cart_data_response';

import OrderTableMain from './ordertable.main';

storiesOf('OrderTableMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('OrderTableMain', () => <OrderTableMain data={data._defaultcart[0]} itemDetailLink='/' />);
