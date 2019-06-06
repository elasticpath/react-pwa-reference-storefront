import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppModalLoginMain from './appmodallogin.main';

// Option defaults.

const appModalLoginLinks = {
  registration: '',
};

storiesOf('AppModalLoginMain', module)
  .add('AppModalLoginMain', () => {
    return (
      <div style={{'backgroundColor' : '#040060'}}>
        <MemoryRouter initialEntries={['/']}><AppModalLoginMain andleModalClose={() => {}} openModal={true} appModalLoginLinks={appModalLoginLinks} disableLogin={true} showForgotPasswordLink={false} /></MemoryRouter>
      </div>
    )
  });
