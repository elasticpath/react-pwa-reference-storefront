import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import product from './MockHttpResponses/product_list_item_response'

import ProductListItemMain from './productlistitem.main';


storiesOf('ProductListItemMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProductListItemMain', () => <ProductListItemMain offerData={product} itemDetailLink='' />);
