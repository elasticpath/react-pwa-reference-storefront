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
import productsData from './MockHttpResponses/GET/productData_response.json';

import ProductListLoadMore from './productlistloadmore';
import { mockProductListLoadMoreFromSearchResponse } from './productlistloadmore.api.mocks';
import { searchLookup } from '../utils/CortexLookup';

function handleDataChange(updateItems) {
  alert('handleDataChange called to update container items.  Check console to see the value that it is given.');
  console.log(updateItems);
}

storiesOf('Components|ProductListLoadMore', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProductListLoadMore', () => {
    mockProductListLoadMoreFromSearchResponse();
    return <ProductListLoadMore dataProps={productsData} handleDataChange={handleDataChange} onLoadMore={searchLookup} />;
  });
