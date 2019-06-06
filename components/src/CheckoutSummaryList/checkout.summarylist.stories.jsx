import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import cartData from './MockHttpResponses/cart_data_response';

import CheckoutSummaryList from './checkout.summarylist';

storiesOf('CheckoutSummaryList', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('CheckoutSummaryList', () => {
    return (
        <CheckoutSummaryList data={cartData._defaultcart[0]} />
      );
  });
