import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppHeaderNavigationMain from './appheadernavigation.main';

function handleIsOffline(isOfflineValue) {
  this.setState({
    isOffline: isOfflineValue,
  });
}

storiesOf('AppHeaderNavigationMain', module)
  .add('AppHeaderNavigationMain', () => {
    return (
      <div style={{'backgroundColor':'#040060'}}>
        <MemoryRouter initialEntries={['/']}><AppHeaderNavigationMain isMobileView={false} isOffline={false} isOfflineCheck={handleIsOffline} /></MemoryRouter>
      </div>
    );
  });
