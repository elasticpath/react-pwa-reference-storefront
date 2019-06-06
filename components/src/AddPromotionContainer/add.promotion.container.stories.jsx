import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AddPromotionContainer from "./add.promotion.container";

const cartData = {
    "_order": [
    {
      "_couponinfo": [
        {
          "_couponform": [
            {
              "links": [
                {
                  "rel": "applycouponaction",
                  "type": "coupons.apply-coupon-to-order-form",
                  "uri": "/coupons/orders/vestri/gq2dezrsmrsdgljsmm3wiljuhfrtqllbhfqwmljtgyydcnrsgbqtizrwmu=/form",
                  "href": "http://reference.epdemos.com/cortex/coupons/orders/vestri/gq2dezrsmrsdgljsmm3wiljuhfrtqllbhfqwmljtgyydcnrsgbqtizrwmu=/form"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

storiesOf('AddPromotionContainer', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AddPromotionContainer', () => <AddPromotionContainer data={cartData} />);
