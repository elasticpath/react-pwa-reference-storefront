import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import paginationDataProps from './MockHttpResponses/product_list_pagination_response'

import ProductListPagination from "./productlistpagination.main";

storiesOf('ProductListPagination', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProductListPagination', () => <ProductListPagination paginationDataProps={paginationDataProps} isProductoading={true} titleString={''} isTop productListPaginationLinks={{}} />);
