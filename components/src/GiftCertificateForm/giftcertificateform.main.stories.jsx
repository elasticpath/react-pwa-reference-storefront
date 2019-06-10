import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import GiftcertificateFormMain from "./giftcertificateform.main";

storiesOf('GiftcertificateFormMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('GiftcertificateFormMain', () => <GiftcertificateFormMain updateCertificate={() => {}} />);
