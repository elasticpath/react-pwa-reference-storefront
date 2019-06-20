import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppfooterMain from "./appfooter.main";

const appFooterLinks = {
  aboutus: '',
  contactus: '',
  shippingreturns: '',
  termsandconditions: '',
  shareFacebook: '',
  shareTwitter: '',
  shareInstagram: '',
};

storiesOf('AppfooterMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppfooterMain', () => <AppfooterMain appFooterLinks={appFooterLinks} />);
