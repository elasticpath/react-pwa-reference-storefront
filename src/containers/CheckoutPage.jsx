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
            isLoading: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
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
        console.error(error.message);
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
        console.error(error.message);
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
          description.selectaction = choice.links.find(link => link.rel === 'selectaction').uri;
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
                <button className="btn checkout-edit-address-btn" type="button" onClick={() => { this.editAddress(shippingAddress.self.uri); }}>
                  {intl.get('edit')}
                </button>
                {/* eslint-disable-next-line max-len */}
                <button className="btn checkout-delete-address-btn" type="button" onClick={() => { this.handleDelete(shippingAddress.self.uri); }}>
                  {intl.get('delete')}
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
          {intl.get('no-shipping-address-message')}
        </p>
      </div>
    );
  }

  renderShippingAddressSelector() {
    const { orderData } = this.state;
    const deliveries = orderData._order[0]._deliveries;
    const { messages } = orderData._order[0];
    const needShipmentDetails = messages.find(message => message.id === 'need.shipping.address');
    if (needShipmentDetails || deliveries) {
      return (
        <div data-region="shippingAddressesRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('shipping-address')}
            </h2>
            <div data-region="shippingAddressSelectorsRegion" className="checkout-region-inner-container">
              {this.renderShippingAddress()}
            </div>
            <button className="btn btn-primary checkout-new-address-btn" type="button" onClick={() => { this.newAddress(); }}>
              {intl.get('add-new-address')}
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
          description.selectaction = choice.links.find(link => link.rel === 'selectaction').uri;
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
          {intl.get('no-shipping-options-message')}
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
          description.selectaction = choice.links.find(link => link.rel === 'selectaction').uri;
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
                <button className="btn checkout-edit-address-btn" type="button" onClick={() => { this.editAddress(billingAddr.self.uri); }}>
                  {intl.get('edit')}
                </button>
                {/* eslint-disable-next-line max-len */}
                <button className="btn checkout-delete-address-btn" type="button" onClick={() => { this.handleDelete(billingAddr.self.uri); }}>
                  {intl.get('delete')}
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
          {intl.get('no-billing-address-message')}
        </p>
      </div>
    );
  }

  renderBillingAddressSelector() {
    return (
      <div>
        <h2>
          {intl.get('billing-address')}
        </h2>
        <div data-region="billingAddressSelectorsRegion" className="checkout-region-inner-container">
          {this.renderBillingAddress()}
        </div>
        <button className="btn btn-primary checkout-new-address-btn" type="button" onClick={() => { this.newAddress(); }}>
          {intl.get('add-new-address')}
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
          description.selectaction = choice.links.find(link => link.rel === 'selectaction').uri;
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
                  <button className="btn checkout-delete-payment-btn" type="button" onClick={() => { this.handleDelete(payment.self.uri); }}>
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
          {intl.get('no-saved-payment-method-message')}
        </p>
      </div>
    );
  }

  renderPaymentSelector() {
    return (
      <div>
        <h2>
          {intl.get('payment-method')}
        </h2>
        <div data-region="paymentMethodSelectorsRegion" className="checkout-region-inner-container">
          {this.renderPayments()}
        </div>
        <button className="btn btn-primary checkout-new-payment-btn" type="button" onClick={() => { this.newPayment(); }}>
          {intl.get('add-new-payment-method')}
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
          <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
            <div className="checkout-container container">
              <div className="checkout-container-inner">
                <div data-region="checkoutTitleRegion" className="checkout-title-container" style={{ display: 'block' }}>
                  <div>
                    <h1 className="view-title">
                      {intl.get('checkout-summary')}
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
                          {intl.get('complete-order')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
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
                <div className="loader" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutPage;
