import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import profileData from './MockHttpResponses/cart_data_response';
import ProfileInfoMain from "./profileInfo.main";

function fetchProfileData(){}

storiesOf('ProfileInfoMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('ProfileInfoMain', () => <ProfileInfoMain profileInfo={profileData._defaultprofile[0]} onChange={fetchProfileData} />);
