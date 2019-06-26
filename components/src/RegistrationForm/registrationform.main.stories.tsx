import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import RegistrationFormMain from './registrationform.main';

function handleRegisterSuccess(){}

storiesOf('RegistrationFormMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('RegistrationFormMain', () => <RegistrationFormMain onRegisterSuccess={handleRegisterSuccess} />);
