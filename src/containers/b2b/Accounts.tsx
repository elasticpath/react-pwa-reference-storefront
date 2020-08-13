
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
import { Link, RouteComponentProps } from 'react-router-dom';
import { cortexFetch } from '../../components/src/utils/Cortex';
import { login } from '../../hooks/store';
import { ReactComponent as AccountIcon } from '../../images/header-icons/account-icon.svg';
import Config from '../../ep.config.json';

import './Accounts.scss';

enum MessageType {
  success = 'success',
  error = 'error'
}

interface AccountsState {
  admins: any;
  accounts: any;
  isLoading: boolean;
  noSearchResults: boolean;
  isSellerAdmin: boolean;
  messages: { type: MessageType; text: string; }[];
}

export default class Accounts extends React.Component<RouteComponentProps, AccountsState> {
  fileInputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      noSearchResults: false,
      accounts: [],
      admins: [],
      isSellerAdmin: false,
      messages: [],
    };
    this.getAdminData();
    this.fileInputRef = React.createRef<HTMLInputElement>();
  }

  async getAdminData() {
    await login();
    const result = await cortexFetch(`/accounts/${Config.cortexApi.scope}/?zoom=element,element:identifier,element:attributes`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }).then(r => r.json());
    this.setState({
      accounts: result._element, isLoading: false,
    });
  }

  handleAccountClicked(account: any) {
    const { history } = this.props;
    history.push(`/account-item/${account.uri}`);
  }

  render() {
    const {
      admins,
      accounts,
      isLoading,
      noSearchResults,
      isSellerAdmin,
      messages,
    } = this.state;

    return (
      <div className="dashboard-component">
        <div className="message-boxes">
          {messages.map((message, index) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <div key={index} className={`message-box ${message.type.toString()}`}>
              <div className="container">
                <div className="message">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="b2b-header">
          <h1 className="page-title">{intl.get('business-account')}</h1>
        </div>
        <div className="account-description">{intl.get('buyer-admin-has-the-capability')}</div>
        {!isLoading ? (
          <div>
            <div className="admin-address-book">
              <div className="b2b-section section-1 admin-section">
                <div className="section-header">
                  <div className="section-title">{intl.get('admins')}</div>
                </div>
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
            <div className="b2b-section accounts">
              <div className="section-header">
                <div className="section-title">{intl.get('accounts')}</div>
              </div>
              <div className="section-content">
                { !noSearchResults ? (
                  <table className="b2b-table accounts-table">
                    <thead>
                      <tr>
                        <th className="name">
                          {intl.get('name')}
                          {isSellerAdmin && (
                            <span className="mobile-table-title">
                              {' '}
                              &
                              {' '}
                              {intl.get('external-id')}
                            </span>
                          )}
                        </th>
                        {isSellerAdmin && <th className="external-id">{intl.get('external-id')}</th>}
                        <th className="status">{intl.get('status')}</th>
                        <th className="arrow" />
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map(account => (
                        <tr key={account.self.uri} onClick={() => this.handleAccountClicked(account)} className="account-list-rows">
                          <td className="name">{account['business-name']}</td>
                          {isSellerAdmin && <td className="external-id">{account._identifier[0]['shared-id']}</td>}
                          <td className="status">
                            <i className="icons-status enabled" />
                            {intl.get('enabled')}
                          </td>
                          <td className="arrow">
                            <Link to={`/b2b/account/${account.self.uri}`} title={account['business-name']} className="arrow-btn" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="no-results">{intl.get('no-results-found')}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="loader" />
        )}
      </div>
    );
  }
}
