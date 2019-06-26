import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import productData from './MockHttpResponses/bundle_constituents_response.json';

import BundleConstituentsDisplayMain from './bundleconstituents.main';

storiesOf('BundleConstituentsDisplayMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('BundleConstituentsDisplayMain', () => <BundleConstituentsDisplayMain productData={productData} itemDetailLink={''} />);
