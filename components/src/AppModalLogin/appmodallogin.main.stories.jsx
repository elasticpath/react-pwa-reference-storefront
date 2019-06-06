import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppModalLoginMain from './appmodallogin.main';

// Option defaults.

const appModalLoginLinks = {
  registration: '',
};

storiesOf('AppModalLoginMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppModalLoginMain', () => <AppModalLoginMain andleModalClose={() => {}} openModal={true} appModalLoginLinks={appModalLoginLinks} disableLogin={true} showForgotPasswordLink={false} />);
