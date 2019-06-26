import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import OrderLine from './orderline.main';

// Option defaults.

const orderLine =     {
  "monetary-total": [
    {
      "amount": 84.54,
      "currency": "USD",
      "display": "$84.54"
    }
  ],
  "purchase-date": {
    "display-value": "June 6, 2019 2:37:16 PM",
    "value": 1559831836000
  },
  "purchase-number": "20108",
  "status": "IN_PROGRESS",
  "tax-total": {
    "amount": 3.25,
    "currency": "USD",
    "display": "$3.25"
  }
};

storiesOf('OrderLine', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('OrderLine', () => <OrderLine orderLine={orderLine} />);
