
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
import { ReactComponent as CloseIcon } from '../../../images/icons/ic_close.svg';
import AlertContainer from '../../../components/src/AlertContainer/alert.container';

interface AccountMainState {
  paymentInstruments: any;
  isShowConfirmModal: boolean;
  deletePaymentUri: string;
  isDataLoading: boolean;
  isDeleteLoading: boolean;
  paymentMethodsData: any;
  selectedPayment: any;
  isShowAlert: boolean;
  alertMessageData: any;
}

interface AccountMainRouterProps {
  isCreateModalOpen: boolean
  history: any
  setIsCreatePaymentModalOpen: (key: boolean) => any
  checkIsDisabled: (key: boolean) => any
}

const zoomArray = [
  'paymentmethods:element',
  'paymentmethods:element:paymentinstrumentform',
  'paymentinstruments:element',
  'paymentinstruments:element:paymentmethod',
  'paymentinstruments:element:paymentmethod:requestinstructionsform',
  'paymentinstruments:element:requestinstructionsform',
  'paymentinstruments:default',
  'paymentinstruments:defaultinstrumentselector',
  'paymentinstruments:defaultinstrumentselector:chosen',
  'paymentinstruments:defaultinstrumentselector:choice',
  'paymentinstruments:defaultinstrumentselector:choice:description',
  'paymentinstruments:defaultinstrumentselector:choice:selectaction',
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
      paymentMethodsData: [],
      selectedPayment: '',
      isShowAlert: false,
      alertMessageData: '',
    };

    this.getPayments = this.getPayments.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleConfirmModal = this.handleConfirmModal.bind(this);
    this.renderNewPaymentModal = this.renderNewPaymentModal.bind(this);
    this.onSelectPayment = this.onSelectPayment.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleHideAlert = this.handleHideAlert.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    const { isPaymentAdded } = history.location.state;

    if (isPaymentAdded) {
      this.handleShowAlert(intl.get('new-payment-instrument-added'), true);
    }
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
          this.handleShowAlert(intl.get('credit-card-deleted'), true);
        });
    });
  }

  async handleDefaultCheck(paymentUri, instruments) {
    try {
      const selectedPayment = instruments._defaultinstrumentselector[0]._choice.find(choice => choice._description[0].self.uri === paymentUri.self.uri);
      if (selectedPayment && selectedPayment._selectaction) {
        await login();
        await cortexFetch(`${selectedPayment._selectaction[0].self.uri}`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        });
        await this.getPayments();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  async getPayments() {
    const { history, checkIsDisabled } = this.props;
    const { accountUri } = history.location.state;
    try {
      const res = await cortexFetch(`${accountUri}/?zoom=${zoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(result => result.json());
      if (res && res._paymentmethods && res._paymentinstruments) {
        const paymentData = res._paymentmethods[0]._element.filter((el) => {
          const keys = Object.keys(el._paymentinstrumentform[0]['payment-instrument-identification-form']);
          return keys.length === 1 && keys.indexOf('display-name') !== -1 && !el._paymentinstrumentform[0].messages[0];
        });
        this.setState({
          paymentInstruments: res._paymentinstruments[0],
          paymentMethodsData: paymentData,
          isShowConfirmModal: false,
          selectedPayment: '',
        });
      } else {
        checkIsDisabled(true);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      this.setState({
        isDeleteLoading: false,
        isDataLoading: false,
        isShowConfirmModal: false,
      });
    }
  }

  handleHideAlert() {
    this.setState({ isShowAlert: false });
  }

  handleShowAlert(message, isSuccess) {
    this.setState({ isShowAlert: true, alertMessageData: { message, isSuccess } });
    setTimeout(this.handleHideAlert, 3200);
  }

  onSelectPayment = (value) => {
    this.setState({
      selectedPayment: value,
    });
  }

  handleNext = () => {
    const { history } = this.props;
    const { accountUri } = history.location.state;
    const { selectedPayment } = this.state;
    history.push({
      pathname: '/payment-instrument-form/',
      state: { selectedPayment, accountUri },
    });
  }

  handleClosePaymentModal = () => {
    const { setIsCreatePaymentModalOpen } = this.props;
    setIsCreatePaymentModalOpen(false);
    this.setState({
      selectedPayment: '',
    });
  };

  renderNewPaymentModal = () => {
    const { isCreateModalOpen } = this.props;
    const {
      paymentMethodsData, selectedPayment,
    } = this.state;

    return (
      <Modal open={isCreateModalOpen} onClose={() => this.handleClosePaymentModal()} showCloseIcon={false}>
        <div className="modal-lg new-payment-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {intl.get('new-payment-instrument')}
              </h2>
              <button type="button" aria-label="close" className="close-modal-btn" onClick={this.handleClosePaymentModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="dropdown cart-selection-dropdown">
                <span className="required-label">
                  *
                </span>
                {' '}
                {intl.get('payment-method')}
                <button
                  className="ep-btn btn-payment-method dropdown-toggle"
                  data-toggle="dropdown"
                  disabled={false}
                  type="button"
                >
                  {selectedPayment['display-name']}
                </button>
                <div className="dropdown-menu cart-selection-menu">
                  <div className="cart-selection-menu-wrap">
                    {paymentMethodsData && paymentMethodsData.map(method => (
                      <option key={method['display-name']} value={method['display-name']} className="payment-option" onClick={() => this.onSelectPayment(method)}>
                        {method['display-name']}
                      </option>
                    ))}
                  </div>
                </div>
              </div>
              <div className="dialog-footer btn-container">
                <button className="ep-btn cancel" type="button" onClick={this.handleClosePaymentModal}>{intl.get('cancel')}</button>
                <button className="ep-btn primary" type="button" disabled={!selectedPayment['display-name']} onClick={this.handleNext}>
                  {intl.get('next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

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
    const {
      paymentInstruments, isDataLoading, isShowAlert, alertMessageData,
    } = this.state;

    return (
      <div className="container payment-instrument">
        {isShowAlert && (
          <AlertContainer messageData={alertMessageData} />
        )}
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
              {paymentInstruments._element ? paymentInstruments._element.map(instrument => (
                <tr key={instrument.self.uri} className="account-list-rows" onClick={() => {}}>
                  <td className="defaults">
                    <input type="radio" name="paymentSelection" id="paymentSelection" className="style-radio" checked={instrument['default-on-profile']} readOnly />
                    <label role="presentation" htmlFor="paymentSelection" onClick={() => this.handleDefaultCheck(instrument, paymentInstruments)} />
                  </td>
                  <td className="name">{instrument._paymentmethod[0]['display-name']}</td>
                  <td className="external-id">{instrument.name}</td>
                  <td className="action-column">
                    <div role="presentation" onClick={() => this.handleConfirmModal(instrument.self.uri)}>
                      {intl.get('delete')}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="no-data-message">{intl.get('no-payment-instruments')}</td></tr>
              )}
            </tbody>
          </table>
        )}
        {this.confirmationModal()}
        {this.renderNewPaymentModal()}
      </div>
    );
  }
}

export default PaymentInstruments;
