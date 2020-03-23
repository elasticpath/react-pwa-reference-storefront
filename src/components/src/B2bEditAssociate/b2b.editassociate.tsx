
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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Modal from 'react-responsive-modal';
import { adminFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './b2b.editassociate.less';

let Config: IEpConfig | any = {};

interface B2bEditAssociateProps {
  /** is open */
  isOpen: boolean,
  /** handle close */
  handleClose: () => void,
  /** handle update */
  handleUpdate: () => void,
  /** associate email */
  associateEmail: string,
  /** account name */
  accountName: string,
  /** sub account name */
  subAccountName: string,
  /** uri for add associate */
  addAssociateUri: string,
  /** roles selector */
  rolesSelector: any,
  /** is self */
  isSelf: boolean,
  /** is add associate open */
  isAddAssociateOpen: boolean,
}

interface B2bEditAssociateState {
    changedRoles: any,
    isLoading: boolean,
    newAssociateEmail: string
    emailErrorMessage: string,
    validEmail: boolean,
}

class B2bEditAssociate extends Component<B2bEditAssociateProps, B2bEditAssociateState> {
  constructor(props: any) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      changedRoles: [],
      isLoading: false,
      newAssociateEmail: '',
      emailErrorMessage: '',
      validEmail: true,
    };
    this.renderRoleSelection = this.renderRoleSelection.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleSaveClicked = this.handleSaveClicked.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  renderRoleSelection() {
    const { rolesSelector, isSelf } = this.props;

    const allAssociateRoles = [];
    if (rolesSelector) {
      if (rolesSelector._choice) {
        rolesSelector._choice.forEach((choiceElement) => {
          allAssociateRoles.push({
            roleName: choiceElement._description[0].name,
            selectRoleURI: choiceElement._selectaction[0].self.uri,
            selected: false,
          });
        });
      }
      if (rolesSelector._chosen) {
        rolesSelector._chosen.forEach((chosenElement) => {
          allAssociateRoles.push({
            roleName: chosenElement._description[0].name,
            selectRoleURI: chosenElement._selectaction[0].self.uri,
            selected: true,
          });
        });
      }
      allAssociateRoles.sort((a, b) => {
        if (a.roleName > b.roleName) {
          return 1;
        }
        if (a.roleName < b.roleName) {
          return -1;
        }
        return 0;
      });
    } else {
      const defaultRoles = ['BUYER', 'CATALOG_BROWSER', 'BUYER_ADMIN'];
      defaultRoles.forEach((role) => {
        allAssociateRoles.push({
          roleName: role,
          selectRoleURI: '',
          selected: false,
        });
      });
    }
    return (
      <div>
        {allAssociateRoles.map(role => (
          <div key={role.roleName} className="role-checkbox">
            <input id={role.roleName} type="checkbox" defaultChecked={role.selected} onChange={() => this.handleRoleChange(role)} className="style-checkbox" />
            <label htmlFor={role.roleName} />
            <label htmlFor={role.roleName} className="role-title">{intl.get(role.roleName.toLowerCase()) || role.roleName}</label>
          </div>
        ))}
      </div>
    );
  }

  handleRoleChange(role) {
    const { changedRoles } = this.state;

    const changes = changedRoles;
    const roleIndex = changes.findIndex(r => r.roleName === role.roleName);
    if (roleIndex !== -1) {
      changes.splice(roleIndex, 1);
    } else {
      changes.push(role);
    }
    this.setState({ changedRoles: changes });
  }

  handleSaveClicked() {
    const { changedRoles } = this.state;
    const { handleClose, handleUpdate } = this.props;
    if (!changedRoles.length) {
      this.setState({ emailErrorMessage: '', newAssociateEmail: '', validEmail: true });
      handleClose();
      return;
    }
    this.setState({ isLoading: true });
    changedRoles.forEach((selection) => {
      adminFetch(`${selection.selectRoleURI}?followlocation&format=standardlinks,zoom.nodatalinks`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
        body: JSON.stringify({}),
      })
        .then(res => res.json())
        .then(() => {
          this.setState({
            isLoading: false, emailErrorMessage: '', newAssociateEmail: '', validEmail: true,
          });
          handleClose();
          handleUpdate();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          this.setState({ isLoading: false });
        });
    });
  }

  handleAddAssociateClicked() {
    const { addAssociateUri, handleClose, handleUpdate } = this.props;
    const { changedRoles, newAssociateEmail } = this.state;
    // eslint-disable-next-line no-useless-escape
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (newAssociateEmail === '' && changedRoles.length) {
      this.setState({ emailErrorMessage: intl.get('field-cannot-be-empty') });
      return;
    } if (newAssociateEmail === '' && !changedRoles.length) {
      this.setState({ emailErrorMessage: '', validEmail: true });
      handleClose();
      return;
    } if (!newAssociateEmail.match(mailformat)) {
      this.setState({ validEmail: false });
      return;
    }
    this.setState({ emailErrorMessage: '', validEmail: true });


    this.setState({ isLoading: true });
    const roles = changedRoles.map(role => role.roleName.replace(' ', '_').toUpperCase());
    adminFetch(`${addAssociateUri}?followlocation&format=standardlinks,zoom.nodatalinks`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
      },
      body: JSON.stringify({ 'associate-id': newAssociateEmail, roles }),

    })
      .then(() => {
        this.setState({
          isLoading: false, emailErrorMessage: '', newAssociateEmail: '', validEmail: true,
        });
        handleClose();
        handleUpdate();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        this.setState({ isLoading: false });
      });
  }

  handleChange(event) {
    this.setState({ newAssociateEmail: event.target.value });
  }

  handleModalClose() {
    const { handleClose } = this.props;

    this.setState({ emailErrorMessage: '', newAssociateEmail: '', validEmail: true });
    handleClose();
  }

  render() {
    const {
      associateEmail, isOpen, accountName, subAccountName, isAddAssociateOpen,
    } = this.props;
    const {
      isLoading, newAssociateEmail, emailErrorMessage, validEmail,
    } = this.state;

    const isDisabled = !!associateEmail;
    return (
      <Modal
        open={isOpen}
        onClose={this.handleModalClose}
        classNames={{ modal: 'b2b-edit-associate-dialog', closeButton: 'b2b-dialog-close-btn' }}
      >
        <div className="dialog-header">{isAddAssociateOpen ? intl.get('add-associate') : intl.get('edit-associate')}</div>
        <div className="dialog-content">
          <div className="am-columns">
            <div className="am-field-editor">
              <div className="associate-email-title">{intl.get('associate-email')}</div>
              <input
                className={`field-editor-input ${(emailErrorMessage || !validEmail) ? 'input-code-error' : ''}`}
                type="text"
                onChange={event => this.handleChange(event)}
                disabled={isDisabled}
                value={associateEmail || newAssociateEmail}
              />
              <span className={`${(emailErrorMessage !== '' || !validEmail) ? 'input-error-icon' : ''}`} />
              <p className="error-message">
                {
                                    (emailErrorMessage !== '') ? emailErrorMessage : ''
                                }
                {
                                    (!validEmail && emailErrorMessage === '') ? intl.get('invalid-email-address') : ''
                                }
              </p>
            </div>

            <div>
              <div className="account-title">{intl.get('account')}</div>
              <p>{accountName}</p>
            </div>
          </div>
          <div className="am-columns">
            <div className="am-field-editor">
              <div className="checkbox-role-title">{intl.get('role')}</div>
              {this.renderRoleSelection()}
            </div>
            <div>
              <div className="account-title sub">{intl.get('associate-sub-account')}</div>
              <p>{subAccountName}</p>
            </div>
          </div>
        </div>
        <div className="dialog-footer">
          <button className="cancel" type="button" onClick={this.handleModalClose}>{intl.get('cancel')}</button>
          <button className="upload" type="button" onClick={isAddAssociateOpen ? () => this.handleAddAssociateClicked() : () => this.handleSaveClicked()}>
            {intl.get('save')}
          </button>
        </div>
        {isLoading ? (
          <div className="loader-wrapper">
            <div className="miniLoader" />
          </div>
        ) : ''}
      </Modal>
    );
  }
}

export default B2bEditAssociate;
