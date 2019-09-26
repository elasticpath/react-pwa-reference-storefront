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

import BloomreachSearchResultsItemsMain from './bloomreach.searchresultsitems.main';

import { mockSearchResults } from './bloomreach.searchresultsitems.main.mock.api';

function handleProductFacetSelection() {}
const props = {
  match: {
    isExact: true,
    params: {
      keywords: 'x-class',
    }
  },
  location: {
    search: null
  }
};
const productLinks = {};

storiesOf('BloomreachSearchResultsItemsMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('BloomreachSearchResultsItemsMain', () => {
    mockSearchResults();
    return <BloomreachSearchResultsItemsMain
      searchKeywordsProps={props}
      onProductFacetSelection={handleProductFacetSelection}
      productLinks={productLinks}
    />;
  });
