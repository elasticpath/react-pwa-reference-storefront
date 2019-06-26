import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import QuickOrderMain from './quickorder.main';

storiesOf('QuickOrderMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('QuickOrderMain', () => <QuickOrderMain />);
