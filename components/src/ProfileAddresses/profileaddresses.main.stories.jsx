import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import profileData from './MockHttpResponses/cart_data_response';
import ProfileAddressesMain from "./profileaddresses.main";

function fetchProfileData(){}
function handleNewAddress(){}
function handleEditAddress(){}

storiesOf('ProfileAddressesMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('ProfileAddressesMain', () => <ProfileAddressesMain addresses={profileData._defaultprofile[0]._addresses[0]} onChange={fetchProfileData} onAddNewAddress={handleNewAddress} onEditAddress={handleEditAddress} />);
