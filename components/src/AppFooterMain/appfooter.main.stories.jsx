import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppfooterMain from "./appfooter.main";

storiesOf('AppfooterMain', module)
  .add('AppfooterMain', () => <MemoryRouter initialEntries={['/']}><AppfooterMain /></MemoryRouter>);
