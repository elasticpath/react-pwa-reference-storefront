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
import { Messagecontainer } from '@elasticpath/store-components';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import './purchase.order.widget.less';

let Config: IEpConfig | any = {};
let isTypingTimer = null;

const dummyValidPONumbers = new Set(['1234', '2345', '3456']);

interface PurchaseOrderWidgetState {
  inputStatus: string,
  inputTextValue: string,
}

interface PurchaseOrderWidgetProps {
  timeoutBeforeVerify: number;
}

class PurchaseOrderWidget extends React.Component<PurchaseOrderWidgetProps, PurchaseOrderWidgetState> {
  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    this.state = {
      inputStatus: '',
      inputTextValue: '',
    };
    this.renderPurchaseOrderTextBox = this.renderPurchaseOrderTextBox.bind(this);
    this.startValidationTimer = this.startValidationTimer.bind(this);
    this.clearIsTypingTimer = this.clearIsTypingTimer.bind(this);
    this.verifyPONumber = this.verifyPONumber.bind(this);
    this.renderInputStatus = this.renderInputStatus.bind(this);
    this.updateInputState = this.updateInputState.bind(this);
  }

  // TODO: resets the typing timer.
  clearIsTypingTimer(event) {
    if (isTypingTimer != null) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ inputStatus: 'loading' });
      clearTimeout(isTypingTimer);
      isTypingTimer = null;
    }
  }

  updateInputState(event) {
    this.setState({ inputTextValue: event.target.value });
  }

  verifyPONumber() {
    const { inputTextValue } = this.state;
    console.log('timeout ended so we can validate the po number');
    // TODO: write dummy PO number validation...
    setTimeout(() => {
      if (dummyValidPONumbers.has(inputTextValue)) {
        // We need to a couple states for the input bar...
        this.setState({ inputStatus: 'verified' });
      } else {
        this.setState({ inputStatus: 'error' });
      }
    }, 1000);

    isTypingTimer = null;
  }

  // TODO: This function will verify and return everytime there is a change...
  startValidationTimer(event) {
    const { timeoutBeforeVerify } = this.props;
    if (isTypingTimer == null) {
      const timeID = setTimeout(() => {
        this.verifyPONumber();
      }, timeoutBeforeVerify);
      isTypingTimer = timeID;
    }
  }

  renderInputStatus() {
    const { inputStatus } = this.state;

    switch (inputStatus) {
      case 'loading':
        return (
          <div className="miniLoader-container">
            <div className="miniLoader" />
          </div>);
      case 'verified':
        return (
          <div className="miniLoader-container">
            <div className="checkmark chosen" />
          </div>);
      default:
        return null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  renderPurchaseOrderTextBox() {
    const { inputTextValue, inputStatus } = this.state;
    const warningMessage = {
      debugMessages: 'Invalid PO number',
      type: 'error',
      id: 'field.invalid.email.format',
    };
    return (
      <div>
        <div className="purchase-order-widget-input-container">
          <input value={inputTextValue} className="form-control" type="text" placeholder="Enter Purchase Order Number (PO)" onChange={this.updateInputState} onKeyUp={this.startValidationTimer} onKeyDown={this.clearIsTypingTimer} />
          {this.renderInputStatus()}
        </div>
        {
          inputStatus === 'error' && (
            <div>
              <Messagecontainer message={[warningMessage]} />
            </div>
          )
        }
      </div>
    );
  }

  render() {
    return (
      <div className="purchase-order-widget-container">
        <div className="purchase-order-widget-top">
          <h2>
            {'Purchase Order'}
          </h2>
          <button className="view-button-inactive" disabled type="button" onClick={() => { console.log('clicked'); }}>
            {'View'}
          </button>
        </div>
        <div data-region="paymentMethodSelectorsRegion" className="checkout-region-inner-container">
          {this.renderPurchaseOrderTextBox()}
        </div>
        <button className="ep-btn primary wide pay-with-po-btn" disabled={false} type="button" onClick={() => {}}>
          {'Pay with PO'}
        </button>
      </div>);
  }
}

export default PurchaseOrderWidget;
