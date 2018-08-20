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
import { login } from '../utils/AuthService';
import { trackAddItemAnalytics, trackAddTransactionAnalytics, sendAnalytics } from '../utils/Analytics';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import PaymentMethodContainer from '../components/paymentmethod.container';
import ShippingOptionContainer from '../components/shippingoption.container';
import AddressContainer from '../components/address.container';
import CheckoutSummaryList from '../components/checkout.summarylist';
import OrderTableMain from '../components/ordertable.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

const zoomArray = [
  // zooms for checkout summary
  'defaultcart',
  'defaultcart:total',
  'defaultcart:discount',
  'defaultcart:order',
  'defaultcart:order:tax',
  'defaultcart:order:total',
  'defaultcart:appliedpromotions:element',
  // zoom for billing address
  'defaultcart:order:billingaddressinfo:billingaddress',
  // zoom for shipping address
  'defaultcart:order:deliveries:element:destinationinfo:destination',
  // zoom for shipping option
  'defaultcart:order:deliveries:element:shippingoptioninfo:shippingoption',
  // zoom for payment method
  'defaultcart:order:paymentmethodinfo:paymentmethod',
  // zooms for table items
  'defaultcart:lineitems:element',
  'defaultcart:lineitems:element:total',
  'defaultcart:lineitems:element:item',
  'defaultcart:lineitems:element:item:code',
  'defaultcart:lineitems:element:item:price',
  'defaultcart:lineitems:element:item:definition',
  'defaultcart:lineitems:element:item:definition:options:element',
  'defaultcart:lineitems:element:item:definition:options:element:value',
  // zoom for purchaseform
  'defaultcart:order:purchaseform',
];

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
    this.fetchOrderData();
  }

  fetchOrderData() {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.sort().join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            orderData: res._defaultcart[0],
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  completeOrder() {
    this.setState({
      isLoading: true,
    });
    const purchaseZoomArray = [
      'paymentmeans:element',
      'shipments:element:destination',
      'shipments:element:shippingoption',
      'billingaddress',
      'discount',
      'appliedpromotions:element',
      'lineitems:element',
      'lineitems:element:options:element',
      'lineitems:element:options:element:value',
    ];
    const { orderData } = this.state;
    const { history } = this.props;
    const purchaseform = orderData._order[0]._purchaseform[0].links.find(link => link.rel === 'submitorderaction').uri;
    login().then(() => {
      cortexFetch(`${purchaseform}?followlocation&zoom=${purchaseZoomArray.sort().join()}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            isLoading: false,
          });
          const deliveries = (orderData._order[0]._deliveries) ? orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption[0].cost[0].display : '';
          trackAddTransactionAnalytics(orderData.self.uri.split(`/carts/${Config.cortexApi.scope}/`)[1], orderData._order[0]._total[0].cost[0].amount, deliveries, orderData._order[0]._tax[0].total.display);
          orderData._lineitems[0]._element.map((product) => {
            const categoryTag = product._item[0]._definition[0].details.find(detail => detail['display-name'] === 'Tag');
            return (trackAddItemAnalytics(orderData.self.uri.split(`/carts/${Config.cortexApi.scope}/`)[1], product._item[0]._definition[0]['display-name'], product._item[0]._code[0].code, product._item[0]._price[0]['purchase-price'][0].display, categoryTag['display-value'], product.quantity));
          });
          sendAnalytics();
          history.push('/purchaseReceipt', { data: res });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
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
        <AppHeaderMain />
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
                  <div className="order-options-container" style={{ display: 'block', paddingBottom: '20px' }}>
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
                        <button className="btn-cmd-submit-order" type="button" onClick={() => { this.completeOrder(); }}>
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
        <AppFooterMain />
      </div>
    );
  }
}

export default OrderReviewPage;
