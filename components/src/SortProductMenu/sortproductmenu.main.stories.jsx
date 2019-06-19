import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import categoryModel from './MockHttpResponses/sort_category_model_response'

import SortProductMenu from "./sortproductmenu.main";

function handleSortSelection(){}

storiesOf('SortProductMenu', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('SortProductMenu', () => <SortProductMenu handleSortSelection={handleSortSelection} categoryModel={categoryModel} />);
