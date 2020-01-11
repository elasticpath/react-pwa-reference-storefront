/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */
import React from 'react';
import Readme from './README.md';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import purchaseDetail from './MockHttpResponses/cart_data_response.json';
import SearchFacetNavigationMain from './searchfacetnavigation.main';

import { text, object } from "@storybook/addon-knobs/react";
import { textToFunc } from "../../../../storybook/utils/storybookUtils";

storiesOf('Components|SearchFacetNavigationMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('SearchFacetNavigationMain', () => { 
    let onFacetSelectionFuncText = text('onFacetSelection', '() => {alert("onFacetSelection invoked")}');
    return (<SearchFacetNavigationMain onFacetSelection={()=>{textToFunc(onFacetSelectionFuncText)}} productData={object('purchaseDetail', purchaseDetail)} />);
  });
