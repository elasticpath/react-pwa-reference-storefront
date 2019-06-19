import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import productData from './MockHttpResponses/bundle_constituents_response';

import QuickOrderForm from "./quickorderform";
function onItemSubmit(){}

storiesOf('QuickOrderForm', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('QuickOrderForm', () => <QuickOrderForm item={productData} onItemSubmit={onItemSubmit} />);
