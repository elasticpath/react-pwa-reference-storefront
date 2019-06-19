import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppHeaderMain from './appheader.main';

const appHeaderLinks = {
  mainPage: '',
  myBag: '',
};
const appHeaderLoginLinks = {
  profile: '',
  wishlists: '',
};
const appHeaderNavigationLinks = {
  categories: '',
  subCategories: '',
};
const appHeaderTopLinks = {
  shippingreturns: '',
  aboutus: '',
  contactus: '',
};
const appModalLoginLinks = {
  registration: '',
};

storiesOf('AppHeaderMain', module)
  .add('AppHeaderMain', () => {
    return (
      <MemoryRouter initialEntries={['/']}><AppHeaderMain appHeaderLinks={appHeaderLinks} appHeaderLoginLinks={appHeaderLoginLinks} appHeaderNavigationLinks={appHeaderNavigationLinks} appHeaderTopLinks={appHeaderTopLinks} appModalLoginLinks={appModalLoginLinks} /></MemoryRouter>
  );
  });
