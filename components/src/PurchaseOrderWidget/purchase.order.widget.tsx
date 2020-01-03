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

interface PurchaseOrderWidgetState {
}

interface PurchaseOrderWidgetProps {
}

class PurchaseOrderWidget extends React.Component<PurchaseOrderWidgetProps, PurchaseOrderWidgetState> {
  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    this.renderPurchaseOrderTextBox = this.renderPurchaseOrderTextBox.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  renderPurchaseOrderTextBox() {
    // TODO:
    return (<input id="CardHolderName" name="CardHolderName" className="form-control" type="text" placeholder="Enter Purchase Order Number (PO)" />);
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
