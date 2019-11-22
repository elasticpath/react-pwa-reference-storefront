/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */
import React from 'react';
import Readme from './README.md';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { boolean } from "@storybook/addon-knobs/react";
import AppHeaderSearchMain from './appheadersearch.main';

storiesOf('Components|AppHeaderSearchMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .add('AppHeaderSearchMain', () => {
    return (
      <div style={{ backgroundColor: '#040060' }}>
        <MemoryRouter initialEntries={['/']}><AppHeaderSearchMain isMobileView={boolean('isMobileView', false)} isFocused={boolean('isFocused', true)} /></MemoryRouter>
      </div>
    )
  });
