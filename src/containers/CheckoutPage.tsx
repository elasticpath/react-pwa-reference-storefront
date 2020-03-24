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
import intl from 'react-intl-universal';
import { RouteComponentProps } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import {
  GiftcertificateFormMain, AddressContainer, CheckoutSummaryList, ShippingOptionContainer, PaymentMethodContainer, ProfileemailinfoMain, AddressFormMain, PaymentSelectorMain, PurchaseOrderWidget,
} from '../components/src/index';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import Config from '../ep.config.json';

import './CheckoutPage.less';

// Array of zoom parameters to pass to Cortex
const zoomArrayProfile = [
  'defaultprofile',
  'defaultprofile:emails',
  'defaultprofile:emails:element',
  'defaultprofile:emails:element:list',
  'defaultprofile:emails:element:profile',
  'defaultprofile:emails:emailform',
  'defaultprofile:emails:profile',
  'defaultprofile:paymentinstruments:element',
  'defaultprofile:paymentinstruments:default',
  'defaultprofile:paymentmethods:paymenttokenform',
  'defaultprofile:paymentmethods',
  'defaultprofile:paymentmethods:paymenttokenform',
  'defaultprofile:paymentmethods:element',
];

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
  // zooms for billing address
  'order:billingaddressinfo:billingaddress',
  'order:billingaddressinfo:selector:choice',
  'order:billingaddressinfo:selector:choice:description',
  // zooms for shipping address
  'order:deliveries:element:destinationinfo:destination',
  'order:deliveries:element:destinationinfo:selector:choice',
  'order:deliveries:element:destinationinfo:selector:choice:description',
  // zooms for shipping options
  'order:deliveries:element:shippingoptioninfo:shippingoption',
  'order:deliveries:element:shippingoptioninfo:selector:choice',
  'order:deliveries:element:shippingoptioninfo:selector:choice:description',
  // zooms for payment methods
  'order:paymentmethodinfo:paymentmethod',
  'order:paymentmethodinfo:selector:choice',
  'order:paymentmethodinfo:selector:choice:description',
  // zooms for payment plugin update
  'order:paymentinstrumentselector',
  'order:paymentinstrumentselector:choice',
  'order:paymentinstrumentselector:choice:description',
  'order:paymentinstrumentselector:chosen',
  'order:paymentinstrumentselector:chosen:description',
  'order:paymentmethodinfo:element:paymentinstrumentform',
];

interface MatchParams {
  cart: string;
}

interface CheckoutPageProps extends RouteComponentProps<MatchParams> {
}

interface CheckoutPageState {
    orderData: any,
    isLoading: boolean,
    profileData: any,
    showGiftCard: boolean,
    certificates: any,
    openAddressModal: boolean,
    addressUrl: any,
}

class CheckoutPage extends React.Component<CheckoutPageProps, CheckoutPageState> {
  constructor(props) {
    super(props);
    this.state = {
      orderData: undefined,
      isLoading: false,
      profileData: undefined,
      showGiftCard: false,
      certificates: [],
      openAddressModal: false,
      addressUrl: undefined,
    };
    this.fetchProfileData = this.fetchProfileData.bind(this);
    this.handleCertificate = this.handleCertificate.bind(this);
    this.fetchOrderData = this.fetchOrderData.bind(this);
    this.handleCloseAddressModal = this.handleCloseAddressModal.bind(this);
    this.renderPaymentSelector = this.renderPaymentSelector.bind(this);
  }

  componentDidMount() {
    this.fetchOrderData();
    this.fetchProfileData();
    this.fetchGiftCardsData();
  }

