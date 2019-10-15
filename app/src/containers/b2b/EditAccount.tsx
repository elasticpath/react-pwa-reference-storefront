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
import copy from 'copy-to-clipboard';
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import * as Config from '../../ep.config.json';
import clipboardIcon from '../../images/icons/copy.svg';
import copiedIcon from '../../images/icons/check-circle-filled.svg';

import './EditAccount.less';

const COPIED_TIMEOUT_LENGTH = 4000;

interface EditAccountProps {
  isOpen: boolean,
  editSubAccountUri: string,
  editMetadataUri: string,
  handleClose: () => void,
  handleUpdate: () => void,
  accountData: {
    name: string,
    legalName: string,
    externalId: string,
    registrationNumber: string,
    selfSignUpCode: string
    uri: string
  }
}

interface EditAccountState {
  name: string,
  legalName: string,
  externalId: string,
  registrationNumber: string,
  isShowingCopied: boolean,
  isLoading: boolean,
}


export default class EditAccount extends React.Component<EditAccountProps, EditAccountState> {
  copiedTimeout?: number;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      legalName: '',
      externalId: '',
      registrationNumber: '',
      isShowingCopied: false,
      isLoading: false,
    };

    this.editAccount = this.editAccount.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      name, legalName, externalId, registrationNumber,
    } = nextProps.accountData;
    this.setState({
      name,
      legalName,
      externalId,
      registrationNumber,
    });

    if (this.copiedTimeout) {
      clearTimeout(this.copiedTimeout);
      this.setState({ isShowingCopied: false });
      this.copiedTimeout = undefined;
    }
  }

  editAccount(event) {
    const {
      handleClose, handleUpdate, editSubAccountUri, editMetadataUri,
    } = this.props;
    const {
      name, legalName, externalId, registrationNumber,
    } = this.state;

    event.preventDefault();
    this.setState({ isLoading: true });
    login().then(() => {
      adminFetch(`${editSubAccountUri}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
        body: JSON.stringify({
          name,
          'legal-name': legalName,
          'registration-id': registrationNumber,
        }),
      })
        .then(() => {
          if (editMetadataUri) {
            adminFetch(`${editMetadataUri}`, {
              method: 'put',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
              },
              body: JSON.stringify({
                'external-id': externalId,
              }),
            });
          }
        })
        .then(() => {
          handleClose();
          handleUpdate();
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
        });
    });
  }

  changeHandler(event) {
    const { name } = event.target;
    const { value } = event.target;

    // @ts-ignore
    this.setState({ [name]: value });
  }

  copyToClipboard(text) {
    copy(text);
    this.setState({ isShowingCopied: false }, () => {
      this.setState({ isShowingCopied: true });

      this.copiedTimeout = window.setTimeout(() => {
        this.setState({ isShowingCopied: false });
      }, COPIED_TIMEOUT_LENGTH);
    });
  }

  render() {
    const {
      isOpen, handleClose, accountData, editMetadataUri,
    } = this.props;
    const {
      name, legalName, externalId, registrationNumber, isShowingCopied, isLoading,
    } = this.state;

    return (
      <Modal
        open={isOpen}
        onClose={handleClose}
        classNames={{ modal: 'b2b-edit-account-dialog', closeButton: 'b2b-dialog-close-btn' }}
      >
        <div className="dialog-header">{intl.get('edit-account')}</div>
        <div className="dialog-content">
          <form onSubmit={this.editAccount} id="editAccount">
            <div className="b2b-form-row">
              <label htmlFor="name" className="b2b-form-col">
                <p className="b2b-dark-text">{intl.get('name')}</p>
                <input id="name" className="b2b-input" value={name || ''} onChange={this.changeHandler} name="name" type="text" />
              </label>
              <label htmlFor="legal-name" className="b2b-form-col">
                <p className="b2b-dark-text">{intl.get('legal-name')}</p>
                <input id="legal-name" className="b2b-input" value={legalName || ''} onChange={this.changeHandler} name="legalName" type="text" />
              </label>
            </div>
            <div className="b2b-form-row">
              <label htmlFor="registration-number" className="b2b-form-col">
                <p className="b2b-dark-text">{intl.get('registration-number')}</p>
                <input id="registration-number" className="b2b-input" value={registrationNumber || ''} onChange={this.changeHandler} name="registrationNumber" type="text" />
              </label>
              {editMetadataUri && (
                <label htmlFor="external-id" className="b2b-form-col">
                  <p className="b2b-dark-text">{intl.get('external-id')}</p>
                  <input id="external-id" className="b2b-input" value={externalId || ''} onChange={this.changeHandler} name="externalId" type="text" />
                </label>)
              }
            </div>
            {accountData.selfSignUpCode && (
              <div className="b2b-form-row">
                <div className="b2b-form-col">
                  <p className="b2b-dark-text">{intl.get('self-sign-up-account-code')}</p>
                  {accountData.selfSignUpCode}
                </div>
                <div className="b2b-form-col">
                  {isShowingCopied
                    ? (
                      <div className="b2b-copy">
                        <img src={copiedIcon} alt="icon" />
                        {intl.get('copied')}
                      </div>
                    )
                    : (
                      /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
                      <div
                        className="b2b-copy"
                        onClick={() => this.copyToClipboard(accountData.selfSignUpCode)}
                        onKeyDown={() => this.copyToClipboard(accountData.selfSignUpCode)}
                      >
                        <img src={clipboardIcon} alt="icon" />
                        {intl.get('copy-to-clipboard')}
                      </div>
                    )
                  }
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="dialog-footer">
          <button className="cancel" type="button" onClick={handleClose}>{intl.get('cancel')}</button>
          <button className="save" type="submit" disabled={isLoading} form="editAccount">{intl.get('save')}</button>
        </div>
      </Modal>
    );
  }
}
