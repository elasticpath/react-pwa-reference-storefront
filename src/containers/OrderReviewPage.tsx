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
import { RouteComponentProps } from 'react-router-dom';
import intl from 'react-intl-universal';
import {
  OrderTableMain, PaymentMethodContainer, ShippingOptionContainer, CheckoutSummaryList, AddressContainer,
} from '../components/src/index';
import { login } from '../utils/AuthService';
import {
  isAnalyticsConfigured, trackAddItemAnalytics, trackAddTransactionAnalytics, sendAnalytics,
} from '../utils/Analytics';
import { cortexFetch } from '../utils/Cortex';
import Config from '../ep.config.json';

import './OrderReviewPage.less';

const zoomArray = [
  // zooms for checkout summary
  'total',
  'discount',
  'order',
  'order:tax',
  'order:total',
  'appliedpromotions:element',
  'order:couponinfo:coupon',
  'order:couponinfo:couponform',
  // zoom for billing address
  'order:billingaddressinfo:billingaddress',
  // zoom for shipping address
  'order:deliveries:element:destinationinfo:destination',
  // zoom for shipping option
  'order:deliveries:element:shippingoptioninfo:shippingoption',
  // zoom for payment method
  'order:paymentmethodinfo:paymentmethod',
  'order:postedpayments',
  // zooms for table items
  'lineitems:element',
  'lineitems:element:total',
  'lineitems:element:item',
  'lineitems:element:item:code',
  'lineitems:element:item:price',
  'lineitems:element:item:definition',
  'lineitems:element:item:definition:options:element',
  'lineitems:element:item:definition:options:element:value',
  'lineitems:element:dependentlineitems',
  'lineitems:element:dependentlineitems:element',
  'lineitems:element:dependentlineitems:element:item:addtocartform',
  'lineitems:element:dependentlineitems:element:item:availability',
  'lineitems:element:dependentlineitems:element:item:definition',
  'lineitems:element:dependentlineitems:element:item:code',
  // zoom for purchaseform
  'order:purchaseform',
];

interface MatchParams {
  cart: string;
}

interface OrderReviewPageProps extends RouteComponentProps<MatchParams> {
}

