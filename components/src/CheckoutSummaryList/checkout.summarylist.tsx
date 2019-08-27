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
import { withRouter } from 'react-router';
import * as cortex from '@elasticpath/cortex-client';
import { ClientContext } from '../ClientContext';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import './checkout.summarylist.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface CheckoutSummaryListProps {
    data: {
        [key: string]: any
    },
    giftCards?: any[],
    onChange?: (...args: any[]) => any,
}
class CheckoutSummaryList extends React.Component<CheckoutSummaryListProps> {
  static contextType = ClientContext;

  client: cortex.IClient;

  static defaultProps = {
    giftCards: [],
    onChange: () => {},
  }

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
  }

  async componentDidMount() {
    this.client = this.context;
  }

  async deletePromotionCode(link) {
    const { onChange } = this.props;

    try {
      await this.client.couponinfo(link).delete();
      onChange();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  renderCoupons() {
    const { data } = this.props;
    if (data.order && data.order.couponinfo && data.order.couponinfo.coupon) {
      return (
        <li className="cart-coupons" data-region="cartAppliedPromotionsRegion">
          <label htmlFor="cart-applied-promotions" className="cart-summary-label-col">
            {intl.get('applied-coupons')}
            :&nbsp;
          </label>
          <br />
          <div className="promotions-table">
            <div className="row">
              <div className="col-6 promotion-display">
                {data.order.couponinfo.coupon.code}
              </div>
              <div className="col-6 promotion-remove">
                <button type="button" className="cart-remove-promotion" onClick={() => { this.deletePromotionCode(data.order.couponinfo.coupon.uri); }} data-actionlink="">
                  {intl.get('remove')}
                </button>
              </div>
            </div>
          </div>
        </li>
      );
    }
    return null;
  }

  renderPromotions() {
    const { data } = this.props;
    if (data.appliedpromotions) {
      return (
        <li className="cart-applied-promotions" data-region="cartAppliedPromotionsRegion">
          <label htmlFor="cart-applied-promotions" className="cart-summary-label-col">
            {intl.get('applied-promotions')}
            :&nbsp;
          </label>
          <br />
          {data.appliedpromotions.elements.map(promotion => (
            <span className="cart-summary-value-col cart-applied-promotions" key={promotion.name}>
              {(promotion.displayName)
                ? (promotion.displayName)
                : (promotion.name)
              }
            </span>
          ))}
        </li>
      );
    }
    return null;
  }

  renderDiscount() {
    const { data } = this.props;
    if (data.discount) {
      return (
        <li className="cart-discount">
          <label htmlFor="cart-summary-value-col" className="cart-summary-label-col">
            {intl.get('todays-discount')}
            :&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {data.discount.discount[0].display}
          </span>
        </li>
      );
    }
    return null;
  }

  renderShipping() {
    const { data } = this.props;
    if (data.order && data.order.deliveries && data.order.deliveries.elements[0].shippingoptioninfo) {
      const shippingOption = (data.order.deliveries.elements[0].shippingoptioninfo.shippingoption) ? (data.order.deliveries.elements[0].shippingoptioninfo.shippingoption.cost[0].display) : ('');
      return (
        <li className="checkout-shipping">
          <div data-region="checkoutShippingTotalRegion" style={{ display: 'block' }}>
            <div className="checkout-shipping-total">
              <label className="cart-summary-label-col" htmlFor="checkout-shipping-total">
                {intl.get('todays-shipping-cost')}
                :&nbsp;
              </label>
              <span>
                {shippingOption}
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
    if (data.order && data.order.tax && data.order.tax.cost.length) {
      return (
        <li className="checkout-tax">
          <div data-region="checkoutTaxTotalRegion" style={{ display: 'block' }}>
            <div className="checkout-tax-total">
              <label className="cart-summary-label-col" htmlFor="checkout-tax-total">
                {intl.get('todays-taxes')}
                :&nbsp;
              </label>
              <span>
                {data.order.tax.total.display}
              </span>
            </div>
          </div>
          <div data-region="checkoutTaxBreakDownRegion" style={{ display: 'block' }}>
            <ul className="checkout-tax-list">
              {data.order.tax.cost.map(tax => (
                <li className="checkout-tax" key={tax.title}>
                  <label className="cart-summary-label-col" htmlFor="checkout-tax">
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
    const { data, giftCards } = this.props;
    const giftCardsAmount = giftCards.map(el => el.balance).reduce((total, amount) => total + amount, 0);
    if (data.order && data.order.total) {
      return (
        <li className="checkout-total">
          <label className="cart-summary-label-col" htmlFor="checkout-total">
            {intl.get('todays-total')}
            :&nbsp;
          </label>
          <span data-el-value="checkout.total">
            {giftCardsAmount > 0 ? `$${Math.max(0, data.order.total.cost[0].amount - giftCardsAmount)}` : data.order.total.cost[0].display}
          </span>
        </li>
      );
    }
    return null;
  }

  renderChosenGiftCardsTotal() {
    const { data, giftCards } = this.props;
    const giftCardsAmount = giftCards.map(el => el.balance).reduce((total, amount) => total + amount, 0);
    if (giftCardsAmount > 0) {
      return (
        <li className="gift-card">
          <label className="cart-summary-label-col" htmlFor="gift-card-total">
            {intl.get('gift-card')}
            :&nbsp;
          </label>
          <span data-el-value="gift-card.total">
            $
            {giftCardsAmount}
            &nbsp;
             -
            &nbsp;
            {data.order.total.cost[0].display}
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
            {data.totalQuantity}
          </span>
        </li>
        {this.renderPromotions()}
        {this.renderCoupons()}
        <li className="cart-subtotal">
          <label htmlFor="cart-summary-value-col" className="cart-summary-label-col">
            {intl.get('todays-subtotal')}
            :&nbsp;
          </label>
          <span className="cart-summary-value-col">
            {data.total.cost[0].display}
          </span>
        </li>
        {this.renderDiscount()}
        {this.renderShipping()}
        {this.renderTax()}
        {this.renderChosenGiftCardsTotal()}
        {this.renderCheckoutTotal()}
      </ul>
    );
  }
}

export default withRouter(CheckoutSummaryList);
