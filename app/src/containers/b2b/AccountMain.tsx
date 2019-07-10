
/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import intl from "react-intl-universal";
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import * as Config from '../../ep.config.json';
import { Link } from 'react-router-dom';

import './AccountMain.less';

const accountZoomArray = [
  "selfsignupinfo",
  "statusinfo",
  "statusinfo:status",
  "subaccounts",
  "subaccounts:account",
  "subaccounts:account:subaccounts",
  "subaccounts:accountform",
  "associateroleassignments",
  "associateroleassignments:element",
  "associateroleassignments:element:associate",
  "associateroleassignments:element:associate:primaryemail",
  "associateroleassignments:element:roleinfo",
  "associateroleassignments:element:roleinfo:selector",
  "associateroleassignments:element:roleinfo:selector:chosen",
  "associateroleassignments:element:roleinfo:selector:chosen:description",
  "associateroleassignments:element:roleinfo:selector:chosen:selectaction",
  "associateroleassignments:element:roleinfo:selector:chosen:selector",
  "associateroleassignments:element:roleinfo:selector:choice",
  "associateroleassignments:element:roleinfo:selector:choice:description",
  "associateroleassignments:element:roleinfo:selector:choice:selectaction",
  "associateroleassignments:element:roleinfo:selector:choice:selector",
  "associateroleassignments:element:roleinfo:roles",
  "associateroleassignments:element:roleinfo:roles:element",
  "associateroleassignments:associateform",
  "associateroleassignments:associateform:addassociateaction",
];

export default class AccountMain extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      legalName: '',
      status: '',
      data: {}
    };
    this.getAccountData();
  }

  getAccountData() {
    login().then(() => {
      adminFetch(`/accounts/am/${this.props.match.params.uri}/?zoom=${accountZoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            isLoading: false,
            legalName: res.name,
            status: res._statusinfo[0]._status[0].status,
            data: res
          })
        })
        .catch(() => {
          this.setState({ isLoading: false })
        });
    })
    .catch(() => {
      this.setState({ isLoading: false })
    });
  }

    render() {
        const { isLoading, legalName, status } = this.state;
        console.log(legalName, status);
        return (
            <div className="account-content-wrapper">
                {isLoading ? (
                  <div className="loader" />
                ) : (
            <div className="account-component">
                <div key="account-header" className="account-header">
                <Link className="back-link" to="/b2b"><div className="back-arrow" />{intl.get('back-to-dashboard')}</Link>
                  <div className="name-container">
                    <Link className="back-link-mobile" to="/b2b"><div className="back-arrow" />{intl.get('back')}</Link>
                    <div className="name">{legalName}
                        <span className="status">
                            <i className={`icons-status ${status.toLowerCase()}`} />
                            {intl.get(status.toLowerCase())}
                        </span>
                    </div>
                    <div className="settings" /*onClick={() => {this.handleAccountSettingsClicked()}}*/ >
                      <div className="setting-icons" />
                      <span className="settings-title">{intl.get('account-settings')}</span>
                    </div>
                  </div>
                </div>
            </div>
                )}
            </div>
        );
    }

}
