
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
import * as intl from "react-intl-universal";
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import EditAccountModal from './EditAccountModal';
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
      isSettingsDialogOpen: false,
      externalId: '',
      registrationNumber: '',
      selfSignUpCode: '',
      uri: '',
      data: {},
      associates: {}
    };

    this.getAccountData();
    this.handleAccountSettingsClose = this.handleAccountSettingsClose.bind(this);
    this.handleAccountSettingsClicked = this.handleAccountSettingsClicked.bind(this);
    this.handleAccountSettingsUpdate = this.handleAccountSettingsUpdate.bind(this);
  }

  getAccountData() {
    const accountUri = this.props.match.params.uri;
    this.setState({ isLoading: true });
    login().then(() => {
      adminFetch(`/accounts/am/${accountUri}/?zoom=${accountZoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            name: res.name,
            externalId: res['external-id'],
            registrationNumber: res['registration-id'],
            isLoading: false,
            legalName: res['legal-name'],
            status: res._statusinfo[0]._status[0].status,
            selfSignUpCode: res._selfsignupinfo[0]['self-signup-code'],
            uri: accountUri,
            associates: res._associateroleassignments[0]._element.map(element => ({associate: element._associate[0], roles: element._roleinfo[0]})),
            data: res
          });
        })
        .catch(() => {
          this.setState({ isLoading: false })
        });
    })
    .catch(() => {
      this.setState({ isLoading: false })
    });
  }

  handleAccountSettingsClicked() {
    this.setState({ isSettingsDialogOpen: true });
  }

  handleAccountSettingsClose() {
    this.setState({ isSettingsDialogOpen: false });
  }

  handleAccountSettingsUpdate() {
    this.getAccountData();
  }

  render() {
    const { isLoading, name, status, associates, isSettingsDialogOpen } = this.state;

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
                <div className="name">{name}
                  <span className="status">
                    <i className={`icons-status ${status.toLowerCase()}`} />
                    {intl.get(status.toLowerCase())}
                  </span>
                </div>
                <div className="settings">
                  <div className="setting-icons" />
                  <span className="settings-title" onClick={this.handleAccountSettingsClicked}>{intl.get('account-settings')}</span>
                </div>
              </div>
            </div>
            <div className="associates-container">
              <table className={`associates-table ${associates.length === 0 ? 'empty-table' : ''}`}>
                <thead>
                <tr>
                  <th className="name-email">{intl.get('name-and-email')}</th>
                  <th className="name">{intl.get('name')}</th>
                  <th className="email">{intl.get('email')}</th>
                  <th className="roles">{intl.get('roles')}</th>
                  <th className="action">&nbsp;</th>
                  <th className="arrow">&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                {associates.length === 0 && (
                  <tr><td>{intl.get('account-no-associates')}</td></tr>
                )}
                {associates.map(associate => (
                  <tr key={associate.associate._primaryemail[0].email} className="associates-table-row">
                    <td className="name">
                      <div className="name-part">{associate.associate.name}</div>
                    </td>
                    <td className="email">
                      <div className="email-part">{associate.associate._primaryemail[0].email}</div>
                    </td>
                    <td className="name-email">
                      <div className="name-part">{associate.associate.name}</div>
                      <div className="email-part">{associate.associate._primaryemail[0].email}</div>
                    </td>
                    <td className="roles">
                    {associate.roles._roles.length ? associate.roles._roles[0]._element.map(r => intl.get(r.name.toLowerCase()) || r.name).join(', ') : intl.get('none')}
                    </td>
                    <td className="action">
                      <button className="edit-associate" />
                      <button className="delete-associate" />
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            <EditAccountModal
              handleClose={this.handleAccountSettingsClose}
              handleUpdate={this.handleAccountSettingsUpdate}
              isOpen={isSettingsDialogOpen}
              accountData={this.state}/>
          </div>
        )}
      </div>
    );
  }
}
