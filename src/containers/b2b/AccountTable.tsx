
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
import { cortexFetch } from '../../components/src/utils/Cortex';
import { login } from '../../hooks/store';
import AccountItem from '../../components/src/AccountItem/account.item';
import Config from '../../ep.config.json';
import './AccountTable.scss';

interface AccountTableProps {
  history: any
  accounts: any
  isChildList?: boolean
}

interface AccountsState {
  isMiniLoading: boolean;
  isSellerAdmin: boolean;
}

const zoomArray = [
  'element',
  'element:childaccounts',
  'element:childaccounts:element',
];

export default class AccountTable extends React.Component<AccountTableProps, AccountsState> {
  constructor(props) {
    super(props);
    this.state = {
      isMiniLoading: false,
      isSellerAdmin: false,
    };
    this.handleAccount = this.handleAccount.bind(this);
    this.getChildAccounts = this.getChildAccounts.bind(this);
  }

  handleAccount = (accountUri, accountName) => {
    const { history } = this.props;
    history.push({
      pathname: '/account-details',
      state: { accountUri, accountName },
    });
  }

  getChildAccounts = async (account) => {
    this.setState({ isMiniLoading: true });
    try {
      await login();
      return await cortexFetch(`${account._childaccounts[0].self.uri}?zoom=${zoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(result => result.json());
    } catch (e) {
      return 'caught';
    } finally {
      this.setState({ isMiniLoading: false });
    }
  }

  render() {
    const {
      isSellerAdmin,
      isMiniLoading,
    } = this.state;
    const { accounts, isChildList } = this.props;

    return (
      <div className="b2b-section accounts">
        <div className="section-content">
          <div className="accounts-list">
            <div className="header-row">
              <span className="name">
                {intl.get('account')}
                {isSellerAdmin && (
                  <span className="mobile-table-title">
                    {' '}
                    &
                    {' '}
                    {intl.get('external-id')}
                  </span>
                )}
              </span>
              <span className="external-id">{intl.get('external-id')}</span>
              <span className="status">{intl.get('status')}</span>
              <span className="action" />
              {
                (isMiniLoading) && (
                  <div className="loader-wrapper">
                    <div className="miniLoader" />
                  </div>
                )
              }
            </div>
            {accounts && accounts._element ? (
              <span>
                {accounts._element.map((account, i, arr) => (
                  <AccountItem
                    isChildList={isChildList}
                    key={account.self.uri}
                    onEditAccount={(uri: string, accountName: string) => this.handleAccount(uri, accountName)}
                    accountKey={account.self.uri}
                    account={account}
                    level={0}
                    isLine={arr.length - 1 !== i}
                    getChildAccounts={(accountData: any) => this.getChildAccounts(accountData)}
                    hasChild={!!account._childaccounts[0]._element}
                  />
                ))}
              </span>
            ) : <p className="no-results">{intl.get('no-child-accounts')}</p>}
          </div>
        </div>
      </div>
    );
  }
}