  fetchProfileData() {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArrayProfile.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            profileData: res._defaultprofile[0],
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  fetchGiftCardsData() {
    login().then(() => {
      cortexFetch('/?zoom=lookups:giftcertificatelookupform',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          if (res._lookups && res._lookups[0]._giftcertificatelookupform) {
            this.setState({ showGiftCard: true });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
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
    this.setState({
      openAddressModal: true,
      addressUrl: undefined,
    });
  }

  editAddress(addressLink) {
    this.setState({
      openAddressModal: true,
      addressUrl: { address: addressLink },
    });
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

  reviewOrder() {
    const { history, match } = this.props;
    const cartCode = match.params.cart;
    const url = cartCode ? `/order/${cartCode}` : '/order';
    history.push(url);
  }

  handleCertificate(certificate) {
    this.setState({
      certificates: certificate,
    });
  }

  handleCloseAddressModal() {
    this.setState({ openAddressModal: false });
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
        shippingAddresses.map((shippingAddress, index) => {
          const {
            name, address, selectaction, checked,
          } = shippingAddress;
          return (
            <div key={`shippingAddress_${Math.random().toString(36).substr(2, 9)}`}>
              <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
                {/* eslint-disable-next-line max-len */}
                <input type="radio" name="shipping" id={`shippingAddress-${index}`} className="checkout-address-radio style-radio" defaultChecked={checked} onChange={() => this.handleChange(selectaction)} />
                {/* eslint-disable jsx-a11y/label-has-associated-control */}
                <label htmlFor={`shippingAddress-${index}`} />
                <label htmlFor={`shippingAddress-${index}`}>
                  <div data-region="checkoutAddressRegion">
                    <AddressContainer name={name} address={address} />
                  </div>
                </label>
              </div>
              <div className="address-btn-cell">
                {/* eslint-disable-next-line max-len */}
                <button className="ep-btn small checkout-edit-address-btn" type="button" onClick={() => { this.editAddress(shippingAddress.self.uri); }}>
                  {intl.get('edit')}
                </button>
                {/* eslint-disable-next-line max-len */}
                <button className="ep-btn small checkout-delete-address-btn" type="button" onClick={() => { this.handleDelete(shippingAddress.self.uri); }}>
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

  renderNewAddressModal() {
    const { openAddressModal, addressUrl } = this.state;
    const newOrEdit = (addressUrl && addressUrl.address) ? intl.get('edit') : intl.get('new');
    return (
      <Modal open={openAddressModal} onClose={this.handleCloseAddressModal}>
        <div className="modal-lg new-address-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {newOrEdit}
                {' '}
                {intl.get('address')}
              </h2>
            </div>
            <div className="modal-body">
              <AddressFormMain onCloseModal={this.handleCloseAddressModal} fetchData={this.fetchOrderData} addressData={addressUrl} />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  renderShippingAddressSelector() {
    const { orderData } = this.state;
    const deliveries = orderData._order[0]._deliveries;
    const { messages } = orderData._order[0];
    const needShipmentDetails = messages.find(message => message.id === 'need.shipping.address');
    if (needShipmentDetails || deliveries) {
      return (
        <div data-region="shippingAddressesRegion">
          <div>
            <h2>
              {intl.get('shipping-address')}
            </h2>
            <div data-region="shippingAddressSelectorsRegion" className="checkout-region-inner-container">
              {this.renderShippingAddress()}
            </div>
            <button className="ep-btn primary wide checkout-new-address-btn" type="button" onClick={() => { this.newAddress(); }}>
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
      if (selector && selector[0]._choice) {
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
        shippingOptions.map((option, index) => (
          <div key={`shippingOption_${Math.random().toString(36).substr(2, 9)}`}>
            {/* eslint-disable-next-line max-len */}
            <input type="radio" name="shippingOption" id={`shippingOption-${index}`} className="shipping-option-radio style-radio" defaultChecked={option.checked} onChange={() => this.handleChange(option.selectaction)} />
            <label htmlFor={`shippingOption-${index}`} />
            <label htmlFor={`shippingOption-${index}`}>
              <div className="shipping-option-region">
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
        billingAddresses.map((billingAddr, index) => {
          const {
            name, address, selectaction, checked,
          } = billingAddr;
          return (
            <div key={`billingAddress_${Math.random().toString(36).substr(2, 9)}`}>
              <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
                {/* eslint-disable-next-line max-len */}
                <input type="radio" name="billing" id={`billingOption-${index}`} className="checkout-address-radio style-radio" defaultChecked={checked} onChange={() => this.handleChange(selectaction)} />
                <label htmlFor={`billingOption-${index}`} />
                <label htmlFor={`billingOption-${index}`}>
                  <div data-region="checkoutAddressRegion">
                    <AddressContainer name={name} address={address} />
                  </div>
                </label>
              </div>
              <div className="address-btn-cell">
                {/* eslint-disable-next-line max-len */}
                <button className="ep-btn small checkout-edit-address-btn" type="button" onClick={() => { this.editAddress(billingAddr.self.uri); }}>
                  {intl.get('edit')}
                </button>
                {/* eslint-disable-next-line max-len */}
                <button className="ep-btn small checkout-delete-address-btn" type="button" onClick={() => { this.handleDelete(billingAddr.self.uri); }}>
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
    const { profileData } = this.state;
    const isDisabled = !(!profileData || (profileData && profileData._emails[0]._element));
    return (
      <div>
        <h2>
          {intl.get('billing-address')}
        </h2>
        <div data-region="billingAddressSelectorsRegion" className="checkout-region-inner-container">
          {this.renderBillingAddress()}
        </div>
        <button className="ep-btn primary wide checkout-new-address-btn" data-region="billingAddressButtonRegion" disabled={isDisabled} type="button" onClick={() => { this.newAddress(); }}>
          {intl.get('add-new-address')}
        </button>
      </div>
    );
  }

  renderPaymentChoice(payment) {
    const {
      checked, deletable, selectaction,
    } = payment;

    return (
      <div key={`paymentMethod_${Math.random().toString(36).substr(2, 9)}`}>
        <div className="payment-ctrl-cell" data-region="paymentSelector">
          <input type="radio" name="paymentMethod" id="paymentMethod" className="payment-option-radio style-radio" defaultChecked={checked} onChange={() => this.handleChange(selectaction)} />
          <label htmlFor="paymentMethod" />
          <label htmlFor="paymentMethod">
            <div className="paymentMethodComponentRegion" data-region="paymentMethodComponentRegion">
              <PaymentMethodContainer displayName={payment} />
            </div>
          </label>
        </div>
        {deletable && (
          <div className="payment-btn-cell">
            <button className="ep-btn small checkout-delete-payment-btn" type="button" onClick={() => { this.handleDelete(payment.self.uri); }}>
              {intl.get('delete')}
            </button>
          </div>
        )}
      </div>
    );
  }

  renderPaymentSelector() {
    const { orderData } = this.state;

    let showSaveToProfileOption;
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'PUBLIC') {
      showSaveToProfileOption = false;
    } else {
      showSaveToProfileOption = true;
    }

    if (
      orderData
      && orderData._order
      && orderData._order[0]
    ) {
      if (
        orderData._order[0]._paymentinstrumentselector
        && orderData._order[0]._paymentinstrumentselector[0]
      ) {
        return (
          <PaymentSelectorMain
            shouldPostToProfile={false}
            showSaveToProfileOption={showSaveToProfileOption}
            paymentInstrumentSelector={orderData._order[0]._paymentinstrumentselector[0]}
            onChange={() => {
              this.fetchProfileData();
              this.fetchOrderData();
            }}
            disableAddPayment={false}
            allowSelectionContainerHighlight
          />
        );
      }
      if (
        orderData._order[0]._paymentmethodinfo
        && orderData._order[0]._paymentmethodinfo[0]
      ) {
        return (
          <PaymentSelectorMain
            shouldPostToProfile={false}
            showSaveToProfileOption={showSaveToProfileOption}
            paymentMethodInfo={orderData._order[0]._paymentmethodinfo[0]}
            onChange={() => {
              this.fetchProfileData();
              this.fetchOrderData();
            }}
            disableAddPayment={false}
          />
        );
      }
    }

    // There is no paymentMethod and paymentInstrument.
    return (
      <PaymentSelectorMain
        shouldPostToProfile={false}
        paymentInstrumentSelector={{}}
        onChange={() => {
          this.fetchProfileData();
          this.fetchOrderData();
        }}
        disableAddPayment={false}
      />
    );
  }

  render() {
    const {
      orderData, isLoading, profileData, showGiftCard, certificates,
    } = this.state;
    if (orderData && !isLoading) {
      const { messages } = orderData._order[0];
      const email = profileData && profileData._emails[0]._element ? profileData._emails[0]._element[0].email : '';
      const deliveries = orderData._order[0]._deliveries;
      const needShipmentDetails = messages.find(message => message.id === 'need.shipping.address');

      return (
        <div className="checkout-container container">
          <div className="checkout-container-inner">
            <div data-region="checkoutTitleRegion" className="checkout-title-container">
              <div>
                <h1 className="view-title">
                  {intl.get('checkout-summary')}
                </h1>
              </div>
            </div>
            <div className="checkout-main-container-wrap">
              <div className="checkout-main-container">
                { profileData ? (
                  <div className="profile-info-container">
                    <h3 className="profile-info-container-title">
                      {intl.get('general')}
                    </h3>
                    <div className="profile-info-col">
                      <div className="profile-info-block">
                        <div className="profile-email-info">
                          <span className="feedback-label">{ email === '' && intl.get('email-validation') }</span>
                          <ProfileemailinfoMain profileInfo={profileData} onChange={this.fetchProfileData} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (<div />)}
                <div className="profile-info-container">
                  <h3 className="profile-info-container-title">
                    {intl.get('shipping')}
                  </h3>
                  <div className="profile-info-col">
                    <div className="profile-info-block">
                      <div data-region="billingAddressesRegion">
                        {this.renderBillingAddressSelector()}
                        {this.renderNewAddressModal()}
                      </div>
                    </div>
                  </div>
                  {(needShipmentDetails || deliveries) && (
                    <div className="profile-info-col">
                      <div className="profile-info-block">
                        <div className="checkout-shipping-container">
                          {this.renderShippingAddressSelector()}
                          <div data-region="shippingOptionsRegion">
                            {this.renderShippingOptionsSelector()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="profile-info-container">
                  <h3 className="profile-info-container-title">
                    {intl.get('payment')}
                  </h3>
                  {showGiftCard && (
                  <div className="profile-info-col">
                    <div className="profile-info-block">
                      <GiftcertificateFormMain updateCertificate={this.handleCertificate} />
                    </div>
                  </div>
                  )}
                  <div className="profile-info-col">
                    {this.renderPaymentSelector()}
                  </div>
                  <div className="profile-info-col">
                    <PurchaseOrderWidget
                      orderPaymentData={orderData}
                      onChange={() => {
                        this.fetchProfileData();
                        this.fetchOrderData();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="checkout-sidebar" data-region="checkoutOrderRegion">
                <div>
                  <h2>
                    {intl.get('order-summary')}
                  </h2>
                  <div className="checkout-sidebar-inner">
                    <div data-region="checkoutSummaryRegion" className="checkout-summary-container" style={{ display: 'inline-block' }}>
                      <CheckoutSummaryList data={orderData} giftCards={certificates} onChange={() => { this.fetchOrderData(); }} />
                    </div>
                    <div data-region="checkoutActionRegion" className="checkout-submit-container">
                      <button className="ep-btn primary btn-cmd-submit-order" type="button" disabled={messages[0]} onClick={() => { this.reviewOrder(); }}>
                        {intl.get('complete-order')}
                      </button>
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
      <div className="checkout-container container">
        <div className="checkout-container-inner">
          <div data-region="checkoutTitleRegion" className="checkout-title-container">
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
    );
  }
}

export default CheckoutPage;
