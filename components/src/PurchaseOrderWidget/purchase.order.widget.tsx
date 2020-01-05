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
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import './purchase.order.widget.less';

let Config: IEpConfig | any = {};
let isTypingTimer = null;

interface PurchaseOrderWidgetState {
  isLoading: boolean,
  PONumber: string;
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
      isLoading: true,
      PONumber: null,
    };
    this.renderPurchaseOrderTextBox = this.renderPurchaseOrderTextBox.bind(this);
    this.startValidationTimer = this.startValidationTimer.bind(this);
    this.clearIsTypingTimer = this.clearIsTypingTimer.bind(this);
  }

  // TODO: resets the typing timer.
  clearIsTypingTimer() {
    if (isTypingTimer != null) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ isLoading: false });
      clearTimeout(isTypingTimer);
      isTypingTimer = null;
    }
  }

  // TODO: This function will verify and return everytime there is a change...
  startValidationTimer() {
    const { timeoutBeforeVerify } = this.props;
    const verifyPONumberHelper = () => {
      console.log('timeout ended so we can validate the po number');
      this.setState({ isLoading: true });
      isTypingTimer = null;
    };

    // if the typing timer has not been set or one does not currently exist.
    if (isTypingTimer == null) {
      const timeID = setTimeout(verifyPONumberHelper, timeoutBeforeVerify);
      isTypingTimer = timeID;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  renderPurchaseOrderTextBox() {
    // TODO:
    return (
      <div className="purchase-order-widget-input-container">
        <input className="form-control" type="text" placeholder="Enter Purchase Order Number (PO)" onKeyUp={this.startValidationTimer} onKeyDown={this.clearIsTypingTimer} />
        <div className="miniLoader-container">
          <div className="miniLoader" />
        </div>
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
