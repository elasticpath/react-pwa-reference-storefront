import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppHeaderSearchMain from './appheadersearch.main';

storiesOf('AppHeaderSearchMain', module)
  .add('AppHeaderSearchMain', () => {
    return (
      <div style={{'backgroundColor':'#040060'}}>
        <MemoryRouter initialEntries={['/']}><AppHeaderSearchMain isMobileView={false} isFocused={true} /></MemoryRouter>
      </div>
    );
  });
