import React from 'react';
import { storiesOf } from '@storybook/react';

import FacebookChat from './facebookchat.main';
import { getConfig } from '../utils/ConfigProvider';

let Config:any = {};
const epConfig = getConfig();
Config = epConfig.config;

storiesOf('FacebookChat', module)
  .add('FacebookChat', () => {
    return (
        <FacebookChat config={Config.facebook} />
      );
  });
