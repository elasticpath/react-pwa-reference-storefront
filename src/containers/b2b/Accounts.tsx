
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
import './Accounts.scss';

enum MessageType {
  success = 'success',
  error = 'error'
}

interface AccountsState {
  admins: any;
  accounts: any;
  // searchAccounts: string;
  isLoading: boolean;
  // showSearchLoader: boolean;
  noSearchResults: boolean;
  isSellerAdmin: boolean;
  messages: { type: MessageType; text: string; }[];
}

const zoomArray = [
  'element',
  'element:attributes',
  'element:identifier',
];

export default class Accounts extends React.Component<RouteComponentProps, AccountsState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      noSearchResults: false,
      // showSearchLoader: false,
      accounts: [],
      admins: [],
      // searchAccounts: '',
      isSellerAdmin: false,
      messages: [],
    };
    this.getAdminData();
    // this.setSearchAccounts = this.setSearchAccounts.bind(this);
    // this.getSearchAccounts = this.getSearchAccounts.bind(this);
    // this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  // setSearchAccounts(event) {
  //   this.setState({ searchAccounts: event.target.value });
  // }

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

  // getSearchAccounts() {
  //   this.setState({ showSearchLoader: true });
  // }
  //
  // handleEnterKeyPress(e) {
  //   if (e.keyCode === 13) {
  //     this.getSearchAccounts();
  //   }
  // }

  render() {
    const {
      admins,
      accounts,
      isLoading,
      // searchAccounts,
      // showSearchLoader,
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
            {/* <div className="accounts-search">
              <input type="text" placeholder={intl.get('search-accounts')} aria-label={intl.get('search')} value={searchAccounts} onKeyDown={this.handleEnterKeyPress} onChange={this.setSearchAccounts} />
              {showSearchLoader && <div className="circularLoader" />}
            </div> */}
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
            <div className="b2b-section accounts">
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
                        <th className="external-id">{intl.get('external-id')}</th>
                        <th className="status">{intl.get('status')}</th>
                        <th className="arrow" />
                      </tr>
                    </thead>
                    <tbody>
                      {accounts._element.map(account => (
                        <tr key={account.self.uri} className="account-list-rows">
                          <td className="name">{account['business-name']}</td>
                          <td className="external-id">{account['business-number']}</td>
                          <td className="status">
                            <i className="icons-status enabled" />
                            {intl.get('enabled')}
                          </td>
                          <td className="arrow">
                            <span className="arrow-btn" />
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
