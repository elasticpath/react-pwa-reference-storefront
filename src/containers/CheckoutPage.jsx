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
import ReactRouterPropTypes from 'react-router-prop-types';
import { login } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import CheckoutSummaryList from '../components/checkout.summarylist';
import AddressContainer from '../components/address.container';
import ShippingOptionContainer from '../components/shippingoption.container';
import PaymentMethodContainer from '../components/paymentmethod.container';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  // zooms for checkout summary
  'defaultcart',
  'defaultcart:total',
  'defaultcart:discount',
  'defaultcart:order',
  'defaultcart:order:tax',
  'defaultcart:order:total',
  'defaultcart:appliedpromotions:element',
  // zooms for billing address
  'defaultcart:order:billingaddressinfo:billingaddress',
  'defaultcart:order:billingaddressinfo:selector:choice',
  'defaultcart:order:billingaddressinfo:selector:choice:description',
  // zooms for shipping address
  'defaultcart:order:deliveries:element:destinationinfo:destination',
  'defaultcart:order:deliveries:element:destinationinfo:selector:choice',
  'defaultcart:order:deliveries:element:destinationinfo:selector:choice:description',
  // zooms for shipping options
  'defaultcart:order:deliveries:element:shippingoptioninfo:shippingoption',
  'defaultcart:order:deliveries:element:shippingoptioninfo:selector:choice',
  'defaultcart:order:deliveries:element:shippingoptioninfo:selector:choice:description',
  // zooms for payment methods
  'defaultcart:order:paymentmethodinfo:paymentmethod',
  'defaultcart:order:paymentmethodinfo:selector:choice',
  'defaultcart:order:paymentmethodinfo:selector:choice:description',
];

class CheckoutPage extends React.Component {
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
      cortexFetch(`${Config.cortexApi.path}/?zoom=${zoomArray.sort().join()}`,
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
            isLoading: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  newAddress() {
    const { history } = this.props;
    history.push('/newaddressform', { returnPage: '/checkout' });
  }

  editAddress(addressLink) {
    const { history } = this.props;
    history.push('/editaddress', { returnPage: '/checkout', address: addressLink });
  }

  handleDelete(link) {
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetch(link, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        this.fetchOrderData();
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
    });
  }

