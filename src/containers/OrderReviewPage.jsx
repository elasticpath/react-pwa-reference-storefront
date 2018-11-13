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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import { fetchOrderData, submitOrder } from '../utils/AuthService';
import {
  isAnalyticsConfigured, trackAddItemAnalytics, trackAddTransactionAnalytics, sendAnalytics,
} from '../utils/Analytics';
import PaymentMethodContainer from '../components/paymentmethod.container';
import ShippingOptionContainer from '../components/shippingoption.container';
import AddressContainer from '../components/address.container';
import CheckoutSummaryList from '../components/checkout.summarylist';
import OrderTableMain from '../components/ordertable.main';
import './OrderReviewPage.less';

const Config = require('Config');

class OrderReviewPage extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      orderData: undefined,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.refreshOrderData();
  }

  refreshOrderData() {
    fetchOrderData()
      .then((res) => {
        this.setState({
          orderData: res._defaultcart[0],
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  completeOrder() {
    this.setState({
      isLoading: true,
    });
    const { orderData } = this.state;
    const { history } = this.props;
    const purchaseform = orderData._order[0]._purchaseform[0].links.find(link => link.rel === 'submitorderaction').uri;
    submitOrder(purchaseform)
      .then((res) => {
        this.setState({
          isLoading: false,
        });
        this.trackTransactionAnalytics();
        history.push('/purchaseReceipt', { data: res });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  trackTransactionAnalytics() {
    const { orderData } = this.state;
    if (isAnalyticsConfigured()) {
      const deliveries = (orderData._order[0]._deliveries) ? orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption[0].cost[0].display : '';
      trackAddTransactionAnalytics(orderData.self.uri.split(`/carts/${Config.cortexApi.scope}/`)[1], orderData._order[0]._total[0].cost[0].amount, deliveries, orderData._order[0]._tax[0].total.display);
      orderData._lineitems[0]._element.map((product) => {
        const categoryTag = (product._item[0]._definition[0].details) ? (product._item[0]._definition[0].details.find(detail => detail['display-name'] === 'Tag')) : '';
        return (trackAddItemAnalytics(orderData.self.uri.split(`/carts/${Config.cortexApi.scope}/`)[1], product._item[0]._definition[0]['display-name'], product._item[0]._code[0].code, product._item[0]._price[0]['purchase-price'][0].display, (categoryTag !== undefined && categoryTag !== '') ? categoryTag['display-value'] : '', product.quantity));
      });
      sendAnalytics();
    }
  }

  renderShippingOption() {
    const { orderData } = this.state;
    const deliveries = orderData._order[0]._deliveries;
    if (deliveries) {
      const [option] = orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption;
      return (
        <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
          <h3>
            {intl.get('shipping-option')}
          </h3>
          <ShippingOptionContainer option={option} />
        </div>
      );
    }
    return null;
  }

  renderShippingAddress() {
    const { orderData } = this.state;
    const deliveries = orderData._order[0]._deliveries;
    if (deliveries) {
      const [shippingAddress] = orderData._order[0]._deliveries[0]._element[0]._destinationinfo[0]._destination;
      const { name, address } = shippingAddress;
      return (
        <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
          <h3>
            {intl.get('shipping-address')}
          </h3>
          <AddressContainer name={name} address={address} />
        </div>
      );
    }
    return null;
  }

  renderBillingAddress() {
    const { orderData } = this.state;
    const [billingAddress] = orderData._order[0]._billingaddressinfo[0]._billingaddress;
    const { name, address } = billingAddress;
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
        <h3>
          {intl.get('billing-address')}
        </h3>
        <AddressContainer name={name} address={address} />
      </div>
    );
  }

  renderPaymentMethod() {
    const { orderData } = this.state;
    const displayName = orderData._order[0]._paymentmethodinfo[0]._paymentmethod[0]['display-name'];
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px', verticalAlign: 'top' }}>
        <h3>
          {intl.get('payment-method')}
        </h3>
        <PaymentMethodContainer displayName={displayName} />
      </div>
    );
  }

  render() {
    const { orderData, isLoading } = this.state;
    return (
      <div>
        <div className="app-main" style={{ display: 'block' }}>
          <div className="order-container container">
            <div className="order-container-inner">
              <div className="order-title-container" style={{ display: 'block' }}>
                <h1 className="view-title">
                  {intl.get('review-your-order')}
                </h1>
              </div>
              {orderData && (
                <div className="order-main-container" style={{ display: 'block' }}>
                  <div className="order-options-container" style={{ display: 'block' }}>
                    {this.renderShippingOption()}
                    {this.renderShippingAddress()}
                    {this.renderBillingAddress()}
                    {this.renderPaymentMethod()}
                  </div>
                  <div className="order-items-container" style={{ display: 'block' }}>
                    <OrderTableMain data={orderData} />
                  </div>
                </div>
              )}
              {orderData && (
                <div className="checkout-sidebar" style={{ display: 'block' }}>
                  <div>
                    <div className="checkout-sidebar-inner">
                      <div className="checkout-summary-container" style={{ display: 'inline-block' }}>
                        <CheckoutSummaryList data={orderData} isLoading={false} />
                      </div>
                      <div className="checkout-submit-container" style={{ display: 'block' }}>
                        <button className="ep-btn primary wide btn-cmd-submit-order" type="button" onClick={() => { this.completeOrder(); }}>
                          {intl.get('complete-purchase')}
                        </button>
                        {isLoading && (
                          <div className="miniLoader" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!orderData && (
                <div className="order-main-container" style={{ display: 'block' }}>
                  <div className="loader" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderReviewPage;
