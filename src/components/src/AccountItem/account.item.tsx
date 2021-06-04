
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

import React, { useState } from 'react';
import intl from 'react-intl-universal';

import './account.item.scss';

export default function AccountItem({
  onEditAccount,
  accountKey,
  account,
  level,
  isLine,
  getChildAccounts,
  hasChild,
}) {
  const [childAccounts, setChildAccounts] = useState<any>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onGetChildAccounts = () => {
    if (!isCollapsed && !childAccounts._element) {
      if (account._childaccounts) {
        getChildAccounts(account)
          .then((res) => {
            if (res && res._element) {
              setChildAccounts(res);
              setIsCollapsed(true);
            }
          });
      }
    } else if (!isCollapsed && childAccounts._element) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  };

  return (
    <div className="account-row-container" key={accountKey}>
      <div className={`account-row level${level}`}>
        <span className="name" style={{ marginLeft: `${level * 18}px` }}>
          <button className="collapse-btn" type="button" onClick={() => onGetChildAccounts()}>
            {isLine && (
              <span className="line" style={{ left: `${level * 18}px` }} />
            )}
            {(!isLine && isCollapsed) && (
              <span className="line short-line" style={{ left: `${level * 18}px` }} />
            )}
            {hasChild ? (
              <i className={`icons-collapse ${isCollapsed ? 'open' : 'closed'}`} />
            ) : (
              <i className="icons-collapse empty" />
            )}
          </button>
          {account['account-business-name']}
        </span>
        <span className="external-id">
          {account['account-business-number']}
        </span>
        <span className="status">
          <i className="icons-status enabled" />
          {intl.get('enabled')}
        </span>
        <span className="action">
          <button className="ep-btn" type="button" onClick={() => onEditAccount(accountKey)}>
            <span className="edit-text">{intl.get('edit')}</span>
            <i className="edit-icon" />
          </button>
        </span>
      </div>
      {isCollapsed && childAccounts._element && childAccounts._element.map((childAccount, i, arr) => (
        <AccountItem
          key={childAccount.self.uri}
          onEditAccount={(uri: string) => onEditAccount(uri)}
          accountKey={childAccount.self.uri}
          account={childAccount}
          level={level + 1}
          isLine={arr.length - 1 !== i}
          getChildAccounts={getChildAccounts}
          hasChild={!!childAccount._childaccounts[0]._element}
        />
      ))}
    </div>
  );
}
