import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import profileData from './MockHttpResponses/cart_data_response';
import ProfileemailinfoMain from "./profileemailinfo.main";

function fetchProfileData(){}

storiesOf('ProfileemailinfoMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('ProfileemailinfoMain', () => <ProfileemailinfoMain profileInfo={profileData._defaultprofile[0]} onChange={fetchProfileData} />);
