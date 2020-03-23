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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import './checkout.summarylist.less';

let Config: IEpConfig | any = {};

interface CheckoutSummaryListProps {
  /** cart data */
  data: {
    [key: string]: any
  },
  /** gift cards */
  giftCards?: any[],
  /** handle change */
  onChange?: (...args: any[]) => any,
}

class CheckoutSummaryList extends Component<CheckoutSummaryListProps> {
  static defaultProps = {
    giftCards: [],
    onChange: () => {},
  }

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
  }

  deletePromotionCode(link) {
    login().then(() => {
      cortexFetch(link, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        const { onChange } = this.props;
        onChange();
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  renderCoupons() {
    const { data } = this.props;
    if (data._order && data._order[0] && data._order[0]._couponinfo[0]._coupon) {
      return (
        <li className="cart-coupons" data-region="cartAppliedPromotionsRegion">
          <label htmlFor="cart-applied-promotions" className="cart-summary-label-col">
            {intl.get('applied-coupons')}
            :&nbsp;
          </label>
          <br />
          {data._order[0]._couponinfo[0]._coupon.map(coupon => (
            <div className="promotions-table" key={coupon.code}>
              <div className="row">
                <div className="col-6 promotion-display">
                  {coupon.code}
                </div>
                <div className="col-6 promotion-remove">
                  <button type="button" className="cart-remove-promotion" onClick={() => { this.deletePromotionCode(coupon.self.uri); }} data-actionlink="">
                    {intl.get('remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </li>
      );
    }
    return null;
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
            <span className="cart-summary-value-col cart-applied-promotions" key={promotion.name}>
              {(promotion['display-name'])
                ? (promotion['display-name'])
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
      const shippingOption = (data._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption) ? (data._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption[0].cost[0].display) : ('');
      return (
        <li className="checkout-shipping">
          <div data-region="checkoutShippingTotalRegion">
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
    if (data._order && data._order[0]._tax && data._order[0]._tax[0].cost.length) {
      return (
        <li className="checkout-tax">
          <div data-region="checkoutTaxTotalRegion">
            <div className="checkout-tax-total">
              <label className="cart-summary-label-col" htmlFor="checkout-tax-total">
                {intl.get('todays-taxes')}
                :&nbsp;
              </label>
              <span>
                {data._order[0]._tax[0].total.display}
              </span>
            </div>
          </div>
          <div data-region="checkoutTaxBreakDownRegion">
            <ul className="checkout-tax-list">
              {data._order[0]._tax[0].cost.map(tax => (
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
    if (data._order && data._order[0]._total) {
      return (
        <li className="checkout-total">
          <label className="cart-summary-label-col" htmlFor="checkout-total">
            {intl.get('todays-total')}
            :&nbsp;
          </label>
          <span data-el-value="checkout.total">
            {giftCardsAmount > 0 ? `$${Math.max(0, data._order[0]._total[0].cost[0].amount - giftCardsAmount).toFixed(2)}` : data._order[0]._total[0].cost[0].display}
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
        {this.renderCoupons()}
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
        {this.renderChosenGiftCardsTotal()}
        {this.renderCheckoutTotal()}
      </ul>
    );
  }
}

export default CheckoutSummaryList;
