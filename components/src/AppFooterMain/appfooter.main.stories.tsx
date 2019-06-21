import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppFooterMain from "./appfooter.main";

const appFooterLinks = {
  aboutus: '',
  contactus: '',
  shippingreturns: '',
  termsandconditions: '',
  shareFacebook: '',
  shareTwitter: '',
  shareInstagram: '',
};

storiesOf('AppFooterMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppFooterMain', () => <AppFooterMain appFooterLinks={appFooterLinks} />);
