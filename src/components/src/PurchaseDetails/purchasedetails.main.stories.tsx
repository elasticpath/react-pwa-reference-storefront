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

import PurchaseDetailsMain from './purchasedetails.main';
import purchaseDetail from './MockHttpResponses/purchase_detail_response.json';
import { text, object } from "@storybook/addon-knobs/react";
import { textToFunc } from '../../../../storybook/utils/storybookUtils';

const itemDetailLink = '/';

storiesOf('Components|PurchaseDetailsMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .add('PurchaseDetailsMain', () => {
    let onReorderAllProductsFuncText = text('onReorderAllProducts', '() => {alert("onReorderAllProducts invoked")}');
    return(<PurchaseDetailsMain data={object('purchaseDetail', purchaseDetail)} onReorderAllProducts={()=>{textToFunc(onReorderAllProductsFuncText)}} itemDetailLink={object('itemDetailLink', itemDetailLink)} />);
  });
