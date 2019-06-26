import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import OrderHistoryMain from './orderhistory.main';

// Option defaults.

const purchaseHistory = {
  "self": {
    "type": "purchases.purchases",
    "uri": "/purchases/vestri",
    "href": "http://reference.epdemos.com/cortex/purchases/vestri"
  },
  "messages": [],
  "links": [],
  "_element": [
    {
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
    },
    {
      "monetary-total": [
        {
          "amount": 90.46,
          "currency": "USD",
          "display": "$90.46"
        }
      ],
      "purchase-date": {
        "display-value": "May 31, 2019 11:36:32 AM",
        "value": 1559302592000
      },
      "purchase-number": "20058",
      "status": "IN_PROGRESS",
      "tax-total": {
        "amount": 3.48,
        "currency": "USD",
        "display": "$3.48"
      }
    },
    {
      "monetary-total": [
        {
          "amount": 138.88,
          "currency": "USD",
          "display": "$138.88"
        }
      ],
      "purchase-date": {
        "display-value": "May 21, 2019 11:00:01 AM",
        "value": 1558436401000
      },
      "purchase-number": "20048",
      "status": "IN_PROGRESS",
      "tax-total": {
        "amount": 5.34,
        "currency": "USD",
        "display": "$5.34"
      }
    }
  ]
};


storiesOf('OrderHistoryMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('OrderHistoryMain', () => <OrderHistoryMain purchaseHistory={purchaseHistory} />);
