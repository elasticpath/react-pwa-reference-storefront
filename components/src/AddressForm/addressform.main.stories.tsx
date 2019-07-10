import React from 'react';
import { storiesOf } from '@storybook/react';
import { mockAddressFormSubmitSuccess, mockAddressFormSubmitFailure } from './addressform.main.api.mocks';

import AddressFormMain from './addressform.main';

const addressData = {
  address: '/addresses/vestri_b2c',
  returnPage: '/profile'
}

storiesOf('AddressFormMain', module)
  .add('AddressFormMain edit mode', () => {
    mockAddressFormSubmitSuccess();
    return <AddressFormMain addressData={addressData}/>
  })
  .add('AddressFormMain Submit Success', () => {
    mockAddressFormSubmitSuccess();
    return <AddressFormMain />
  })
  .add('AddressFormMain Submit Failure', () => {
    mockAddressFormSubmitFailure();
    return <AddressFormMain />
  });
