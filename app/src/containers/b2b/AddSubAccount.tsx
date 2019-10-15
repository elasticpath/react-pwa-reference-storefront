
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
import Modal from 'react-responsive-modal';
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import * as Config from '../../ep.config.json';

import './EditAccount.less';

interface AddSubAccountProps {
    isOpen: boolean,
    handleClose: () => void,
    handleUpdate: () => void,
    addSubAccountUri: string,
    addSubAccountSellerAdmin: boolean,
}

interface AddSubAccountState {
    name: string,
    legalName: string,
    externalId: string,
    registrationNumber: string,
    isLoading: boolean,
}

export default class AddSubAccount extends React.Component<AddSubAccountProps, AddSubAccountState> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      legalName: '',
      externalId: '',
      registrationNumber: '',
      isLoading: false,
    };

    this.addSubAccount = this.addSubAccount.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps() {
  }

  addSubAccount(event) {
    const { addSubAccountUri, handleClose, handleUpdate } = this.props;
    const {
      name, legalName, externalId, registrationNumber,
    } = this.state;

    event.preventDefault();
    this.setState({ isLoading: true });
    login().then(() => {
      adminFetch(`${addSubAccountUri}?followlocation&format=standardlinks,zoom.nodatalinks`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
        body: JSON.stringify({
          name,
          'external-id': externalId,
          'legal-name': legalName,
          'registration-id': registrationNumber,
        }),
      })
        .then(() => {
          handleClose();
          handleUpdate();
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
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

  render() {
    const { isOpen, handleClose, addSubAccountSellerAdmin } = this.props;
    const {
      name, legalName, externalId, registrationNumber, isLoading,
    } = this.state;

    return (
      <Modal
        open={isOpen}
        onClose={handleClose}
        classNames={{ modal: 'b2b-edit-account-dialog', closeButton: 'b2b-dialog-close-btn' }}
      >
        <div className="dialog-header">{intl.get('add-sub-account')}</div>
        <div className="dialog-content">
          <form onSubmit={this.addSubAccount} id="subAccountsForm">
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
              {addSubAccountSellerAdmin && (
                <label htmlFor="external-id" className="b2b-form-col">
                  <p className="b2b-dark-text">{intl.get('external-id')}</p>
                  <input id="external-id" className="b2b-input" value={externalId || ''} onChange={this.changeHandler} name="externalId" type="text" />
                </label>)
              }
            </div>
          </form>
        </div>
        <div className="dialog-footer">
          <button className="cancel" type="button" onClick={handleClose}>{intl.get('cancel')}</button>
          <button className="save" type="submit" disabled={isLoading} form="subAccountsForm">{intl.get('save')}</button>
        </div>
      </Modal>
    );
  }
}
