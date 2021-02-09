
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
import { cortexFetch } from '../../components/src/utils/Cortex';
import { login } from '../../hooks/store';
import * as Config from '../../ep.config.json';

import TabSelection from '../../components/src/TabSelection/tabselection.main';
import { ReactComponent as ArrowIcon } from '../../images/icons/arrow_left.svg';
import './AccountMain.scss';
import './AccountDetails.scss';
import PaymentInstruments from './PaymentInstruments';

interface AccountMainState {
  accountData: any;
  isLoading: boolean;
  isShowForm: boolean;
  formFields: {
    field?: string,
    value?: string
  }[];
  accountUri: string
  businessName: string
  businessNumber: string
  accountPhone: string
  accountFax: string
}

interface AccountMainRouterProps {
  uri: string;
}

const zoomArray = [
  'status',
  'identifier',
  'childaccounts',
  'childaccounts:account',
  'childaccounts:element',
  'childaccounts:account:attributes',
  'paymentmethods',
  'attributes',
  'purchases',
];


class AccountDetails extends React.Component<RouteComponentProps<AccountMainRouterProps>, AccountMainState> {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      accountData: [],
      isLoading: true,
      isShowForm: false,
      formFields: [],
      accountUri: '',
      businessName: '',
      businessNumber: '',
      accountPhone: '',
      accountFax: '',
    };

    this.getAccountData = this.getAccountData.bind(this);
    this.setBusinessName = this.setBusinessName.bind(this);
    this.setBusinessNumber = this.setBusinessNumber.bind(this);
    this.setAccountPhone = this.setAccountPhone.bind(this);
    this.setAccountFax = this.setAccountFax.bind(this);
    this.renderData = this.renderData.bind(this);
    this.setShowForm = this.setShowForm.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (history.location.state && history.location.state.accountUri) {
      this.getAccountData(history.location.state.accountUri);
    }
  }

  setBusinessName(event) {
    this.setState({ businessName: event.target.value });
  }

  setBusinessNumber(event) {
    this.setState({ businessNumber: event.target.value });
  }

  setAccountPhone(event) {
    this.setState({ accountPhone: event.target.value });
  }

  setAccountFax(event) {
    this.setState({ accountFax: event.target.value });
  }

  setShowForm() {
    const { isShowForm } = this.state;
    this.setState({ isShowForm: !isShowForm });
  }

  async handleEdit() {
    const {
      businessName, businessNumber, accountPhone, accountFax, accountUri,
    } = this.state;
    login().then(() => {
      cortexFetch(`${accountUri}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          'account-business-name': businessName,
          'account-business-number': businessNumber,
          'account-fax': accountPhone,
          'account-phone': accountFax,
        }),
      })
        .then(() => {
          this.getAccountData(accountUri);
        });
    });
  }

  async getAccountData(accountUri) {
    const res = await cortexFetch(`${accountUri}/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(result => result.json());
    if (res) {
      const formFields = [];
      if (res._attributes) {
        // eslint-disable-next-line no-restricted-syntax,guard-for-in
        for (const fieldName in res._attributes[0]) {
          if (typeof res._attributes[0][fieldName] === 'string') {
            formFields.push({
              field: fieldName,
              value: res._attributes[0][fieldName],
            });
          }
        }
      }

      this.setState({
        accountData: res,
        isLoading: false,
        isShowForm: false,
        formFields,
        accountUri,
        businessName: res['account-business-name'],
        businessNumber: res['account-business-number'],
        accountPhone: res['account-phone'],
        accountFax: res['account-fax'],
      });
    }
  }

  renderData() {
    const {
      accountData, formFields, isShowForm, businessName, businessNumber, accountPhone, accountFax,
    } = this.state;

    const status = accountData._status[0].status === 'ACTIVE' ? intl.get('enabled') : intl.get('disabled');
    const sharedId = accountData._identifier[0]['shared-id'];
    return ([
      <div key="tab-content">
        <div className="title">
          <p>
            {intl.get('account-details')}
          </p>
          {!isShowForm && (
          <span role="presentation" className="edit-button" onClick={() => this.setShowForm()}>{intl.get('edit')}</span>
          )}
        </div>
        <div className="account-data-container">
          <ul className="account-data-list">
            <li>
              <span className="row-name">{intl.get('business-name')}</span>
              {isShowForm ? (
                <input type="string" className="row-input" defaultValue={businessName} onChange={this.setBusinessName} />
              ) : (
                <span className="row-value">{accountData['account-business-name']}</span>
              )}
            </li>
            <li>
              <span className="row-name">{intl.get('business-number')}</span>
              {isShowForm ? (
                <input key="businessNumber" type="string" className="row-input" value={businessNumber} onChange={this.setBusinessNumber} />
              ) : (
                <span className="row-value">{accountData['account-business-number']}</span>
              )}
            </li>
            <li>
              <span className="row-name">{intl.get('phone-number')}</span>
              {isShowForm ? (
                <input key="accountPhone" type="string" className="row-input" value={accountPhone} onChange={this.setAccountPhone} />
              ) : (
                <span className="row-value">{accountData['account-phone']}</span>
              )}
            </li>
            <li>
              <span className="row-name">{intl.get('fax')}</span>
              {isShowForm ? (
                <input key="accountFax" type="string" className="row-input" value={accountFax} onChange={this.setAccountFax} />
              ) : (
                <span className="row-value">{accountData['account-fax']}</span>
              )}
            </li>
            <li>
              <span className="row-name">{intl.get('status')}</span>
              <span className="row-value">
                <i className="icons-status enabled" />
                {status}
              </span>
            </li>
            <li>
              <span className="row-name">{intl.get('shared-id')}</span>
              <span className="row-value">{sharedId}</span>
            </li>
          </ul>
          {isShowForm && (
            <div>
              <button className="ep-btn small primary" type="button" onClick={this.handleEdit}>
                {intl.get('save')}
              </button>
              <button type="button" className="ep-btn small" onClick={() => this.setShowForm()}>
                {intl.get('cancel')}
              </button>
            </div>
          )}
        </div>
        <div className="title">
          <p>
            {intl.get('additional-details')}
          </p>
        </div>
        <div className="account-data-container">
          <ul className="account-data-list">
            {formFields.map(element => (
              <li key={element.field}>
                <span className="row-name">{element.field}</span>
                <span className="row-value">{element.value}</span>
              </li>
            ))
            }
          </ul>
        </div>
      </div>,
      <div>
        {intl.get('associates')}
      </div>,
      <div>
        {intl.get('address-book')}
      </div>,
      <div>
        <PaymentInstruments />
      </div>,
      <div>
        {intl.get('purchase-history')}
      </div>]
    );
  }

  render() {
    const { accountData, isLoading } = this.state;

    const tabs = [intl.get('overview'), intl.get('associates'), intl.get('address-book'), intl.get('payment-instruments'), intl.get('purchase-history')];
    return (
      <div className="container account-details">
        <Link to="/account/accounts" className="back-link" role="button">
          <ArrowIcon className="arrow-icon" />
          {intl.get('back-to-accounts')}
        </Link>
        <br />
        <div className="account-name">
          {accountData['account-business-name']}
        </div>
        {isLoading ? (
          <div className="loader" />
        ) : (
          <div className="tab-pane" id="item-form" role="tabpanel">
            <TabSelection tabs={tabs} data={this.renderData()} />
          </div>
        )}
      </div>
    );
  }
}

export default AccountDetails;
