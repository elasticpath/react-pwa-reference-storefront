import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import crosssellProductData from './MockHttpResponses/GET/crosssell_response.json';

import ProductRecommendationsDisplayMain from './productrecommendations.main';

storiesOf('ProductRecommendationsDisplayMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProductRecommendationsDisplayMain', () => <ProductRecommendationsDisplayMain productData={crosssellProductData} />);
  