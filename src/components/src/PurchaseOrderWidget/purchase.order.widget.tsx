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
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import './purchase.order.widget.less';
import PurchaseOrderWidgetModal from '../PurchaseOrderWidgetModal/purchase.order.widget.modal';

let Config: IEpConfig | any = {};

interface PurchaseOrderWidgetState {
  poModalOpen: boolean,
  isChosen: boolean,
}

interface PurchaseOrderWidgetProps {
  /** Called when the purchase order widget is closed -- meant as a callback to refresh the PO widget modal. */
  onChange?: (...args: any[]) => any,
  /** Order data to be passed to PO widget */
  orderPaymentData: any,
}

class PurchaseOrderWidget extends React.Component<PurchaseOrderWidgetProps, PurchaseOrderWidgetState> {
  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    this.state = {
      isChosen: false,
      poModalOpen: false,
    };
    this.renderPONumber = this.renderPONumber.bind(this);
    this.doesPayWithPOMethodExist = this.doesPayWithPOMethodExist.bind(this);
    this.getPOPaymentMethodUri = this.getPOPaymentMethodUri.bind(this);
    this.getPOMethodInfoFromOrderData = this.getPOMethodInfoFromOrderData.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  // eslint-disable-next-line consistent-return
  static getDerivedStateFromProps(props, state) {
    const { orderPaymentData } = props;

    const chosen = PurchaseOrderWidget.getChosenFromOrderData(orderPaymentData);
    try {
      const newPONumber = chosen[0]._description[0]['payment-instrument-identification-attributes']['purchase-order'];

      if (newPONumber !== undefined) {
        return { isChosen: true };
      }
    } catch {
      return { isChosen: false };
    }
    return { isChosen: false };
  }

  doesPayWithPOMethodExist() {
    if (this.getPOMethodInfoFromOrderData() !== undefined) {
      return true;
    }
    return false;
  }

  getPOMethodInfoFromOrderData() {
    const { orderPaymentData } = this.props;

    let paymentMethodInfoElems;
    if (orderPaymentData != null) {
      try {
        paymentMethodInfoElems = orderPaymentData._order[0]._paymentmethodinfo[0]._element;
      // eslint-disable-next-line no-empty
      } catch {}
    }

    if (paymentMethodInfoElems) {
      return paymentMethodInfoElems.find((e) => {
        const purchaseOrder = e._paymentinstrumentform[0]['payment-instrument-identification-form']['purchase-order'];
        if (typeof purchaseOrder === 'string') {
          return true;
        }
        return false;
      });
    }

    return undefined;
  }

  // eslint-disable-next-line consistent-return
  getPOPaymentMethodUri() {
    const POMethodInfo = this.getPOMethodInfoFromOrderData();
    if (POMethodInfo) {
      return POMethodInfo._paymentinstrumentform[0].links[0].uri;
    }
  }

  static getChosenFromOrderData(orderPaymentData) {
    let chosenPaymentMethod;

    try {
      chosenPaymentMethod = orderPaymentData._order[0]._paymentinstrumentselector[0]._chosen;
    // eslint-disable-next-line no-empty
    } catch {
      return chosenPaymentMethod;
    }

    return chosenPaymentMethod;
  }

  // eslint-disable-next-line consistent-return
  renderPONumber() {
    const { orderPaymentData } = this.props;

    const chosen = PurchaseOrderWidget.getChosenFromOrderData(orderPaymentData);
    let purchaseOrder = '';

    try {
      purchaseOrder = chosen[0]._description[0]['payment-instrument-identification-attributes']['purchase-order'];

      return purchaseOrder;
    } catch {
      return purchaseOrder;
    }
  }

  handleCloseModal() {
    const { onChange } = this.props;
    this.setState({ poModalOpen: false }, onChange());
  }

  renderModal() {
    this.setState({ poModalOpen: true });
  }

  render() {
    const { poModalOpen, isChosen } = this.state;
    if (this.doesPayWithPOMethodExist()) {
      return (
        <div>
          <div className={`purchase-order-widget-container ${isChosen ? 'selected' : 'unselected'}`}>
            <div className="purchase-order-widget-top">
              <h2>
                { intl.get('purchase-order') }
              </h2>
              <h2>
                {this.renderPONumber()}
              </h2>
            </div>
            <button className="ep-btn primary wide pay-with-po-btn" disabled={false} type="button" onClick={this.renderModal}>
              { intl.get('add-po') }
            </button>
          </div>
          <div>
            <PurchaseOrderWidgetModal openModal={poModalOpen} createPaymentInstrumentActionUri={this.getPOPaymentMethodUri()} handleCloseModal={this.handleCloseModal} />
          </div>
        </div>);
    }

    return null;
  }
}

export default PurchaseOrderWidget;
