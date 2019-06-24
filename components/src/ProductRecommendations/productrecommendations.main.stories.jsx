import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import productData from './MockHttpResponses/bundle_constituents_response';

import ProductRecommendationsDisplayMain from "./productrecommendations.main";

storiesOf('ProductRecommendationsDisplayMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('ProductRecommendationsDisplayMain', () => <ProductRecommendationsDisplayMain productData={productData} />);
