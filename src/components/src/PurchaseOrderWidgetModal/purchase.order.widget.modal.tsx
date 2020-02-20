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
import _ from 'lodash';
import Modal from 'react-responsive-modal';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import './purchase.order.widget.modal.less';
import MessageContainer from '../MessageContainer/messagecontainer';

let Config: IEpConfig | any = {};

interface PurchaseOrderWidgetModalState {
  isLoading: boolean,
  inputTextValue: string,
}

interface PurchaseOrderWidgetModalProps {
  /** Determines whether or not to show the modal. */
  openModal: boolean,
  /** The respective PO widget uri to POST to and create a PO widget payment instrument. */
  createPaymentInstrumentActionUri: string,
  /** Callback that is invoked when modal is closed. */
  handleCloseModal: (...args: any[]) => any,
}

class PurchaseOrderWidgetModal extends React.Component<PurchaseOrderWidgetModalProps, PurchaseOrderWidgetModalState> {
  constructor(props) {
    super(props);
    const epConfig = getConfig();
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      isLoading: false,
      inputTextValue: '',
    };
    Config = epConfig.config;
    this.createPOPaymentInstrument = this.createPOPaymentInstrument.bind(this);
    this.updateInputState = this.updateInputState.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  generatePOPaymentPostBody() {
    const { inputTextValue } = this.state;

    return {
      'limit-amount': '0',
      'payment-instrument-identification-form': {
        'display-name': 'aDisplayName',
        'purchase-order': inputTextValue,
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  createErrorMessageBody(postResultJson) {
    if (postResultJson) {
      const body = {
        type: postResultJson.type,
        debugMessages: postResultJson['debug-message'],
        id: postResultJson.id,
      };
      return body;
    }

    return {};
  }

  // eslint-disable-next-line class-methods-use-this
  async createPOPaymentInstrument() {
    const { createPaymentInstrumentActionUri, handleCloseModal } = this.props;
    const { inputTextValue } = this.state;

    const postResult = await cortexFetch(
      `${createPaymentInstrumentActionUri}/?followlocation=true`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify(this.generatePOPaymentPostBody()),
      },
    );

    const postResultJson = await postResult.json();

    if (postResult.status === 200 || postResult.status === 201) {
      handleCloseModal();
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  updateInputState(event) {
    this.setState({ inputTextValue: event.target.value });
  }

  render() {
    const { openModal, handleCloseModal } = this.props;
    const { isLoading } = this.state;
    const { inputTextValue } = this.state;

    return (
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="modal-lg po-modal-container">
          <div className="po-modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                Add Purchase Order
              </h2>
            </div>
            <div className="modal-body">
              <form id="po_modal_form">
                <div className="purchase-order-widget-modal-input-container">
                  <input value={inputTextValue} className="form-control" type="text" placeholder="Enter Purchase Order Number (PO)" onChange={this.updateInputState} />
                </div>
                <div className="form-group action-row">
                  {
                    (isLoading) ? <div className="miniLoader" /> : ('')
                  }
                  <div className="form-input btn-container">
                    <button className="ep-btn btn-auth-register" id="login_modal_register_button" data-toggle="collapse" data-target=".navbar-collapse" type="button" onClick={this.createPOPaymentInstrument}>
                      {intl.get('save')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default PurchaseOrderWidgetModal;
