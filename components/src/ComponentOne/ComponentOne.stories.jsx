import React from 'react';
import {storiesOf} from '@storybook/react';

import ComponentOne from './ComponentOne';

storiesOf('ComponentOne', module)
  .add('Default', () => <ComponentOne />);
