import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppHeaderLoginMain from './appheaderlogin.main';

const appHeaderLoginLinks = {
  profile: '',
  wishlists: '',
};

const appModalLoginLinks = {
  registration: '',
};

storiesOf('AppHeaderLoginMain', module)
  .add('AppHeaderLocaleMain', () => {
    return (
      <div style={{'backgroundColor' : '#040060'}}>
        <MemoryRouter initialEntries={['/']}><AppHeaderLoginMain permission={false} appModalLoginLinks={appModalLoginLinks} appHeaderLoginLinks={appHeaderLoginLinks} isLoggedIn={false} disableLogin={true} /></MemoryRouter>
      </div>
    )
  }).add('AppHeaderLocaleMain Logged In User', () => {
    return (
      <div style={{'backgroundColor' : '#040060'}}>
        <MemoryRouter initialEntries={['/']}><AppHeaderLoginMain permission={false} appModalLoginLinks={appModalLoginLinks} appHeaderLoginLinks={appHeaderLoginLinks} isLoggedIn={true} disableLogin={true} /></MemoryRouter>
      </div>
    )
  });
