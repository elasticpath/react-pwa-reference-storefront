import React from 'react';
import { storiesOf } from '@storybook/react';
import { mockAddressFormSubmitSuccess, mockAddressFormSubmitFailure } from './addressform.main.api.mocks';

import AddressFormMain from './addressform.main';

storiesOf('AddressFormMain', module)
  .add('AddressFormMain edit mode', () => {
    mockAddressFormSubmitSuccess();
    const addressData = {
      address: '/addresses/vestri_b2c',
      returnPage: '/profile'
    }
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
