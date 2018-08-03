/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'total',
  'discount',
  'appliedpromotions:element',
  'lineitems:element',
  'lineitems:element:total',
  'lineitems:element:price',
  'lineitems:element:availability',
  'lineitems:element:appliedpromotions:element',
  'lineitems:element:item',
  'lineitems:element:item:code',
  'lineitems:element:item:definition',
  'lineitems:element:item:definition:options:element',
  'lineitems:element:item:definition:options:element:value',
  'lineitems:element:item:definition:options:element:selector:choice',
  'lineitems:element:item:definition:options:element:selector:chosen',
  'lineitems:element:item:definition:options:element:selector:choice:description',
  'lineitems:element:item:definition:options:element:selector:chosen:description',
  'lineitems:element:item:definition:options:element:selector:choice:selector',
  'lineitems:element:item:definition:options:element:selector:chosen:selector',
  'lineitems:element:item:definition:options:element:selector:choice:selectaction',
  'lineitems:element:item:definition:options:element:selector:chosen:selectaction',
];

class OrderHistoryLineMain extends React.Component {
  static propTypes = {
    orderHistoryLineUrlProps: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      orderModel: { links: [] },
    };
  }

  componentDidMount() {
    const { orderHistoryLineUrlProps } = this.props;
    login().then(() => {
      cortexFetch(`${orderHistoryLineUrlProps}?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            orderModel: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  renderPromotions() {
    const { orderModel } = this.state;
    if (orderModel._appliedpromotions) {
      return (
        <li className="cart-applied-promotions" data-region="cartAppliedPromotionsRegion">
          <label htmlFor="cart_summary_promotions_label" className="cart-summary-label-col">
            {intl.get('applied-promotions')}
            :&nbsp;
          </label>
          <br />
          {orderModel._appliedpromotions[0]._element.map(promotion => (
            <span className="cart-summary-value-col cart-applied-promotions" key={promotion.name} data-el-value="checkout.appliedPromotions">&nbsp;&nbsp;
              {promotion['display-name']}
            </span>
          ))}
        </li>
      );
    }
    return null;
  }

  renderDiscount() {
    const { orderModel } = this.state;
    if (orderModel._discount) {
      return (
        <li className="cart-discount">
          <label htmlFor="cart_summary_discount_label" className="cart-summary-label-col">
            {intl.get('todays-discount')}
            :&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {orderModel._discount[0].discount[0].display}
          </span>
        </li>
      );
    }
    return null;
  }

  renderShipping() {
    const { orderModel } = this.state;
    if (orderModel._order && orderModel._order[0]._deliveries && orderModel._order[0]._deliveries[0]._element[0]._shippingoptioninfo) {
      return (
        <li className="checkout-shipping">
          <div data-region="checkoutShippingTotalRegion" style={{ display: 'block' }}>
            <div className="checkout-shipping-total">
              <label htmlFor="cart_summary_shipping_label" data-el-label="checkout.shippingTotal">
                {intl.get('todays-shipping-cost')}
                :&nbsp;
              </label>
              <span data-el-value="checkout.shippingTotal">
                {orderModel._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._selector[0]._chosen[0]._description[0].cost[0].display}
              </span>
            </div>
          </div>
        </li>
      );
    }
    return null;
  }

  renderTax() {
    const { orderModel } = this.state;
    if (orderModel && orderModel['tax-total']) {
      return (
        <li className="checkout-tax" data-el-container="checkout.taxes">
          <div data-region="checkoutTaxTotalRegion" style={{ display: 'block' }}>
            <div className="checkout-tax-total">
              <label htmlFor="cart_summary_tax_total_label" data-el-label="checkout.taxTotal">
                {intl.get('todays-taxes')}
                :&nbsp;
              </label>
              <span data-el-value="checkout.taxTotal">
                {orderModel['tax-total'].display}
              </span>
            </div>
          </div>
        </li>
      );
    }
    return null;
  }

  renderCheckoutTotal() {
    const { orderModel } = this.state;
    if (orderModel._order) {
      return (
        <li className="checkout-total">
          <label htmlFor="cart_summary_total_label" data-el-label="checkout.total">
            {intl.get('todays-total')}
          </label>
          <span data-el-value="checkout.total">
            {orderModel['monetary-total'][0].display}
          </span>
        </li>
      );
    }
    return null;
  }

  render() {
    const { orderModel } = this.state;
    if (orderModel.links.length > 0) {
      return (
        <ul className="cart-summary-list">
          {this.renderPromotions()}
          <li className="cart-subtotal">
            <label htmlFor="cart_summary_subtotal_label" className="cart-summary-label-col">
              {intl.get('todays-subtotal')}
              :&nbsp;
            </label>
            <span className="cart-summary-value-col">
              {orderModel['monetary-total'][0].display}
            </span>
          </li>
          {this.renderDiscount()}
          {this.renderShipping()}
          {this.renderTax()}
          {this.renderCheckoutTotal()}
        </ul>
      );
    }
    return (<div className="loader" />);
  }
}

export default OrderHistoryLineMain;
