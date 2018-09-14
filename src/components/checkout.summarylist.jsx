/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import './checkout.summarylist.less';

class CheckoutSummaryList extends React.Component {
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  renderPromotions() {
    const { data } = this.props;
    if (data._appliedpromotions) {
      return (
        <li className="cart-applied-promotions" data-region="cartAppliedPromotionsRegion">
          <label htmlFor="cart-applied-promotions" className="cart-summary-label-col">
            {intl.get('applied-promotions')}
            :&nbsp;
          </label>
          <br />
          {data._appliedpromotions[0]._element.map(promotion => (
            <span className="cart-summary-value-col cart-applied-promotions" key={promotion.name}>&nbsp;&nbsp;
              {promotion['display-name']}
            </span>
          ))}
        </li>
      );
    }
    return null;
  }

  renderDiscount() {
    const { data } = this.props;
    if (data._discount) {
      return (
        <li className="cart-discount">
          <label htmlFor="cart-summary-value-col" className="cart-summary-label-col">
            {intl.get('todays-discount')}
            :&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {data._discount[0].discount[0].display}
          </span>
        </li>
      );
    }
    return null;
  }

  renderShipping() {
    const { data } = this.props;
    if (data._order && data._order[0]._deliveries && data._order[0]._deliveries[0]._element[0]._shippingoptioninfo) {
      return (
        <li className="checkout-shipping">
          <div data-region="checkoutShippingTotalRegion" style={{ display: 'block' }}>
            <div className="checkout-shipping-total">
              <label htmlFor="checkout-shipping-total">
                {intl.get('todays-shipping-cost')}
                :&nbsp;
              </label>
              <span>
                {data._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption[0].cost[0].display}
              </span>
            </div>
          </div>
        </li>
      );
    }
    return null;
  }

  renderTax() {
    const { data } = this.props;
    if (data._order && data._order[0]._tax[0].cost.length) {
      return (
        <li className="checkout-tax">
          <div data-region="checkoutTaxTotalRegion" style={{ display: 'block' }}>
            <div className="checkout-tax-total">
              <label htmlFor="checkout-tax-total">
                {intl.get('todays-taxes')}
                :&nbsp;
              </label>
              <span>
                {data._order[0]._tax[0].total.display}
              </span>
            </div>
          </div>
          <div data-region="checkoutTaxBreakDownRegion" style={{ display: 'block' }}>
            <ul className="checkout-tax-list">
              {data._order[0]._tax[0].cost.map(tax => (
                <li className="checkout-tax" key={tax.title}>
                  <label htmlFor="checkout-tax">
                    {tax.title}
                    :&nbsp;
                  </label>
                  <span>
                    {tax.display}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      );
    }
    return null;
  }

  renderCheckoutTotal() {
    const { data } = this.props;
    if (data._order) {
      return (
        <li className="checkout-total">
          <label htmlFor="checkout-total">
            {intl.get('todays-total')}
            :&nbsp;
          </label>
          <span data-el-value="checkout.total">
            {data._order[0]._total[0].cost[0].display}
          </span>
        </li>
      );
    }
    return null;
  }

  render() {
    const { data } = this.props;
    return (
      <ul className="cart-summary-list">
        <li className="cart-total-quantity">
          <label htmlFor="cart-summary-value-col" className="cart-summary-label-col">
            {intl.get('total-quantity')}
            :&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {data['total-quantity']}
          </span>
        </li>
        {this.renderPromotions()}
        <li className="cart-subtotal">
          <label htmlFor="cart-summary-value-col" className="cart-summary-label-col">
            {intl.get('todays-subtotal')}
            :&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {data._total[0].cost[0].display}
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
