
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
import Modal from 'react-responsive-modal';
import { Link, RouteComponentProps } from 'react-router-dom';
import {
  B2bEditAccount, B2bAddSubAccount, B2bEditAssociate, B2bAccountList,
} from '../../components/src/index';
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import * as Config from '../../ep.config.json';
import { ReactComponent as TrashIcon } from '../../images/icons/baseline-delete-24px.svg';
import { ReactComponent as EditIcon } from '../../images/icons/baseline-edit-24px.svg';
import { ReactComponent as GearIcon } from '../../images/icons/round-settings-20px.svg';

import './AccountMain.less';
import { ReactComponent as AddCircleIcon } from '../../images/icons/outline-add_circle_outline-14px.svg';
import { ReactComponent as AngleLeftIcon } from '../../images/icons/outline-chevron_left-24px.svg';

const accountZoomArray = [
  'accountmetadata',
  'selfsignupinfo',
  'statusinfo',
  'statusinfo:status',
  'subaccounts',
  'subaccounts:element',
  'subaccounts:element:accountmetadata',
  'subaccounts:element:subaccounts',
  'subaccounts:element:subaccounts:element',
  'subaccounts:element:statusinfo',
  'subaccounts:element:statusinfo:status',
  'subaccounts:element:associateroleassignments',
  'subaccounts:element:associateroleassignments:element',
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
  'subaccounts:element:subaccounts:accountform',
  'subaccounts:element:subaccounts:element:subaccounts:element',
  'subaccounts:element:subaccounts:element:statusinfo',
  'subaccounts:element:subaccounts:element:statusinfo:status',
  'subaccounts:accountform',
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
interface AccountMainState {
  isLoading: boolean,
  isEditAssociateOpen: boolean,
  legalName: string,
  accountName: string,
  mainAccountName: string,
  status: string,
  isSettingsDialogOpen: boolean,
  isAddSubAccountOpen: boolean,
  externalId: string,
  registrationNumber: string,
  selfSignUpCode: string,
  uri: string,
  selector: string,
  associateEditEmail: string,
  associates: {
    [key: string]: any
  },
  userEmail: string,
  isAddAssociateOpen: boolean,
  addAssociateUri: string,
  addSubAccountUri: string,
  addSubAccountSellerAdmin: boolean,
  editSubAccountUri: string,
  editMetadataUri: string,
  subAccounts: any,
  isDeleteAssociateOpen: boolean,
  associateUri: string,
}

interface AccountMainRouterProps {
  uri: string;
}

export default class AccountMain extends React.Component<RouteComponentProps<AccountMainRouterProps>, AccountMainState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      isEditAssociateOpen: false,
      isAddAssociateOpen: false,
      legalName: '',
      accountName: '',
      mainAccountName: '',
      status: '',
      isSettingsDialogOpen: false,
      isAddSubAccountOpen: false,
      externalId: '',
      registrationNumber: '',
      selfSignUpCode: '',
      uri: '',
      selector: '',
      associates: {},
      userEmail: '',
      associateEditEmail: '',
      addAssociateUri: '',
      addSubAccountUri: '',
      addSubAccountSellerAdmin: false,
      editSubAccountUri: '',
      editMetadataUri: '',
      subAccounts: {},
      isDeleteAssociateOpen: false,
      associateUri: '',
    };

    this.handleAccountSettingsClose = this.handleAccountSettingsClose.bind(this);
    this.handleAccountSettingsClicked = this.handleAccountSettingsClicked.bind(this);
    this.handleAccountSettingsUpdate = this.handleAccountSettingsUpdate.bind(this);
    this.handleEditAssociateClicked = this.handleEditAssociateClicked.bind(this);
    this.handleDeleteAssociateClicked = this.handleDeleteAssociateClicked.bind(this);
    this.handleAddAssociateClicked = this.handleAddAssociateClicked.bind(this);
    this.handleAddSubAccountClicked = this.handleAddSubAccountClicked.bind(this);
    this.handleAddSubAccountClose = this.handleAddSubAccountClose.bind(this);
    this.isEditAssociateClose = this.isEditAssociateClose.bind(this);
    this.subAccountData = this.subAccountData.bind(this);
    this.getAccountData = this.getAccountData.bind(this);
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
  }

  componentDidMount() {
    this.getAccountData();
  }

  getAccountData() {
    const { match } = this.props;
    const accountUri = match.params.uri;
    this.setState({ isLoading: true });
    login().then(() => {
      const profilePromice = adminFetch('/?zoom=myprofile:primaryemail', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
      });

      const accountsPromice = adminFetch(`/accounts/am/${accountUri}/?zoom=${accountZoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
      });

      Promise.all([accountsPromice, profilePromice])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then((res) => {
          const accounts = res[0];
          const profile = res[1];
          this.setState({
            accountName: accounts.name,
            mainAccountName: accounts.name,
            externalId: accounts._accountmetadata ? accounts._accountmetadata[0]['external-id'] : null,
            registrationNumber: accounts['registration-id'],
            isLoading: false,
            legalName: accounts['legal-name'],
            associates: accounts._associateroleassignments[0]._element ? accounts._associateroleassignments[0]._element.map(element => ({ associate: element._associate[0], roles: element._roleinfo[0], self: element.self })) : [],
            status: accounts._statusinfo[0]._status[0].status,
            editSubAccountUri: accounts.self.uri,
            editMetadataUri: accounts._accountmetadata ? accounts._accountmetadata[0].self.uri : null,
            selfSignUpCode: accounts._selfsignupinfo ? accounts._selfsignupinfo[0]['self-signup-code'] : '',
            userEmail: profile._myprofile[0]._primaryemail[0].email,
            addAssociateUri: accounts._associateroleassignments[0]._associateform[0]._addassociateaction[0].self.uri,
            addSubAccountUri: accounts._subaccounts[0]._accountform[0].self.uri,
            addSubAccountSellerAdmin: typeof accounts._subaccounts[0]._accountform[0]['external-id'] !== 'undefined',
            subAccounts: accounts._subaccounts[0],
            isDeleteAssociateOpen: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          this.setState({ isLoading: false });
        });
    })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        this.setState({ isLoading: false });
      });
  }

  handleDeleteAssociateClicked(associateUri) {
    this.setState({ isLoading: true });
    login().then(() => {
      adminFetch(associateUri, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
      })
        .then(() => {
          this.getAccountData();
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    })
      .catch((error) => {
        this.setState({ isLoading: false });
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  subAccountData(data) {
    this.setState({
      accountName: data.name,
      externalId: data._accountmetadata ? data._accountmetadata[0]['external-id'] : null,
      registrationNumber: data['registration-id'],
      legalName: data['legal-name'],
      associates: data._associateroleassignments[0]._element ? data._associateroleassignments[0]._element.map(element => ({ associate: element._associate[0], roles: element._roleinfo[0], self: element.self })) : [],
      addAssociateUri: data._associateroleassignments[0]._associateform[0]._addassociateaction[0].self.uri,
      addSubAccountUri: data._subaccounts[0]._accountform[0].self.uri,
      addSubAccountSellerAdmin: typeof data._subaccounts[0]._accountform[0]['external-id'] !== 'undefined',
      editSubAccountUri: data.self.uri,
      editMetadataUri: data._accountmetadata ? data._accountmetadata[0].self.uri : null,
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

  handleAddSubAccountClicked() {
    this.setState({ isAddSubAccountOpen: true });
  }

  handleAddSubAccountClose() {
    this.setState({ isAddSubAccountOpen: false });
  }

  handleEditAssociateClicked(selector, associateEditEmail) {
    this.setState({ isEditAssociateOpen: true, selector, associateEditEmail });
  }

  handleAddAssociateClicked() {
    this.setState({ isEditAssociateOpen: true, isAddAssociateOpen: true });
  }

  isEditAssociateClose() {
    this.setState({
      isEditAssociateOpen: false, associateEditEmail: '', selector: '', isAddAssociateOpen: false,
    });
  }

  handleDeleteModalOpen(associateUri) {
    this.setState({ isDeleteAssociateOpen: true, associateUri });
  }

  handleDeleteModalClose() {
    this.setState({ isDeleteAssociateOpen: false });
  }

  render() {
    const {
      isLoading,
      accountName,
      status,
      associates,
      isSettingsDialogOpen,
      isAddSubAccountOpen,
      isEditAssociateOpen,
      selector,
      associateEditEmail,
      userEmail,
      addAssociateUri,
      addSubAccountUri,
      addSubAccountSellerAdmin,
      editSubAccountUri,
      editMetadataUri,
      isAddAssociateOpen,
      subAccounts,
      mainAccountName,
      legalName,
      externalId,
      registrationNumber,
      selfSignUpCode,
      uri,
      isDeleteAssociateOpen,
      associateUri,
    } = this.state;

    const editAccountData = {
      name: accountName,
      legalName,
      externalId,
      registrationNumber,
      selfSignUpCode,
      uri,
    };
    const accountListData = {
      status,
      subAccounts,
      mainAccountName,
    };

    return (
      <div className="account-content-wrapper">
        {isLoading ? (
          <div className="loader" />
        ) : (
          <div>
            <div key="account-header" className="account-header">
              <Link className="back-link" to="/account/accounts">
                <div className="back-arrow">
                  <AngleLeftIcon />
                </div>
                {intl.get('back')}
              </Link>
              <div className="name-container">
                <Link className="back-link-mobile" to="/account/accounts">
                  <div className="back-arrow">
                    <AngleLeftIcon />
                  </div>
                  {intl.get('back')}
                </Link>
                <div className="name">
                  {accountName}
                </div>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div className="settings" onClick={this.handleAccountSettingsClicked}>
                  <div className="setting-icons">
                    <GearIcon />
                  </div>
                  <span className="settings-title">{intl.get('account-settings')}</span>
                </div>
              </div>
            </div>
            <div className="account-component">
              <B2bAccountList
                getAccountData={this.getAccountData}
                accountListData={accountListData}
                getSubAccountData={this.subAccountData}
                handleAddSubAccountClicked={this.handleAddSubAccountClicked}
                accountName={accountName}
                registrationNumber={registrationNumber}
              />
              <div className="associates-container">
                <div className="add-associate-container">
                  <button type="button" className="ep-btn primary small add-associate-button" onClick={() => this.handleAddAssociateClicked()}>
                    <AddCircleIcon className="add-associate-icon" />
                    {intl.get('add-associate')}
                  </button>
                </div>
                <h3 className="title-associate-table">{intl.get('associates')}</h3>
                <table className={`associates-table ${associates.length === 0 ? 'empty-table' : ''}`}>
                  <thead>
                    <tr className="associates-header">
                      <th className="name-email">{intl.get('name-and-email')}</th>
                      <th className="name">{intl.get('name')}</th>
                      <th className="email">{intl.get('email')}</th>
                      <th className="roles">{intl.get('roles')}</th>
                      <th className="action">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {associates.length === 0 && (
                    <tr><td>{intl.get('account-no-associates')}</td></tr>
                    )}
                    {associates.map((associate) => {
                      const associateEmail = associate.associate._primaryemail[0].email;
                      return (
                        <tr key={associateEmail} className="associates-table-row">
                          <td className="name">
                            <div className="name-part">{associate.associate.name}</div>
                          </td>
                          <td className="email">
                            <div className="email-part">{associateEmail}</div>
                          </td>
                          <td className="name-email">
                            <div className="name-part">{associate.associate.name}</div>
                            <div className="email-part">{associateEmail}</div>
                          </td>
                          <td className="roles">
                            {associate.roles._roles.length && associate.roles._roles[0]._element ? associate.roles._roles[0]._element.map(r => intl.get(r.name.toLowerCase()) || r.name).join(', ') : intl.get('none')}
                          </td>
                          <td className="action">
                            <button type="button" className="edit-associate" onClick={() => this.handleEditAssociateClicked(associate.roles._selector[0], associateEmail)}>
                              <EditIcon />
                            </button>
                            <button type="button" className="delete-associate" onClick={() => this.handleDeleteModalOpen(associate.self.uri)}>
                              <TrashIcon />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Modal
                open={isDeleteAssociateOpen}
                onClose={this.handleDeleteModalClose}
                classNames={{ modal: 'b2b-delete-associate-dialog', closeButton: 'b2b-dialog-close-btn' }}
              >
                <div className="dialog-header">{intl.get('remove-associate')}</div>
                <div className="dialog-content">
                  <p>
                    {intl.get('confirm-delete-associate')}
                  </p>
                </div>
                <div className="dialog-footer">
                  <button className="cancel" type="button" onClick={this.handleDeleteModalClose}>{intl.get('no')}</button>
                  <button className="upload" type="button" onClick={() => this.handleDeleteAssociateClicked(associateUri)}>
                    {intl.get('yes')}
                  </button>
                </div>
                {isLoading ? (
                  <div className="loader-wrapper">
                    <div className="miniLoader" />
                  </div>
                ) : ''}
              </Modal>

              <B2bEditAccount
                handleClose={this.handleAccountSettingsClose}
                handleUpdate={this.handleAccountSettingsUpdate}
                isOpen={isSettingsDialogOpen}
                accountData={editAccountData}
                editSubAccountUri={editSubAccountUri}
                editMetadataUri={editMetadataUri}
              />
              <B2bEditAssociate
                handleClose={this.isEditAssociateClose}
                handleUpdate={this.handleAccountSettingsUpdate}
                accountName={mainAccountName}
                subAccountName={accountName}
                rolesSelector={selector}
                isSelf={associateEditEmail === userEmail}
                associateEmail={associateEditEmail}
                isOpen={isEditAssociateOpen}
                isAddAssociateOpen={isAddAssociateOpen}
                addAssociateUri={addAssociateUri}
              />
              <B2bAddSubAccount
                handleClose={this.handleAddSubAccountClose}
                handleUpdate={this.handleAccountSettingsUpdate}
                isOpen={isAddSubAccountOpen}
                addSubAccountUri={addSubAccountUri}
                addSubAccountSellerAdmin={addSubAccountSellerAdmin}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
