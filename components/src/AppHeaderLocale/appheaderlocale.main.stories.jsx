import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppHeaderLocaleMain from './appheaderlocale.main';

// Option defaults.

storiesOf('AppHeaderLocaleMain', module)
  .add('AppHeaderLocaleMain', () => {
    return (
      <div style={{'backgroundColor' : '#040060'}}>
        <MemoryRouter initialEntries={['/']}><AppHeaderLocaleMain /></MemoryRouter>
      </div>
    )
  });
