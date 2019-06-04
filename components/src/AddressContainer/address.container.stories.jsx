import React from 'react';
import {storiesOf} from '@storybook/react';

// Import custom required styles
import '../style/reset.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.less';

// Import custom required scripts
import 'bootstrap/dist/js/bootstrap.bundle.min';

import AddressContainer from './address.container';
const dataName = {
  "family-name": "family-name",
  "given-name": "given-name",
};
const dataAddress = {
  "country-name": "country-name",
  "extended-address": "extended-address",
  "locality": "locality",
  "organization": "organization",
  "phone-number": "phone-number",
  "postal-code": "postal-code",
  "region": "region",
  "street-address": "street-address",
};

storiesOf('AddressContainer', module)
  .add('AddressContainer', () => <AddressContainer name={dataName} address={dataAddress} />);
