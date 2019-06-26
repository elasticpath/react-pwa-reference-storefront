import React from 'react';
import { storiesOf } from '@storybook/react';
import orderData from '../CommonMockHttpResponses/cart_data_response.json';

import PaymentMethodContainer from './paymentmethod.container';

const displayName = orderData._defaultcart[0]._order[0]._paymentmethodinfo[0]._paymentmethod[0];

storiesOf('PaymentMethodContainer', module)
    .add('PaymentMethodContainer', () => <PaymentMethodContainer displayName={displayName} />);
