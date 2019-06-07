import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppHeaderMain from './appheader.main';

storiesOf('AppHeaderMain', module)
  .add('AppHeaderMain', () => {
    return (
      <MemoryRouter initialEntries={['/']}><AppHeaderMain /></MemoryRouter>
  );
  });
