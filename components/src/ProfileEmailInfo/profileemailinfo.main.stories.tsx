import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import profileData from '../CommonMockHttpResponses/profile_data_response.json';
import ProfileemailinfoMain from './profileemailinfo.main';

function fetchProfileData(){}

storiesOf('ProfileemailinfoMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('ProfileemailinfoMain', () => <ProfileemailinfoMain profileInfo={profileData._defaultprofile[0]} onChange={fetchProfileData} />);
