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
import * as cortex from '@elasticpath/cortex-client';
import { RouteComponentProps } from 'react-router-dom';
import intl from 'react-intl-universal';
import {
  OrderTableMain, PaymentMethodContainer, ShippingOptionContainer, CheckoutSummaryList, AddressContainer, ClientContext,
} from '@elasticpath/store-components';
import { login } from '../utils/AuthService';
import {
  isAnalyticsConfigured, trackAddItemAnalytics, trackAddTransactionAnalytics, sendAnalytics,
} from '../utils/Analytics';
import { cortexFetch } from '../utils/Cortex';
import Config from '../ep.config.json';


import './OrderReviewPage.less';

const zoomArray: cortex.RootFetch = {
  defaultcart: {
    total: {},
    order: {
      tax: {},
      total: {},
      couponinfo: {
        coupon: {},
        couponform: {},
      },
      billingaddressinfo: {
        billingaddress: {},
      },
      deliveries: {
        element: {
          destinationinfo: {
            destination: {},
          },
          shippingoptioninfo: {
            shippingoption: {},
          },
        },
      },
      paymentmethodinfo: {
        paymentmethod: {},
      },
      purchaseform: {},
    },
    appliedpromotions: {
      element: {},
    },
    lineitems: {
      element: {
        total: {},
        item: {
          code: {},
          price: {},
          definition: {
            options: {
              element: {
                value: {},
              },
            },
          },
        },
        dependentlineitems: {
          element: {
            item: {
              addtocartform: {},
              availability: {},
              definition: {},
              code: {},
            },
          },
        },
      },
    },
  },
};

interface OrderReviewPageState {
    orderData: cortex.Order,
    giftCertificateEntity: any,
    isLoading: boolean,
}
class OrderReviewPage extends React.Component<RouteComponentProps, OrderReviewPageState> {
  static contextType = ClientContext;

  client: cortex.IClient;

  constructor(props) {
    super(props);
    this.state = {
      orderData: undefined,
      giftCertificateEntity: [],
      isLoading: false,
    };
  }

  async componentDidMount() {
    this.client = this.context;
    await this.fetchOrderData();
    await this.fetchGiftCards();
  }

  async fetchOrderData() {
    try {
      const OrderDataRes = await this.client.root().fetch(zoomArray);
      this.setState({
        orderData: OrderDataRes.defaultcart,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
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

  async completeOrder() {
    this.setState({
      isLoading: true,
    });
    const purchaseZoomArray = {
      paymentmeans: {
        element: {},
      },
      postedpayments: {
        element: {},
      },
      shipments: {
        element: {
          destination: {},
          shippingoption: {},
        },
      },
      billingaddress: {},
      discount: {},
      appliedpromotions: {
        element: {},
      },
      lineitems: {
        element: {
          options: {
            element: {
              value: {},
            },
          },
          components: {
            element: {
              item: {
                addtocartform: {},
                availability: {},
                definition: {},
                code: {},
              },
            },
          },
          dependentlineitems: {
            element: {
              item: {
                addtocartform: {},
                availability: {},
                definition: {},
                code: {},
              },
            },
          },
        },
      },
    };
    const { orderData } = this.state;
    const { history } = this.props;

    try {
      const completePurchaseRes = await orderData.order.purchaseform({}).fetch(purchaseZoomArray);
      this.setState({
        isLoading: false,
      });
      this.giftCertificatesAddToCart();
      this.trackTransactionAnalytics();
      history.push('/purchaseReceipt', { data: completePurchaseRes });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }

  giftCertificatesAddToCart() {
    const { giftCertificateEntity } = this.state;
    giftCertificateEntity.forEach((card) => {
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
                })
                .catch((error) => {
                  // eslint-disable-next-line no-console
                  console.error(error.message);
                });
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
            });
        });
    });
  }

  goToCheckOut() {
    const { history } = this.props;
    history.push('/checkout');
  }

  trackTransactionAnalytics() {
    const { orderData } = this.state;
    if (isAnalyticsConfigured()) {
      const deliveries = (orderData.order.deliveries) ? orderData.order.deliveries.elements[0].shippingoptioninfo.shippingoption.cost.display : '';
      trackAddTransactionAnalytics(orderData.self.uri.split(`/carts/${Config.cortexApi.scope}/`)[1], orderData.order.total.cost.amount, deliveries, orderData.order.tax.total.display);
      orderData.lineitems.elements.map((product) => {
        const categoryTag = (product.item.definition.details) ? (product.item.definition.details.find(detail => detail.displayName === 'Tag')) : '';
        return (trackAddItemAnalytics(orderData.self.uri.split(`/carts/${Config.cortexApi.scope}/`)[1], product.item.definition.displayName, product.item.code.code, product.item.price.purchasePrice.display, (categoryTag !== undefined && categoryTag !== '') ? categoryTag.displayValue : '', product.quantity));
      });
      sendAnalytics();
    }
  }

  renderShippingOption() {
    const { orderData } = this.state;
    const { deliveries } = orderData.order;
    if (deliveries) {
      const option = orderData.order.deliveries.elements[0].shippingoptioninfo.shippingoption;
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
    const { deliveries } = orderData.order;
    if (deliveries) {
      const shippingAddress = orderData.order.deliveries.elements[0].destinationinfo.destination;
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
    const billingAddress = orderData.order.billingaddressinfo.billingaddress;
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
    const displayName = orderData.order.paymentmethodinfo.paymentmethod;
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
    const isValid = (orderData && orderData.order.purchaseform && orderData.order.deliveries.elements[0].shippingoptioninfo.shippingoption && orderData.order.billingaddressinfo.billingaddress && orderData.order.paymentmethodinfo.paymentmethod);
    let debugMessages = '';
    if (orderData && orderData.order) {
      const { messages } = orderData.order;
      for (let i = 0; i < messages.length; i++) {
        debugMessages = debugMessages.concat(`${messages[0].debugMessages} \n `);
      }
    }
    const itemDetailLink = '/itemdetail';

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
                    {(orderData.order.deliveries) && this.renderShippingOption()}
                    {(orderData.order.deliveries) && this.renderShippingAddress()}
                    {(orderData.order.billingaddressinfo) && this.renderBillingAddress()}
                    {(orderData.order.paymentmethodinfo) && this.renderPaymentMethod()}
                  </div>
                  <div className="order-items-container" style={{ display: 'block' }}>
                    <OrderTableMain data={orderData} itemDetailLink={itemDetailLink} />
                  </div>
                </div>
              )}
              {orderData && (
                <div className="checkout-sidebar" style={{ display: 'block' }}>
                  <div>
                    <div className="checkout-sidebar-inner">
                      <div className="checkout-summary-container" style={{ display: 'inline-block' }}>
                        <CheckoutSummaryList data={orderData} isLoading={false} giftCards={giftCertificateEntity} />
                      </div>
                      <div className="feedback-label" id="checkout_feedback_container">
                        {(debugMessages !== '') ? (debugMessages) : ('')}
                      </div>
                      <div className="checkout-submit-container" style={{ display: 'block' }}>
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
