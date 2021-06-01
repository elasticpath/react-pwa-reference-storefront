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
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import Readme from './README.md';
import TabSelection from './tabselection.main';

function renderData() {
  return ([
    <div>Tab data1</div>,
    <div>Tab data2</div>,
    <div>Tab data3</div>,
  ]);
}

function onSelectTab(index) {
  return index;
}

const tabs = ['Tab1', 'Tab2', 'Tab3'];

storiesOf('Components|TabSelection', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('TabSelection', () => (
    <TabSelection tabs={tabs} data={renderData()} onSelectTab={index => onSelectTab(index)} />
  ));
