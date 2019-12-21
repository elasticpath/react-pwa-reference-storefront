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
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { object, text } from '@storybook/addon-knobs/react';
import Readme from './README.md';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';
import AddPromotionContainer from './add.promotion.container';

const cartData = {
  _order: [
    {
      _couponinfo: [
        {
          _couponform: [
            {
              links: [
                {
                  rel: 'applycouponaction',
                  type: 'coupons.apply-coupon-to-order-form',
                  uri: '/coupons/orders/vestri/gq2dezrsmrsdgljsmm3wiljuhfrtqllbhfqwmljtgyydcnrsgbqtizrwmu=/form',
                  href: 'http://reference.epdemos.com/cortex/coupons/orders/vestri/gq2dezrsmrsdgljsmm3wiljuhfrtqllbhfqwmljtgyydcnrsgbqtizrwmu=/form',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

storiesOf('Components|AddPromotionContainer', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AddPromotionContainer', () => {
    let onSubmittedPromotionFuncText = text('onSubmittedPromotion','() => {alert("onSubmitPromotion invoked")}');
    return <AddPromotionContainer data={object('data', cartData)} onSubmittedPromotion={()=>textToFunc(onSubmittedPromotionFuncText)} />
  });
