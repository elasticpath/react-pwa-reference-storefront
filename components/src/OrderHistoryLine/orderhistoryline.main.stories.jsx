import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import OrderHistoryLineMain from './orderhistoryline.main';

storiesOf('OrderHistoryLineMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('OrderHistoryLineMain', () => <OrderHistoryLineMain orderHistoryLineUrlProps='' />);
