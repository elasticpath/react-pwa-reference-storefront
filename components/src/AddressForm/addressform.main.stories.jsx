import React from 'react';
import { storiesOf } from '@storybook/react';
import { mockCountryDataAPI } from './addressform.main.api.mocks';

import AddressFormMain from './addressform.main';

const addressData = {
  address: "/addresses/vestri/test",
  returnPage: "/profile"
}

storiesOf('AddressFormMain', module)
  .add('AddressFormMain edit mode', () => {
    mockCountryDataAPI();
    return <AddressFormMain addressData={addressData}/>
  })
  .add('AddressFormMain', () => {
    mockCountryDataAPI();
    return <AddressFormMain />
  });
