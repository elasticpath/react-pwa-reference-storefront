import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import productsData from './MockHttpResponses/product_list_pagination_response.json'

import ProductListLoadMore from './productlistloadmore';

function handleDataChange(){}
function onLoadMore(){}

storiesOf('ProductListLoadMore', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProductListLoadMore', () => <ProductListLoadMore dataProps={productsData} handleDataChange={handleDataChange} onLoadMore={onLoadMore} />);
