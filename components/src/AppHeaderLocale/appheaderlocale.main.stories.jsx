import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppHeaderLocaleMain from './appheaderlocale.main';

// Option defaults.

storiesOf('AppHeaderLocaleMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppHeaderLocaleMain', () => {
    return (
      <div style={{'backgroundColor' : '#040060'}}>
        <AppHeaderLocaleMain />
      </div>
    )
  });
