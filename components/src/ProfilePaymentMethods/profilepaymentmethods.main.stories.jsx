import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import profileData from './MockHttpResponses/cart_data_response';
import ProfilePaymentMethodsMain from "./profilepaymentmethods.main";

function fetchProfileData(){}
function handleNewPayment(){}

storiesOf('ProfilePaymentMethodsMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('ProfilePaymentMethodsMain', () => <ProfilePaymentMethodsMain paymentMethods={profileData._defaultprofile[0]._paymentmethods[0]} onChange={fetchProfileData} onAddNewPayment={handleNewPayment} />);
