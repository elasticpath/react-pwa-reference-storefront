import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppHeaderTop from './appheadertop.main';

const appHeaderTopLinks = {
  shippingreturns: '',
  aboutus: '',
  contactus: '',
};

storiesOf('AppHeaderTop', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppHeaderTop', () => {
    return (
        <AppHeaderTop isMobileView={false} appHeaderTopLinks={appHeaderTopLinks}/>
  );
  });
