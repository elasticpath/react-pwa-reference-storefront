import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import productData from './MockHttpResponses/featured_products_response'

import FeaturedProducts from "./featuredproducts.main";

storiesOf('FeaturedProducts', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('FeaturedProducts', () => <FeaturedProducts productData={productData} itemDetailLink={''} />);