  handleChange(link) {
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetch(link, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        this.fetchOrderData();
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
    });
  }

  newPayment() {
    const { history } = this.props;
    history.push('/newpaymentform', { returnPage: '/checkout' });
  }

  reviewOrder() {
    const { history } = this.props;
    history.push('/order');
  }

  renderShippingAddress() {
    const { orderData } = this.state;
    if (orderData._order[0]._deliveries && orderData._order[0]._deliveries[0]._element[0]._destinationinfo) {
      const shippingAddresses = [];
      const destination = orderData._order[0]._deliveries[0]._element[0]._destinationinfo[0]._destination;
      if (destination) {
        const [description] = destination;
        description.checked = true;
        shippingAddresses.push(description);
      }
      const selector = orderData._order[0]._deliveries[0]._element[0]._destinationinfo[0]._selector;
      if (selector) {
        const choices = selector[0]._choice;
        choices.map((choice) => {
          const [description] = choice._description;
          description.selectaction = choice.links.find(link => link.rel === 'selectaction').href;
          description.checked = false;
          shippingAddresses.push(description);
          return description;
        });
      }
      return (
        shippingAddresses.map((shippingAddress) => {
          const {
            name, address, selectaction, checked,
          } = shippingAddress;
          return (
            <div key={`shippingAddress_${Math.random().toString(36).substr(2, 9)}`}>
              <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
                {/* eslint-disable-next-line max-len */}
                <input type="radio" name="shipping" id="shippingOption" className="checkout-address-radio" defaultChecked={checked} onChange={() => this.handleChange(selectaction)} />
                <label htmlFor="shippingOption">
                  <div data-region="checkoutAddressRegion" style={{ display: 'block' }}>
                    <AddressContainer name={name} address={address} />
                  </div>
                </label>
              </div>
              <div className="address-btn-cell">
                {/* eslint-disable-next-line max-len */}
                <button className="btn checkout-edit-address-btn" type="button" onClick={() => { this.editAddress(shippingAddress.self.href); }}>
                  Edit
                </button>
                {/* eslint-disable-next-line max-len */}
                <button className="btn checkout-delete-address-btn" type="button" onClick={() => { this.handleDelete(shippingAddress.self.href); }}>
                  Delete
                </button>
              </div>
            </div>
          );
        })
      );
    }
    return (
      <div>
        <p>
          You have no saved shipping addresses.
        </p>
      </div>
    );
  }

  renderShippingAddressSelector() {
    const { orderData } = this.state;
    const deliveries = orderData._order[0]._deliveries;
    const { messages } = orderData._order[0];
    const needShipmentDetails = messages.find(message => message.id === 'need.shipment.details');
    if (needShipmentDetails || deliveries) {
      return (
        <div data-region="shippingAddressesRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              Shipping Address
            </h2>
            <div data-region="shippingAddressSelectorsRegion" className="checkout-region-inner-container">
              {this.renderShippingAddress()}
            </div>
            <button className="btn btn-primary checkout-new-address-btn" type="button" onClick={() => { this.newAddress(); }}>
              Add a New Address
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  renderShippingOptions() {
    const { orderData } = this.state;
    if (orderData._order[0]._deliveries && orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo) {
      const shippingOptions = [];
      const shippingOption = orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption;
      if (shippingOption) {
        const [description] = shippingOption;
        description.checked = true;
        shippingOptions.push(description);
      }
      const selector = orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._selector;
      if (selector) {
        const choices = selector[0]._choice;
        choices.map((choice) => {
          const [description] = choice._description;
          description.selectaction = choice.links.find(link => link.rel === 'selectaction').href;
          description.checked = false;
          shippingOptions.push(description);
          return description;
        });
      }
      return (
        shippingOptions.map(option => (
          <div key={`shippingOption_${Math.random().toString(36).substr(2, 9)}`}>
            {/* eslint-disable-next-line max-len */}
            <input type="radio" name="shippingOption" id="shippingOption" className="shipping-option-radio" defaultChecked={option.checked} onChange={() => this.handleChange(option.selectaction)} />
            <label htmlFor="shippingOption">
              <div className="shipping-option-region" style={{ display: 'block' }}>
                <ShippingOptionContainer option={option} />
              </div>
            </label>
          </div>
        ))
      );
    }
    return (
      <div>
        <p>
          There are no shipping options available for your chosen shipping address.
        </p>
      </div>
    );
  }

  renderShippingOptionsSelector() {
    const { orderData } = this.state;
    const deliveries = orderData._order[0]._deliveries;
    if (deliveries && deliveries[0]._element[0]._destinationinfo) {
      return (
        <div>
          <h2>
            Shipping Options
          </h2>
          <div data-region="shippingOptionSelectorsRegion">
            {this.renderShippingOptions()}
          </div>
        </div>
      );
    }
    return null;
  }

  renderBillingAddress() {
    const { orderData } = this.state;
    if (orderData._order[0]._billingaddressinfo) {
      const billingAddresses = [];
      const billingAddress = orderData._order[0]._billingaddressinfo[0]._billingaddress;
      if (billingAddress) {
        const [description] = billingAddress;
        description.checked = true;
        billingAddresses.push(description);
      }
      const selector = orderData._order[0]._billingaddressinfo[0]._selector;
      if (selector) {
        const choices = selector[0]._choice;
        choices.map((choice) => {
          const [description] = choice._description;
          description.selectaction = choice.links.find(link => link.rel === 'selectaction').href;
          description.checked = false;
          billingAddresses.push(description);
          return description;
        });
      }
      return (
        billingAddresses.map((billingAddr) => {
          const {
            name, address, selectaction, checked,
          } = billingAddr;
          return (
            <div key={`billingAddress_${Math.random().toString(36).substr(2, 9)}`}>
              <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
                {/* eslint-disable-next-line max-len */}
                <input type="radio" name="billing" id="billingOption" className="checkout-address-radio" defaultChecked={checked} onChange={() => this.handleChange(selectaction)} />
                <label htmlFor="billingOption">
                  <div data-region="checkoutAddressRegion" style={{ display: 'block' }}>
                    <AddressContainer name={name} address={address} />
                  </div>
                </label>
              </div>
              <div className="address-btn-cell">
                {/* eslint-disable-next-line max-len */}
                <button className="btn checkout-edit-address-btn" type="button" onClick={() => { this.editAddress(billingAddr.self.href); }}>
                  Edit
                </button>
                {/* eslint-disable-next-line max-len */}
                <button className="btn checkout-delete-address-btn" type="button" onClick={() => { this.handleDelete(billingAddr.self.href); }}>
                  Delete
                </button>
              </div>
            </div>
          );
        })
      );
    }
    return (
      <div>
        <p>
          You have no saved billing addresses.
        </p>
      </div>
    );
  }

  renderBillingAddressSelector() {
    return (
      <div>
        <h2>
          Billing Address
        </h2>
        <div data-region="billingAddressSelectorsRegion" className="checkout-region-inner-container">
          {this.renderBillingAddress()}
        </div>
        <button className="btn btn-primary checkout-new-address-btn" type="button" onClick={() => { this.newAddress(); }}>
          Add a New Address
        </button>
      </div>
    );
  }

  renderPayments() {
    const { orderData } = this.state;
    if (orderData._order[0]._paymentmethodinfo) {
      const paymentMethods = [];
      const paymentMethod = orderData._order[0]._paymentmethodinfo[0]._paymentmethod;
      if (paymentMethod) {
        const [description] = paymentMethod;
        description.checked = true;
        description.deletable = false;
        paymentMethods.push(description);
      }
      const selector = orderData._order[0]._paymentmethodinfo[0]._selector;
      if (selector) {
        const choices = selector[0]._choice;
        choices.map((choice) => {
          const [description] = choice._description;
          description.selectaction = choice.links.find(link => link.rel === 'selectaction').href;
          description.checked = false;
          description.deletable = true;
          paymentMethods.push(description);
          return description;
        });
      }
      return (
        paymentMethods.map((payment) => {
          const {
            checked, deletable, selectaction,
          } = payment;
          const displayName = payment['display-name'];
          return (
            <div key={`paymentMethod_${Math.random().toString(36).substr(2, 9)}`}>
              <div className="payment-ctrl-cell" data-region="paymentSelector">
                <input type="radio" name="paymentMethod" id="paymentMethod" className="payment-option-radio" defaultChecked={checked} onChange={() => this.handleChange(selectaction)} />
                <label htmlFor="paymentMethod">
                  <div data-region="paymentMethodComponentRegion" style={{ display: 'block' }}>
                    <PaymentMethodContainer displayName={displayName} />
                  </div>
                </label>
              </div>
              {deletable && (
                <div className="payment-btn-cell">
                  <button className="btn checkout-delete-payment-btn" type="button" onClick={() => { this.handleDelete(payment.self.href); }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })
      );
    }
    return (
      <div>
        <p>
          You have no saved payment method.
        </p>
      </div>
    );
  }

  renderPaymentSelector() {
    return (
      <div>
        <h2>
          Payment Method
        </h2>
        <div data-region="paymentMethodSelectorsRegion" className="checkout-region-inner-container">
          {this.renderPayments()}
        </div>
        <button className="btn btn-primary checkout-new-payment-btn" type="button" onClick={() => { this.newPayment(); }}>
          Add a New Payment Method
        </button>
      </div>
    );
  }

  render() {
    const { orderData, isLoading } = this.state;
    if (orderData && !isLoading) {
      const { messages } = orderData._order[0];
      return (
        <div>
          <AppHeaderMain />
          <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
            <div className="checkout-container container">
              <div className="checkout-container-inner">
                <div data-region="checkoutTitleRegion" className="checkout-title-container" style={{ display: 'block' }}>
                  <div>
                    <h1 className="view-title">
                      Checkout Summary
                    </h1>
                  </div>
                </div>
                <div className="checkout-main-container">
                  <div data-region="billingAddressesRegion" style={{ display: 'block' }}>
                    {this.renderBillingAddressSelector()}
                  </div>
                  <div className="checkout-shipping-container">
                    {this.renderShippingAddressSelector()}
                    <div data-region="shippingOptionsRegion">
                      {this.renderShippingOptionsSelector()}
                    </div>
                  </div>
                  <div data-region="paymentMethodsRegion" style={{ display: 'block' }}>
                    {this.renderPaymentSelector()}
                  </div>
                </div>
                <div className="checkout-sidebar" data-region="checkoutOrderRegion" style={{ display: 'block' }}>
                  <div>
                    <div className="checkout-sidebar-inner">
                      <div data-region="checkoutSummaryRegion" className="checkout-summary-container" style={{ display: 'inline-block' }}>
                        <CheckoutSummaryList data={orderData} />
                      </div>
                      <div data-region="checkoutActionRegion" className="checkout-submit-container" style={{ display: 'block' }}>
                        <button className="btn-cmd-submit-order" type="button" disabled={messages[0]} onClick={() => { this.reviewOrder(); }}>
                          Complete Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AppFooterMain />
        </div>
      );
    }
    return (
      <div>
        <AppHeaderMain />
        <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
          <div className="checkout-container container">
            <div className="checkout-container-inner">
              <div data-region="checkoutTitleRegion" className="checkout-title-container" style={{ display: 'block' }}>
                <div>
                  <h1 className="view-title">
                    Checkout Summary
                  </h1>
                </div>
              </div>
              <div className="loader" />
            </div>
          </div>
        </div>
        <AppFooterMain />
      </div>
    );
  }
}

export default CheckoutPage;
