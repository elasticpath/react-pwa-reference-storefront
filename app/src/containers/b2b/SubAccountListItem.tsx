
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

import * as React from 'react';
import intl from 'react-intl-universal';
import * as Config from '../../ep.config.json';
import './SubAccountList.less';
import { login } from '../../utils/AuthService';
import { adminFetch } from '../../utils/Cortex';
// eslint-disable-next-line import/no-cycle
import SubAccountList from './SubAccountList';

interface SubAccountListProps {
    accountData: any,
    handleAccount: (data: any) => void,
    accountName: string,
    registrationNumber: string,
}

interface SubAccountListState {
    subAccounts: any,
    subAccountData: any,
    isLoading: boolean,
    subAccountOpened: boolean,
    highlight: boolean,
}

const zoom = [
  'subaccounts',
  'subaccounts:element',
  'subaccounts:element:statusinfo',
  'subaccounts:element:statusinfo:status',
  'subaccounts:element:statusinfo:associateroleassignments',
  'subaccounts:element:subaccounts',
  'subaccounts:element:subaccounts:element',
  'subaccounts:accountform',
  'subaccounts:element:subaccounts:accountform',
  'subaccounts:element:associateroleassignments',
  'subaccounts:element:associateroleassignments:element',
  'subaccounts:element:associateroleassignments:element:associate',
  'subaccounts:element:associateroleassignments:element:associate:primaryemail',
  'subaccounts:element:associateroleassignments:element:roleinfo',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector:chosen',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector:chosen:description',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector:chosen:selectaction',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector:chosen:selector',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector:choice',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector:choice:description',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector:choice:selectaction',
  'subaccounts:element:associateroleassignments:element:roleinfo:selector:choice:selector',
  'subaccounts:element:associateroleassignments:element:roleinfo:roles',
  'subaccounts:element:associateroleassignments:element:roleinfo:roles:element',
  'subaccounts:element:associateroleassignments:associateform',
  'subaccounts:element:associateroleassignments:associateform:addassociateaction',
  'associateroleassignments',
  'associateroleassignments:element',
  'associateroleassignments:element:associate',
  'associateroleassignments:element:associate:primaryemail',
  'associateroleassignments:element:roleinfo',
  'associateroleassignments:element:roleinfo:selector',
  'associateroleassignments:element:roleinfo:selector:chosen',
  'associateroleassignments:element:roleinfo:selector:chosen:description',
  'associateroleassignments:element:roleinfo:selector:chosen:selectaction',
  'associateroleassignments:element:roleinfo:selector:chosen:selector',
  'associateroleassignments:element:roleinfo:selector:choice',
  'associateroleassignments:element:roleinfo:selector:choice:description',
  'associateroleassignments:element:roleinfo:selector:choice:selectaction',
  'associateroleassignments:element:roleinfo:selector:choice:selector',
  'associateroleassignments:element:roleinfo:roles',
  'associateroleassignments:element:roleinfo:roles:element',
  'associateroleassignments:associateform',
  'associateroleassignments:associateform:addassociateaction',
];

export default class SubAccountListItem extends React.Component<SubAccountListProps, SubAccountListState> {
  constructor(props) {
    super(props);
    this.state = {
      subAccounts: [],
      subAccountData: {},
      isLoading: false,
      subAccountOpened: false,
      highlight: false,
    };

    this.handleAccountData = this.handleAccountData.bind(this);
    this.getSubAccounts = this.getSubAccounts.bind(this);
  }

  getSubAccounts(uri, event) {
    event.stopPropagation();
    const { subAccountData, subAccountOpened } = this.state;
    this.setState({ subAccountOpened: !subAccountOpened });
    if (subAccountData.name) return;

    this.setState({ isLoading: true });
    login().then(() => {
      adminFetch(`${uri}/?zoom=${zoom.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            subAccountData: res,
            isLoading: false,
            subAccounts: res._subaccounts[0],
          });
        })
        .catch(() => {
          this.setState({ isLoading: false });
        });
    })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  handleAccountData(accountData) {
    const { subAccountData } = this.state;
    const { handleAccount } = this.props;

    this.setState({ highlight: true });
    if (subAccountData.name) {
      handleAccount(subAccountData);
    } else {
      handleAccount(accountData);
    }
  }

  render() {
    const {
      accountData,
      handleAccount,
      accountName,
      registrationNumber,
    } = this.props;
    const {
      subAccounts,
      isLoading,
      subAccountOpened,
      highlight,
    } = this.state;

    return (
      <div key={accountData['external-id']}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className={`sub-account ${!subAccountOpened ? '' : 'hide-sub-accounts'} ${(accountName === accountData.name && accountData['registration-id'] === registrationNumber && highlight) ? 'highlighted' : ''}`}
          onClick={() => this.handleAccountData(accountData)}
          onKeyPress={() => this.handleAccountData(accountData)}
        >
          <div className="name">
            {accountData.name}
          </div>
          {isLoading
            ? (
              <div className="loader-container">
                <div className="loader" />
              </div>
            ) : (accountData._subaccounts && accountData._subaccounts[0]._element && (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <span
                className={`arrow-btn ${subAccountOpened ? 'up' : ''}`}
                onClick={event => this.getSubAccounts(accountData.self.uri, event)}
                onKeyPress={event => this.getSubAccounts(accountData.self.uri, event)}
              />
            ))
          }
          <span className="status">
            <i className={`icons-status ${accountData._statusinfo[0]._status[0].status.toLowerCase()}`} />
            {intl.get(accountData._statusinfo[0]._status[0].status.toLowerCase())}
          </span>
        </div>
        <div className={`margin-left ${!subAccountOpened ? 'hide-sub-account' : ''}`}>
          {subAccounts._element && <SubAccountList subAccounts={subAccounts} getAccountData={handleAccount} accountName={accountName} registrationNumber={registrationNumber} /> }
        </div>
      </div>
    );
  }
}
