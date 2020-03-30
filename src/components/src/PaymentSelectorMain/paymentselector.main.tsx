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
import Modal from 'react-responsive-modal';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import PaymentFormMain from '../PaymentForm/paymentform.main';
import PaymentMethodContainer from '../PaymentMethodContainer/paymentmethod.container';

import './paymentselector.main.less';

let Config: IEpConfig | any = {};

interface PaymentSelectorMainProps {
  /** handle payment method change */
  onChange: (...args: any[]) => any,
  /** disable add a new payment method */
  disableAddPayment?: boolean,
  /** on Selection or Deletion error */
  onError?: any,
  /** Sets the nested payment form to either post to profile or order */
  shouldPostToProfile?: boolean,
  /** Payment Instrument Selector json object to be rendered */
  paymentInstrumentSelector?: any,
  /** paymentmethod from profile resource to be rendered */
  paymentMethods?: any,
  /** paymentMethodInfo from orders resource to be rendered */
  paymentMethodInfo?: any,
  /** shows the save to profile option in the payment form */
  showSaveToProfileOption?: boolean
  /** boolean that allows for highlight around container when a payment is selected. defaults to false */
  allowSelectionContainerHighlight?: boolean
}

interface PaymentSelectorMainState {
  openNewPaymentModal: boolean,
  isLoading: boolean,
}

