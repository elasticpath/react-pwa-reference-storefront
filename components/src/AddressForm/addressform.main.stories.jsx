import React from 'react';
import {storiesOf} from '@storybook/react';
// import { mockCountryDataAPI } from './addressform.main.api.mocks';


// Import custom required styles
import '../style/reset.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.less';

// Import custom required scripts
import 'bootstrap/dist/js/bootstrap.bundle.min';

import AddressFormMain from './addressform.main';

storiesOf('AddressFormMain', module)
  .add('AddressFormMain', () => {
    // mockCountryDataAPI();
    return <AddressFormMain />
  });