interface OrderReviewPageState {
    orderData: any,
    giftCertificateEntity: any,
    isLoading: boolean,
}
class OrderReviewPage extends React.Component<OrderReviewPageProps, OrderReviewPageState> {
  constructor(props) {
    super(props);
    this.state = {
      orderData: undefined,
      giftCertificateEntity: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchOrderData();
    this.fetchGiftCards();
  }

  fetchOrderData() {
    const { match } = this.props;
    const cartCode = match.params.cart;
    const cart = cartCode || 'default';
    login().then(() => {
      cortexFetch(`/carts/${Config.cortexApi.scope}/${cart}?zoom=${zoomArray.sort().join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            orderData: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  fetchGiftCards() {
    const chosenGiftCertificates = JSON.parse(localStorage.getItem('chosenGiftCertificatesArr')) || [];
    chosenGiftCertificates.forEach((card) => {
      login()
        .then(() => {
          cortexFetch(`/giftcertificates/${Config.cortexApi.scope}/lookup/form?followlocation=true`,
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
              body: JSON.stringify({
                'gift-certificate-code': card,
              }),
            })
            .then(data => data.json())
            .then((data) => {
              this.setState(prevState => ({
                giftCertificateEntity: [...prevState.giftCertificateEntity, data],
              }));
            })
            .catch((error) => {
            // eslint-disable-next-line no-console
              console.error(error.message);
            });
        });
    });
  }

  completeOrder() {
    this.setState({
      isLoading: true,
    });
    const purchaseZoomArray = [
      'paymentmeans:element',
      'paymentinstruments:element',
      'postedpayments:element',
      'shipments:element:destination',
      'shipments:element:shippingoption',
      'billingaddress',
      'discount',
      'appliedpromotions:element',
      'lineitems:element',
      'lineitems:element:options:element',
      'lineitems:element:options:element:value',
      'lineitems:element:components',
      'lineitems:element:components:element',
      'lineitems:element:components:element:item:addtocartform',
      'lineitems:element:components:element:item:availability',
      'lineitems:element:components:element:item:definition',
      'lineitems:element:components:element:item:code',
      'lineitems:element:dependentlineitems',
      'lineitems:element:dependentlineitems:element',
      'lineitems:element:dependentlineitems:element:item:addtocartform',
      'lineitems:element:dependentlineitems:element:item:availability',
      'lineitems:element:dependentlineitems:element:item:definition',
      'lineitems:element:dependentlineitems:element:item:code',
    ];
    const { orderData } = this.state;
    const { history } = this.props;
    const purchaseform = orderData._order[0]._purchaseform[0].links.find(link => link.rel === 'submitorderaction').uri;
    this.giftCertificatesAddToCart()
      .then(() => {
        login().then(() => {
          cortexFetch(`${purchaseform}?followlocation=true&zoom=${purchaseZoomArray.sort().join()}`, {
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
              this.trackTransactionAnalytics();
              history.push('/purchaseReceipt', { data: res });
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
            });
        });
      });
  }

  giftCertificatesAddToCart() {
    const { giftCertificateEntity } = this.state;
    const cards = [];
    giftCertificateEntity.forEach((card) => {
      cards.push(new Promise(((resolve, reject) => {
        login()
          .then(() => {
            cortexFetch(card.links[0].uri,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
                },
              })
              .then(res => res.json())
              .then((res) => {
                cortexFetch(`${res.links[0].uri}?followlocation=true`,
                  {
                    method: 'post',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
                    },
                    body: JSON.stringify({}),
                  })
                  .then(() => {
                    this.setState({
                      isLoading: false,
                    });
                    localStorage.removeItem('chosenGiftCertificatesArr');
                    const giftCertificatesCode = JSON.parse(localStorage.getItem('giftCertificatesCodeArr'));
                    const filteredGiftCertificatesCode = giftCertificatesCode.filter(el => el !== card.code);
                    if (!(card.balance > 0)) {
                      localStorage.setItem('giftCertificatesCodeArr', JSON.stringify(filteredGiftCertificatesCode));
                    }
                    resolve();
                  })
                  .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.error(error.message);
                    reject(error);
                  });
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error.message);
                reject(error);
              });
          });
      })));
    });
    return Promise.all(cards);
  }

  goToCheckOut() {
    const { history, match } = this.props;
    const cartCode = match.params.cart;
    const url = cartCode ? `/checkout/${cartCode}` : '/checkout';
    history.push(url);
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
    const displayName = orderData._order[0]._paymentmethodinfo[0]._paymentmethod[0];
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
    const { orderData, giftCertificateEntity, isLoading } = this.state;
    const isValid = (orderData && orderData._order[0]._purchaseform[0].links[0] && orderData._order[0]._purchaseform[0].links.find(link => link.rel === 'submitorderaction').uri);
    const itemDetailLink = '/itemdetail';

    return (
      <div>
        <div className="app-main">
          <div className="order-container container">
            <div className="order-container-inner">
              <div className="order-title-container">
                <h1 className="view-title">
                  {intl.get('review-your-order')}
                </h1>
              </div>
              {orderData && (
                <div className="order-main-container">
                  <div className="order-options-container">
                    {(orderData._order[0]._deliveries) && this.renderShippingOption()}
                    {(orderData._order[0]._deliveries) && this.renderShippingAddress()}
                    {(orderData._order[0]._billingaddressinfo) && this.renderBillingAddress()}
                    {(orderData._order[0]._paymentmethodinfo) && this.renderPaymentMethod()}
                  </div>
                  <div className="order-items-container">
                    <OrderTableMain data={orderData} itemDetailLink={itemDetailLink} />
                  </div>
                </div>
              )}
              {orderData && (
                <div className="checkout-sidebar">
                  <div>
                    <div className="checkout-sidebar-inner">
                      <div className="checkout-summary-container" style={{ display: 'inline-block' }}>
                        <CheckoutSummaryList data={orderData} giftCards={giftCertificateEntity} onChange={() => { this.fetchOrderData(); }} />
                      </div>
                      <div className="checkout-submit-container">
                        <button className="ep-btn primary wide btn-cmd-submit-order" disabled={!isValid} type="button" onClick={() => { this.completeOrder(); }}>
                          {intl.get('complete-purchase')}
                        </button>
                        <br />
                        <button className="ep-btn primary wide btn-cmd-edit-order" type="button" onClick={() => { this.goToCheckOut(); }}>
                          {intl.get('edit')}
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
                <div className="order-main-container">
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
