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
import { text } from '@storybook/addon-knobs';
import Readme from './README.md';
import Pagination from './pagination';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';

const onPageChange = text('onPageChange', '() => {alert("onPageChange invoked")}');

storiesOf('Components|Pagination', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Pagination', () => {
    const next = [{
      self: {
        uri: '',
      },
    }];
    const pagination = {
      current: 1,
      'page-size': 25,
      pages: 4,
      results: 100,
      'results-on-page': 25,
    };
    return (<Pagination pagination={pagination} onPageChange={() => { textToFunc(onPageChange); }} next={next} />);
  });
