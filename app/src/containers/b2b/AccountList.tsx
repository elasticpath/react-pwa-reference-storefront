
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
import SubAccountList from './SubAccountList';

import './AccountMain.less';

interface AccountMainProps {
    getAccountData: () => void,
    getSubAccountData?: (data: any) => void,
    handleAddSubAccountClicked: () => void,
    accountListData: {
        status: string,
        subAccounts: any,
        mainAccountName: string,
    }
}

interface AccountMainState {}

export default class AccountList extends React.Component<AccountMainState, AccountMainProps> {
    static defaultProps = {
      getSubAccountData: () => {
      },
    };

    constructor(props: any) {
      super(props);

      this.handleAccount = this.handleAccount.bind(this);
    }

    handleAccount(data) {
      const { getSubAccountData } = this.props;
      getSubAccountData(data);
    }

    render() {
      const {
        getAccountData,
        handleAddSubAccountClicked,
        accountListData,
      } = this.props;

      return (
        <div key="account-tree-section" className="account-tree-section">
          <div className="add-new-account-container">
            <button type="button" className="ep-btn primary small add-associate-button" onClick={handleAddSubAccountClicked}>
              <span className="add-associate-icon" />
              {intl.get('add-sub-account')}
            </button>
          </div>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div className="account-tree-container" onClick={getAccountData}>
            <div className="name">
              {accountListData.mainAccountName}
            </div>
            <span className="status">
              <i className={`icons-status ${accountListData.status.toLowerCase()}`} />
              {intl.get(accountListData.status.toLowerCase())}
            </span>
          </div>
          {(accountListData.subAccounts._element && accountListData.subAccounts._element.length > 0) ? (
            <div className="sub-account-list-container">
              <SubAccountList getAccountData={this.handleAccount} subAccounts={accountListData.subAccounts} />
            </div>
          ) : ''}

        </div>
      );
    }
}
