
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
import { RouteComponentProps } from 'react-router-dom';
import { cortexFetch } from '../../components/src/utils/Cortex';
import { login } from '../../hooks/store';
import { ReactComponent as AccountIcon } from '../../images/header-icons/account-icon.svg';
import { ReactComponent as InfoIcon } from '../../images/icons/info-icon.svg';
import Config from '../../ep.config.json';
import AccountTable from './AccountTable';

import './Accounts.scss';

enum MessageType {
  success = 'success',
  error = 'error'
}

interface AccountsState {
  admins: any;
  accounts: any;
  isLoading: boolean;
  messages: { type: MessageType; text: string; }[];
}

const zoomArray = [
  'element',
  'element:childaccounts',
  'element:childaccounts:element',
];

export default class Accounts extends React.Component<RouteComponentProps, AccountsState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      accounts: [],
      admins: [],
      messages: [],
    };
    this.getAdminData();
    this.handleAccount = this.handleAccount.bind(this);
  }

  async getAdminData() {
    await login();
    const res = await cortexFetch(`/accounts/${Config.cortexApi.scope}/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(result => result.json());

    if (res && res._element) {
      this.setState({
        accounts: res, isLoading: false,
      });
    }
  }

  handleAccount = (accountUri) => {
    const { history } = this.props;
    history.push({
      pathname: '/account-details',
      state: { accountUri },
    });
  }

  render() {
    const { history } = this.props;
    const {
      admins,
      accounts,
      isLoading,
      messages,
    } = this.state;

    return (
      <div className="dashboard-component">
        <div className="message-boxes">
          {messages.map((message: {text: string, type: MessageType}) => (
            <div key={message.text} className={`message-box ${message.type.toString()}`}>
              <div className="container">
                <div className="message">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="b2b-header">
          <h1 className="page-title">
            {intl.get('accounts')}
            <div className="ep-tooltip">
              <InfoIcon className="info-icon" />
              <span className="tooltiptext">
                {intl.get('account-tooltip-text')}
              </span>
            </div>
          </h1>
        </div>
        {!isLoading ? (
          <div>
            <div className="admin-address-book">
              <div className="b2b-section section-1 admin-section">
                <div className="section-content">
                  {admins.slice(0, 2).map(admin => (
                    <div key={admin.email} className="user-info">
                      <AccountIcon className="user-icon" />
                      <div className="user-details">
                        <div className="user-email">{admin.email}</div>
                        <div className="user-name">{admin.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="b2b-section section-2 address-book-section" style={{ border: 'none' }} />
            </div>
            <AccountTable history={history} accounts={accounts} />
          </div>
        ) : (
          <div className="loader" />
        )}
      </div>
    );
  }
}
