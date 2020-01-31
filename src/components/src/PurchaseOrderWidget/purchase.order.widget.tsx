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
  isSelectedPaymentInstrument: boolean,
  PONumber: string,
  orderPaymentData: any,
  poModalOpen: boolean,
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
      isSelectedPaymentInstrument: false,
      PONumber: '',
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
  }

  async componentDidMount() {
    console.log('componentdidupdate is running');
    const a = await this.fetchPaymentOrderData();
  }

  // eslint-disable-next-line class-methods-use-this
  doesPayWithPOMethodExist() {
    if (this.getPOMethodInfoFromOrderData) {
      return true;
    }
    return false;
  }

  getPOMethodInfoFromOrderData() {
    const { orderPaymentData } = this.state;
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
        if (purchaseOrder === '') {
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
      console.log(POMethodInfo._paymentinstrumentform[0].links[0].uri);
      return POMethodInfo._paymentinstrumentform[0].links[0].uri;
    }
  }

  // Will fetch all the information and will make an internal front end representation...
  // eslint-disable-next-line class-methods-use-this
  async fetchPaymentOrderData() {
    console.log('fetchOrderPayment is running');
    // We are going to fetch PO number info...
    // We are going to see whether we have a payment method available and see if it has been selected...
    const orderZoomArray = [
      'defaultcart:order:paymentinstrumentselector:choice:description',
      'defaultcart:order:paymentinstrumentselector:chosen:description',
      'defaultcart:order:paymentinstrumentselector:default:description',
      'defaultcart:order:paymentmethodinfo:element:paymentinstrumentform',
    ];

    const fetchedDataProm = await cortexFetch(`/?zoom=${orderZoomArray.sort().join()}`);
    const orderPaymentData = await fetchedDataProm.json();

    this.setState({ orderPaymentData });
  }

  getChosenFromOrderData() {
    const { orderPaymentData } = this.state;
    let chosenPaymentMethod;

    try {
      chosenPaymentMethod = orderPaymentData._defaultcart[0]._order[0]._paymentinstrumentselector[0]._chosen;
    } catch (err) {
      console.warn('unable to find chosen payment method');
    }

    return chosenPaymentMethod;
  }

  renderPONumber() {
    const { orderPaymentData } = this.state;
    // this will find the po number from the paywithPO
    // We need to look for the chosen value here...

    const chosen = this.getChosenFromOrderData();

    let purchaseOrder;

    try {
      purchaseOrder = chosen[0]._description[0]['payment-instrument-identification-attributes']['purchase-order'];
    // eslint-disable-next-line no-empty
    } catch(err) {
    }

    if (purchaseOrder) {
      return (
        <h2>{purchaseOrder}</h2>
      );
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
    const { poModalOpen } = this.state;
    if (this.doesPayWithPOMethodExist() !== undefined) {
      return (
        <div>
          <div className="purchase-order-widget-container">
            <div className="purchase-order-widget-top">
              <h2>
                { intl.get('purchase-order') }
              </h2>
              {this.renderPONumber()}
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
