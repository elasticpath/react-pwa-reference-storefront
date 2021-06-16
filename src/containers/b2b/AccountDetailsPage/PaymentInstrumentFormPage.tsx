
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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import { Link, RouteComponentProps } from 'react-router-dom';
import { cortexFetch } from '../../../components/src/utils/Cortex';
import * as Config from '../../../ep.config.json';
import { login } from '../../../hooks/store';
import { ReactComponent as ArrowIcon } from '../../../images/icons/arrow_left.svg';

import './PaymentInstrumentFormPage.scss';

interface AccountMainState {
  isMiniLoader: boolean
  setAsDefault: boolean
  displayName: string

}

interface AccountMainRouterProps {
  uri: string;
}

const zoomArray = [
  'paymentinstruments:defaultinstrumentselector',
  'paymentinstruments:defaultinstrumentselector:choice',
  'paymentinstruments:defaultinstrumentselector:choice:description',
  'paymentinstruments:defaultinstrumentselector:choice:selectaction',
];

class PaymentInstrumentFormPage extends React.Component<RouteComponentProps<AccountMainRouterProps>, AccountMainState> {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      isMiniLoader: false,
      setAsDefault: false,
      displayName: '',
    };
    this.setAsDefault = this.setAsDefault.bind(this);
    this.setName = this.setName.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDefaultCheck = this.handleDefaultCheck.bind(this);
    this.redirectToPaymentInstruments = this.redirectToPaymentInstruments.bind(this);
  }

  async getPayments() {
    const { history } = this.props;
    const { setAsDefault, displayName } = this.state;
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
        if (setAsDefault && res._paymentinstruments[0]._defaultinstrumentselector[0]._choice) {
          const choice = res._paymentinstruments[0]._defaultinstrumentselector[0]._choice.filter(el => el._description[0].name === displayName);
          await this.handleDefaultCheck(choice[0]._description[0], res._paymentinstruments[0]);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  setAsDefault = () => {
    const { setAsDefault } = this.state;
    this.setState({ setAsDefault: !setAsDefault });
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
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      this.setState({ isMiniLoader: false });
      this.redirectToPaymentInstruments(true);
    }
  }

  redirectToPaymentInstruments(isAdded = false) {
    const { history } = this.props;
    const { accountUri } = history.location.state;

    const isSelectedTab: number = 3;
    const isPaymentAdded: boolean = isAdded;
    history.push({
      pathname: '/account-details',
      state: { accountUri, isSelectedTab, isPaymentAdded },
    });
  }

  async handleSave() {
    const { history } = this.props;
    const { displayName, setAsDefault } = this.state;
    this.setState({
      isMiniLoader: true,
    });
    try {
      await cortexFetch(`${history.location.state.selectedPayment._paymentinstrumentform[0].self.uri}?followlocation&format=standardlinks,zoom.nodatalinks`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          'payment-instrument-identification-form': {
            'display-name': displayName,
          },
        }),
      });
      if (setAsDefault) {
        await this.getPayments();
      } else {
        this.redirectToPaymentInstruments(true);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }


  setName(event) {
    this.setState({ displayName: event.target.value });
  }

  render() {
    const { displayName, isMiniLoader } = this.state;

    return (
      <div className="container payment-instrument-form">
        <Link to="/account/accounts" className="back-link" role="button">
          <ArrowIcon className="arrow-icon" />
          {intl.get('back-to-accounts')}
        </Link>
        <h1 className="page-title">
          {intl.get('payment-instrument')}
        </h1>
        <h4 className="title">
          {intl.get('new-payment-instrument')}
        </h4>
        <div className="payment-form">
          <div className="input-name">
            <label htmlFor="nameField">
              <span className="required-label">
                *
              </span>
              {' '}
              {intl.get('display-name')}
            </label>
            <input type="text" className="form-control" id="nameField" onChange={event => this.setName(event)} />
          </div>
          <input type="checkbox" className="style-checkbox default-checkbox" id="defaultField" onChange={() => this.setAsDefault()} />
          <label htmlFor="defaultField" />
          <label htmlFor="defaultField">
            {intl.get('set-as-default')}
          </label>
        </div>
        <div className="dialog-footer btn-container">
          <button className="ep-btn cancel" type="button" onClick={() => this.redirectToPaymentInstruments()}>{intl.get('cancel')}</button>
          <button className="ep-btn primary" type="button" disabled={!displayName} onClick={this.handleSave}>
            {intl.get('save')}
          </button>
        </div>
        {isMiniLoader && (
          <div className="loader-wrapper">
            <div className="miniLoader" />
          </div>
        )}
      </div>
    );
  }
}

export default PaymentInstrumentFormPage;
