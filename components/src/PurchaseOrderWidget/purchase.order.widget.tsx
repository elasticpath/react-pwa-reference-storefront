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

const POInputStates = {
  LOADING: 'LOADING',
  VERIFIED: 'VERIFIED',
  ERROR: 'ERROR',
};

// NOTE: Remove this when using this component in a real implementation! only here to simulate PO number validation.
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

  clearIsTypingTimer(event) {
    if (isTypingTimer != null) {
      this.setState({ inputStatus: POInputStates.LOADING });
      clearTimeout(isTypingTimer);
      isTypingTimer = null;
    }
  }

  updateInputState(event) {
    this.setState({ inputTextValue: event.target.value });
  }

  verifyPONumber() {
    const { inputTextValue } = this.state;

    // NOTE: This should be replaced with a network request to validate the PO number entered.  A timeout is placed here as a placeholder.
    setTimeout(() => {
      if (dummyValidPONumbers.has(inputTextValue)) {
        this.setState({ inputStatus: POInputStates.VERIFIED });
      } else {
        this.setState({ inputStatus: POInputStates.ERROR });
      }
    }, 1000);

    isTypingTimer = null;
  }

  startValidationTimer(event) {
    const { timeoutBeforeVerify } = this.props;
    if (isTypingTimer == null) {
      const timeID = setTimeout(() => {
        this.verifyPONumber();
      }, timeoutBeforeVerify);
      this.setState({ inputStatus: POInputStates.LOADING });
      isTypingTimer = timeID;
    }
  }

  renderInputStatus() {
    const { inputStatus } = this.state;

    switch (inputStatus) {
      case POInputStates.LOADING:
        return (
          <div className="inputLoader-container">
            <div className="inputLoader" />
          </div>);
      case POInputStates.VERIFIED:
        return (
          <div className="inputLoader-container">
            <div className="checkmark chosen" />
          </div>);
      default:
        return null;
    }
  }

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
          inputStatus === POInputStates.ERROR && (
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
          <button className="view-button-inactive" disabled type="button" onClick={() => { }}>
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
