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
import getSearchFromResponse from '../BloomreachSearchResultsItems/MockHttpResponses/GET/bloomreach_getKeywordSearch_response.json';
import { BloomreachKeywordSearchLookupResponse } from '../utils/Bloomreach/types/BloomreachSearchService';
import BloomreachProductListMain from './bloomreach.productlist.main';

storiesOf('BloomreachProductListMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('BloomreachProductListMain', () => {
      console.log('bloomreach product list main');
      const searchResultsModel: BloomreachKeywordSearchLookupResponse = getSearchFromResponse;
      const products = searchResultsModel.response ? searchResultsModel.response.docs : [];
      return <BloomreachProductListMain productData={products} showCompareButton={false}/>
});
