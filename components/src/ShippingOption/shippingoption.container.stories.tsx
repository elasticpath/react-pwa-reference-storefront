import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import ShippingOptionContainer from './shippingoption.container';

const option= {
  "self": {
    "type": "shipmentdetails.shipping-option",
    "uri": "/shipmentdetails/vestri/qkug64temvzc22le3esdmndegjrgentbfu2tgztcfu2dgytffvqtanzsfuzten3gha4dqyrzgi3gnk3tnbuxa3lfnz2c22levbjuqskqjvcu4va=/shippingoptions/izswirlyknugs4dqnfxgo=",
    "href": "http://reference.epdemos.com/cortex/shipmentdetails/vestri/qkug64temvzc22le3esdmndegjrgentbfu2tgztcfu2dgytffvqtanzsfuzten3gha4dqyrzgi3gnk3tnbuxa3lfnz2c22levbjuqskqjvcu4va=/shippingoptions/izswirlyknugs4dqnfxgo="
  },
  "messages": [],
  "links": [],
  "carrier": "Fed Ex",
  "cost": [
    {
      "amount": 29.99,
      "currency": "USD",
      "display": "$29.99"
    }
  ],
  "display-name": "FedEx Shipping",
  "name": "FedExShipping"
}

storiesOf('ShippingOptionContainer', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ShippingOptionContainer', () => <ShippingOptionContainer option={option} />);
