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
import Messagecontainer from '../MessageContainer/messagecontainer';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import './purchase.order.widget.less';
import PurchaseOrderWidgetModal from '../PurchaseOrderWidgetModal/purchase.order.widget.modal';

let Config: IEpConfig | any = {};

interface PurchaseOrderWidgetState {
  orderPaymentData: any,
  poModalOpen: boolean,
  isChosen: boolean,
}

interface PurchaseOrderWidgetProps {
  timeoutBeforeVerify: number,
  onPayWithPO: (...args: any[]) => any,
}

class PurchaseOrderWidget extends React.Component<PurchaseOrderWidgetProps, PurchaseOrderWidgetState> {

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    this.state = {
      isChosen: false,
      orderPaymentData: {},
      poModalOpen: false,
    };
    this.getChosenFromOrderData = this.getChosenFromOrderData.bind(this);
    this.renderPONumber = this.renderPONumber.bind(this);
    this.fetchPaymentOrderData = this.fetchPaymentOrderData.bind(this);
    this.doesPayWithPOMethodExist = this.doesPayWithPOMethodExist.bind(this);
    this.getPOPaymentMethodUri = this.getPOPaymentMethodUri.bind(this);
    this.getPOMethodInfoFromOrderData = this.getPOMethodInfoFromOrderData.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.initializeIsChosen = this.initializeIsChosen.bind(this);
  }

  async componentDidMount() {
    const orderPaymentData = await this.fetchPaymentOrderData();
    this.initializeIsChosen(orderPaymentData);
    this.setState({ orderPaymentData });
  }

  initializeIsChosen(orderPaymentData) {
    const chosen = this.getChosenFromOrderData(orderPaymentData);

    if (chosen !== undefined) {
      const purchaseOrder = chosen[0]._description[0]['payment-instrument-identification-attributes']['purchase-order'];
      if (purchaseOrder !== undefined) {
        this.setState({ isChosen: true });
        return;
      }
    }

    this.setState({ isChosen: false });
  }

  // eslint-disable-next-line class-methods-use-this
  doesPayWithPOMethodExist() {
    if (this.getPOMethodInfoFromOrderData() !== undefined) {
      return true;
    }
    return false;
  }

  getPOMethodInfoFromOrderData() {
    const { orderPaymentData } = this.state;
    // console.log(orderPaymentData);
    let paymentMethodInfoElems;
    if (orderPaymentData != null) {
      try {
        paymentMethodInfoElems = orderPaymentData._defaultcart[0]._order[0]._paymentmethodinfo[0]._element;
      // eslint-disable-next-line no-empty
      } catch (err) {
      }
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

  // eslint-disable-next-line class-methods-use-this
  async fetchPaymentOrderData() {
    const orderZoomArray = [
      'defaultcart:order:paymentinstrumentselector:choice:description',
      'defaultcart:order:paymentinstrumentselector:chosen:description',
      'defaultcart:order:paymentinstrumentselector:default:description',
      'defaultcart:order:paymentmethodinfo:element:paymentinstrumentform',
    ];

    const fetchedDataProm = await cortexFetch(`/?zoom=${orderZoomArray.sort().join()}`);
    const orderPaymentData = await fetchedDataProm.json();

    return orderPaymentData;
  }

  // eslint-disable-next-line class-methods-use-this
  getChosenFromOrderData(orderPaymentData) {
    let chosenPaymentMethod;

    try {
      chosenPaymentMethod = orderPaymentData._defaultcart[0]._order[0]._paymentinstrumentselector[0]._chosen;
    // eslint-disable-next-line no-empty
    } catch (err) {
    }
    console.log('chosenPaymentMethod');
    console.log(chosenPaymentMethod);
    return chosenPaymentMethod;
  }

  renderPONumber() {
    const { orderPaymentData } = this.state;
    const chosen = this.getChosenFromOrderData(orderPaymentData);

    let purchaseOrder;

    try {
      purchaseOrder = chosen[0]._description[0]['payment-instrument-identification-attributes']['purchase-order'];
    // eslint-disable-next-line no-empty
    } catch (err) {

    }

    return purchaseOrder;
  }

  handleCloseModal() {
    this.setState({ poModalOpen: false });
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
              { intl.get('pay-with-po') }
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
