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
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppHeaderLocaleMain', () => {
    return (
      <div style={{'backgroundColor' : '#040060'}}>
        <AppHeaderLoginMain permission={false} appModalLoginLinks={appModalLoginLinks} appHeaderLoginLinks={appHeaderLoginLinks} isLoggedIn={false} disableLogin={true} />
      </div>
    )
  }).add('AppHeaderLocaleMain Logged In User', () => {
    return (
      <div style={{'backgroundColor' : '#040060'}}>
        <AppHeaderLoginMain permission={false} appModalLoginLinks={appModalLoginLinks} appHeaderLoginLinks={appHeaderLoginLinks} isLoggedIn={true} disableLogin={true} />
      </div>
    )
  });
