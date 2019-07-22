import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import productsData from './MockHttpResponses/GET/productData_response.json';

import ProductListLoadMore from './productlistloadmore';
import { mockProductListLoadMoreFromSearchResponse } from './productlistloadmore.api.mocks';
import { searchLookup } from '../utils/CortexLookup';

function handleDataChange(updateItems){
  alert(`handleDataChange called to update container items.  Check console to see the value that it is given.`);
  console.log(updateItems);
}

storiesOf('ProductListLoadMore', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProductListLoadMore', () => {
    mockProductListLoadMoreFromSearchResponse();
    return <ProductListLoadMore dataProps={productsData} handleDataChange={handleDataChange} onLoadMore={searchLookup} />
});
