import React from 'react';
import {storiesOf} from '@storybook/react';

// Import custom required styles
import '../style/reset.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.less';

// Import custom required scripts
import 'bootstrap/dist/js/bootstrap.bundle.min';

import GdprSupportModal from './gdprsupport.main';

storiesOf('GdprSupportModal', module)
    .add('GdprSupportModal', () => <GdprSupportModal />);
