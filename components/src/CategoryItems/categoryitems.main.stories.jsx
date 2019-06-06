import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import CategoryItemsMain from './categoryitems.main';

// Option defaults.

const categoryProps = {
  match: {
    isExact: true,
    params: {
      id: "VESTRI_ACCESSORIES"
    },
    __proto__: Object,
    path: "/category/:id",
    url: "/category/VESTRI_ACCESSORIES",
  }
};

const productLinks = {
  itemDetail: '',
  productsCompare: '',
  productSearch: '',
  productCategory: '',
};

storiesOf('CategoryItemsMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('CategoryItemsMain', () => <CategoryItemsMain categoryProps={categoryProps} onProductFacetSelection={() => {}} productLinks={productLinks} />);
