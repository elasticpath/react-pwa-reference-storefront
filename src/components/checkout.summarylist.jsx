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

const Config = require('Config');

class CheckoutSummaryList extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPromotions() {
    if (this.props.data._appliedpromotions) {
      return (
        <li className="cart-applied-promotions" data-region="cartAppliedPromotionsRegion">
          <label className="cart-summary-label-col">
Applied Promotions:&nbsp;
          </label>
          <br />
          {this.props.data._appliedpromotions[0]._element.map(promotion => (
            <span className="cart-summary-value-col cart-applied-promotions" key={promotion.name} data-el-value="checkout.appliedPromotions">&nbsp;&nbsp;
              {promotion['display-name']}
            </span>
          ))}
        </li>
      );
    }
  }

  renderDiscount() {
    if (this.props.data._discount) {
      return (
        <li className="cart-discount">
          <label className="cart-summary-label-col">
Today's Discount:&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {this.props.data._discount[0].discount[0].display}
          </span>
        </li>
      );
    }
  }

  renderShipping() {
    if (this.props.data._order && this.props.data._order[0]._deliveries && this.props.data._order[0]._deliveries[0]._element[0]._shippingoptioninfo) {
      return (
        <li className="checkout-shipping">
          <div data-region="checkoutShippingTotalRegion" style={{ display: 'block' }}>
            <div className="checkout-shipping-total">
              <label data-el-label="checkout.shippingTotal">
Today's Shipping Cost:&nbsp;
              </label>
              <span data-el-value="checkout.shippingTotal">
                {this.props.data._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._selector[0]._chosen[0]._description[0].cost[0].display}
              </span>
            </div>
          </div>
        </li>
      );
    }
  }

  renderTax() {
    if (this.props.data._order && this.props.data._order[0]._tax[0].cost.length) {
      return (
        <li className="checkout-tax" data-el-container="checkout.taxes">
          <div data-region="checkoutTaxTotalRegion" style={{ display: 'block' }}>
            <div className="checkout-tax-total">
              <label data-el-label="checkout.taxTotal">
Today's Taxes:&nbsp;
              </label>
              <span data-el-value="checkout.taxTotal">
                {this.props.data._order[0]._tax[0].total.display}
              </span>
            </div>
          </div>
          <div data-region="checkoutTaxBreakDownRegion" style={{ display: 'block' }}>
            <ul className="checkout-tax-list">
              {this.props.data._order[0]._tax[0].cost.map(tax => (
                <li className="checkout-tax" key={tax.title}>
                  <label data-el-label="checkout.tax">
                    {tax.title}
:&nbsp;
                  </label>
                  <span data-el-value="checkout.tax">
                    {tax.display}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      );
    }
  }

  renderCheckoutTotal() {
    if (this.props.data._order) {
      return (
        <li className="checkout-total">
          <label data-el-label="checkout.total">
Today's Total:&nbsp;
          </label>
          <span data-el-value="checkout.total">
            {this.props.data._order[0]._total[0].cost[0].display}
          </span>
        </li>
      );
    }
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div className="loader" />
      );
    }
    return (
      <ul className="cart-summary-list">
        <li className="cart-total-quantity">
          <label className="cart-summary-label-col">
Total Quantity:&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {this.props.data['total-quantity']}
          </span>
        </li>
        {this.renderPromotions()}
        <li className="cart-subtotal">
          <label className="cart-summary-label-col">
Today's Subtotal:&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {this.props.data._total[0].cost[0].display}
          </span>
        </li>
        {this.renderDiscount()}
        {this.renderShipping()}
        {this.renderTax()}
        {this.renderCheckoutTotal()}
      </ul>
    );
  }
}

export default CheckoutSummaryList;
