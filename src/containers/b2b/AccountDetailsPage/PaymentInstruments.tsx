
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
import Modal from 'react-responsive-modal';
import { cortexFetch } from '../../../components/src/utils/Cortex';
import { login } from '../../../hooks/store';
import * as Config from '../../../ep.config.json';
import './PaymentInstruments.scss';


interface AccountMainState {
  paymentInstruments: any;
  isShowConfirmModal: boolean;
  deletePaymentUri: string;
  isDataLoading: boolean;
  isDeleteLoading: boolean;
}

interface AccountMainRouterProps {
}

const zoomArray = [
  'element',
  'element:paymentmethod',
  'element:paymentmethod:requestinstructionsform',
  'element:requestinstructionsform',
  'default',
  'defaultinstrumentselector',
  'defaultinstrumentselector:chosen',
  'defaultinstrumentselector:choice',
  'defaultinstrumentselector:choice:description',
  'defaultinstrumentselector:choice:selectaction',
];

class PaymentInstruments extends React.Component<AccountMainRouterProps, AccountMainState> {
  constructor(props: any) {
    super(props);
    this.state = {
      paymentInstruments: {},
      isDataLoading: true,
      isShowConfirmModal: false,
      isDeleteLoading: false,
      deletePaymentUri: '',

    };

    this.getPayments = this.getPayments.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleConfirmModal = this.handleConfirmModal.bind(this);
  }


  componentDidMount() {
    this.getPayments();
  }

  handleConfirmModal(PaymentUri = '') {
    const { isShowConfirmModal } = this.state;
    this.setState({
      isShowConfirmModal: !isShowConfirmModal,
      deletePaymentUri: PaymentUri,
    });
  }

  handleDelete(PaymentUri) {
    this.setState({
      isDeleteLoading: true,
    });

    login().then(() => {
      cortexFetch(PaymentUri, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({}),
      })
        .then(() => {
          this.getPayments();
        });
    });
  }

  async handleDefaultCheck(paymentUri) {
    const { paymentInstruments } = this.state;
    const selectedPayment = paymentInstruments._defaultinstrumentselector[0]._choice.find(choice => choice._description[0].self.uri === paymentUri.self.uri);
    if (selectedPayment && selectedPayment._selectaction) {
      login().then(() => {
        cortexFetch(`${selectedPayment._selectaction[0].self.uri}`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({}),
        })
          .then(() => {
            this.getPayments();
          });
      });
    }
  }

  async getPayments() {
    const res = await cortexFetch(`/paymentinstruments/${Config.cortexApi.scope}/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(result => result.json());
    if (res) {
      if (res._element) {
        this.setState({
          paymentInstruments: res,
          isShowConfirmModal: false,
          isDeleteLoading: false,
          isDataLoading: false,
        });
      }
    }
  }

  confirmationModal() {
    const { isShowConfirmModal, deletePaymentUri, isDeleteLoading } = this.state;

    return (
      <Modal
        open={isShowConfirmModal}
        onClose={() => this.handleConfirmModal()}
        classNames={{ modal: 'delete-address-dialog' }}
      >
        <div className="dialog-header">{intl.get('delete-payment-instrument')}</div>
        <div className="dialog-content">
          <p>
            {intl.get('delete-payment-instrument-confirmation')}
          </p>
        </div>
        <div className="dialog-footer btn-container">
          <button className="ep-btn cancel" type="button" onClick={() => this.handleConfirmModal()}>{intl.get('cancel')}</button>
          <button className="ep-btn primary upload" type="button" onClick={() => this.handleDelete(deletePaymentUri)}>
            {intl.get('delete')}
          </button>
        </div>
        {isDeleteLoading && (
          <div className="loader-wrapper">
            <div className="miniLoader" />
          </div>
        )}
      </Modal>
    );
  }

  render() {
    const { paymentInstruments, isDataLoading } = this.state;

    return (
      <div className="container">
        <p className="title">
          {intl.get('payment-instruments')}
        </p>
        {isDataLoading ? (
          <div className="loader" />
        ) : (
          <table className="b2b-table accounts-table">
            <thead>
              <tr>
                <th className="defaults">
                  {intl.get('defaults')}
                </th>
                <th className="name">
                  {intl.get('payment-type')}
                </th>
                <th className="external-id">{intl.get('display-name')}</th>
                <th className="action">{intl.get('action')}</th>
              </tr>
            </thead>
            <tbody>
              {paymentInstruments._element && paymentInstruments._element.map(instrument => (
                <tr key={instrument.self.uri} className="account-list-rows" onClick={() => {}}>
                  <td className="defaults">
                    <input type="radio" name="paymentSelection" id="paymentSelection" className="style-radio" checked={instrument['default-on-profile']} readOnly />
                    <label role="presentation" htmlFor="paymentSelection" onClick={() => this.handleDefaultCheck(instrument)} />
                  </td>
                  <td className="name">{instrument._paymentmethod[0]['display-name']}</td>
                  <td className="external-id">{instrument.name}</td>
                  <td className="action-column">
                    <div role="presentation" onClick={() => this.handleConfirmModal(instrument.self.uri)}>
                      {intl.get('delete')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {this.confirmationModal()}
      </div>
    );
  }
}

export default PaymentInstruments;
