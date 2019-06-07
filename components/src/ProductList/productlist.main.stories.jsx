import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import productList from './MockHttpResponses/product_list_response'

import ProductListMain from './productlist.main';

// Option defaults.

const productLinks = {
  itemDetail: '/itemdetail',
  productsCompare: '/productscompare',
  productSearch: '/search',
  productCategory: '/category',
};

storiesOf('ProductListMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProductListMain', () => <ProductListMain productData={productList} productListLinks={productLinks} />);