class PaymentSelectorMain extends Component<PaymentSelectorMainProps, PaymentSelectorMainState> {
  constructor(props) {
    super(props);

    this.state = {
      openNewPaymentModal: false,
      isLoading: false,
    };

    const epConfig = getConfig();
    Config = epConfig.config;

    this.handleCloseNewPaymentModal = this.handleCloseNewPaymentModal.bind(this);
    this.handlePaymentInstrumentSelection = this.handlePaymentInstrumentSelection.bind(this);
    this.renderProfilePaymentMethods = this.renderProfilePaymentMethods.bind(this);
    this.renderPayments = this.renderPayments.bind(this);
    this.renderPaymentInstrumentSelector = this.renderPaymentInstrumentSelector.bind(this);
    this.renderOrderPaymentMethodInfo = this.renderOrderPaymentMethodInfo.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  handleDelete(link) {
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

  handleCloseNewPaymentModal() {
    this.setState({ openNewPaymentModal: false });
  }

  newPayment() {
    this.setState({ openNewPaymentModal: true });
  }

  // eslint-disable-next-line class-methods-use-this
  getSortedChosenAndChoicePaymentInstrumentsAlphabetically(paymentInstrumentSelector) {
    let allPaymentInstruments;

    if (paymentInstrumentSelector._choice && paymentInstrumentSelector._chosen) {
      allPaymentInstruments = [...paymentInstrumentSelector._choice, { ...paymentInstrumentSelector._chosen[0], chosen: true }];
    } else if (paymentInstrumentSelector._chosen) {
      allPaymentInstruments = [{ ...paymentInstrumentSelector._chosen[0], chosen: true }];
    } else if (paymentInstrumentSelector._choice) {
      allPaymentInstruments = [...paymentInstrumentSelector._choice];
    } else {
      return null;
    }

    return allPaymentInstruments.sort((paymentInstrumentA, paymentInstrumentB) => {
      const paymentInstrumentNameA = paymentInstrumentA._description[0].name;
      const paymentInstrumentNameB = paymentInstrumentB._description[0].name;
      return paymentInstrumentNameA.localeCompare(paymentInstrumentNameB);
    });
  }

  async handlePaymentInstrumentSelection(selectAction, event) {
    const { onChange, onError } = this.props;
    if (selectAction) {
      this.setState({ isLoading: true });

      try {
        const res = await cortexFetch(`${selectAction}?followlocation=true`,
          {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
          });

        if (res.status === 201 || res.status === 200) {
          onChange();
          this.setState({ isLoading: false });
        } else {
          this.setState({ isLoading: false });
          event.preventDefault();

          if (onError) {
            onError(res.statusText);
          }
        }
      } catch (err) {
        onError(err);
        event.preventDefault();
      }
    }
  }

  static findSelectActionFromLinks(links) {
    const selectActionLink = links.find((link) => {
      if (link.rel === 'selectaction') {
        return true;
      }
      return false;
    });

    return selectActionLink.uri;
  }

  renderPaymentInstrumentSelector() {
    const { paymentInstrumentSelector } = this.props;

    if (paymentInstrumentSelector) {
      const sortedPaymentInstrumentSelectors = this.getSortedChosenAndChoicePaymentInstrumentsAlphabetically(paymentInstrumentSelector);

      if (sortedPaymentInstrumentSelectors) {
        return (
          sortedPaymentInstrumentSelectors.map((paymentInstrument, index) => {
            const displayName = paymentInstrument._description[0].name;
            const checked = paymentInstrument.chosen !== undefined;
            const selectAction = PaymentSelectorMain.findSelectActionFromLinks(paymentInstrument.links);
            const descriptionUri = paymentInstrument._description[0].self.uri;

            if (paymentInstrument._description[0]['payment-instrument-identification-attributes']['purchase-order'] === undefined) {
              return (
                <ul key={`profile_payment_${Math.random().toString(36).substr(2, 9)}`} className="profile-payment-methods-listing">
                  <li className="profile-payment-method-container">
                    <div data-region="paymentMethodComponentRegion" className="profile-payment-method-label-container">
                      <input type="radio" defaultChecked={checked} id={`payment-method-${index}`} onClick={event => this.handlePaymentInstrumentSelection(selectAction, event)} className="style-radio" />
                      <label htmlFor={`payment-method-${index}`} />
                      <span data-el-value="payment.token" className="payment-instrument-name-container">
                        {displayName}
                      </span>
                    </div>
                    <button className="payment-delete-btn" type="button" onClick={() => { this.handleDelete(descriptionUri); }}>
                      {intl.get('delete')}
                    </button>
                  </li>
                </ul>
              );
            }

            return null;
          })
        );
      }
    }

    return (<div className="no-saved-payment-container">{intl.get('no-saved-payment-method-message')}</div>);
  }

  renderProfilePaymentMethods() {
    const { paymentMethods } = this.props;
    const paymentMethodElems = (paymentMethods && paymentMethods._element) ? paymentMethods._element : [];

    return paymentMethodElems.length > 0 ? (
      paymentMethodElems.map(paymentElement => (
        <ul key={`profile_payment_${Math.random().toString(36).substr(2, 9)}`} className="profile-payment-methods-listing">
          <li className="profile-payment-method-container">
            <div data-region="paymentMethodComponentRegion" className="profile-payment-method-label-container">
              <span data-el-value="payment.token" className="payment-method-container">
                {paymentElement['display-name']}
              </span>
            </div>
            <button className="payment-delete-btn" type="button" onClick={() => { this.handleDelete(paymentElement.self.uri); }}>
              {intl.get('delete')}
            </button>
          </li>
        </ul>
      ))
    ) : (
      <div>
        <p>
          {intl.get('no-saved-payment-method-message')}
        </p>
      </div>
    );
  }

  renderPaymentChoice(payment, index) {
    const {
      checked, deletable, selectaction,
    } = payment;

    return (
      <div key={`paymentMethod_${Math.random().toString(36).substr(2, 9)}`}>
        <div className="payment-ctrl-cell" data-region="paymentSelector">
          <input type="radio" name="paymentMethod" id={`paymentMethod-${index}`} className="payment-option-radio style-radio" defaultChecked={checked} onClick={event => this.handlePaymentInstrumentSelection(selectaction, event)} />
          <label htmlFor={`paymentMethod-${index}`} />
          <label htmlFor={`paymentMethod-${index}`}>
            <div className="paymentMethodComponentRegion" data-region="paymentMethodComponentRegion">
              <PaymentMethodContainer displayName={payment} />
            </div>
          </label>
        </div>
        {deletable && (
          <div className="payment-btn-cell">
            <button className="payment-delete-btn" type="button" onClick={() => { this.handleDelete(payment.self.uri); }}>
              {intl.get('delete')}
            </button>
          </div>
        )}
      </div>
    );
  }

  renderOrderPaymentMethodInfo() {
    const { paymentMethodInfo } = this.props;
    const paymentMethods = [];
    const paymentMethod = paymentMethodInfo._paymentmethod;

    if (paymentMethod) {
      const [description] = paymentMethod;
      description.checked = true;
      description.deletable = false;
      paymentMethods.push(description);
    }

    const selector = paymentMethodInfo._selector;

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
      paymentMethods.map((payment, index) => this.renderPaymentChoice(payment, index))
    );
  }

  renderPayments() {
    const { paymentMethods, paymentInstrumentSelector, paymentMethodInfo } = this.props;

    if (paymentInstrumentSelector) {
      return this.renderPaymentInstrumentSelector();
    }

    if (paymentMethods) {
      return this.renderProfilePaymentMethods();
    }

    if (paymentMethodInfo) {
      return this.renderOrderPaymentMethodInfo();
    }

    return null;
  }

  isSelected() {
    const { paymentInstrumentSelector, allowSelectionContainerHighlight } = this.props;

    if (allowSelectionContainerHighlight) {
      try {
        if (paymentInstrumentSelector._chosen[0]._description[0]['payment-instrument-identification-attributes']['purchase-order'] === undefined) {
          return true;
        }
      // eslint-disable-next-line no-empty
      } catch (err) {
      }
    }

    return false;
  }

  render() {
    const { openNewPaymentModal, isLoading } = this.state;
    const {
      onChange, disableAddPayment, shouldPostToProfile, showSaveToProfileOption, paymentInstrumentSelector,
    } = this.props;

    return (
      <div>
        <div className={`payments-container ${this.isSelected() ? 'selected' : 'unselected'}`}>
          <div className={`paymentMethodsRegions ${isLoading ? 'loading' : ''}`} data-region="paymentMethodsRegion">
            <div>
              <h2 className="credit-card-header">
                {intl.get('credit-cards')}
              </h2>
              { isLoading && <div className="miniLoader" /> }
              <div data-region="paymentMethodSelectorsRegion" className="checkout-region-inner-container payment-methods-wrapper">
                {this.renderPayments()}
              </div>
              <button className="ep-btn primary wide new-payment-btn" type="button" disabled={disableAddPayment} onClick={() => { this.newPayment(); }}>
                {intl.get('add-new-payment-method')}
              </button>
              <div className={`${isLoading} ? 'miniLoader' : ''`} />
              <Modal open={openNewPaymentModal} onClose={this.handleCloseNewPaymentModal}>
                <div className="modal-lg new-payment-modal">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2 className="modal-title">
                        {intl.get('new-payment-method')}
                      </h2>
                    </div>
                    <div className="modal-body">
                      <PaymentFormMain
                        defaultPostSelection={shouldPostToProfile}
                        showSaveToProfileOption={showSaveToProfileOption}
                        onCloseModal={this.handleCloseNewPaymentModal}
                        fetchData={onChange}
                      />
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentSelectorMain;
