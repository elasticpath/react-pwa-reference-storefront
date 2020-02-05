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
import { RouteComponentProps } from 'react-router-dom';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import Config from '../ep.config.json';

import './ChangePasswordPage.less';

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultprofile',
  'defaultprofile:emails',
  'defaultprofile:emails:element',
  'defaultprofile:emails:element:list',
  'defaultprofile:emails:element:profile',
  'defaultprofile:emails:emailform',
  'defaultprofile:emails:profile',
  'defaultprofile:addresses:element',
  'defaultprofile:addresses:billingaddresses:default',
  'defaultprofile:paymentmethods',
  'defaultprofile:paymentmethods:paymenttokenform',
  'defaultprofile:paymentmethods:element',
  'passwordresetform',
];

interface ChangePasswordFormLocationState {
  returnPage: string;
}

interface ChangePasswordFormState {
    oldPassword: string,
    newPassword: string,
    newPasswordConfirmed: string,
    failedSubmit: boolean,
    email: string,
    passwordResetUri: string,
}

class ChangePasswordForm extends React.Component<RouteComponentProps<{}, {}, ChangePasswordFormLocationState>, ChangePasswordFormState> {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmed: '',
      failedSubmit: false,
      email: '',
      passwordResetUri: '',
    };
    this.setOldPassword = this.setOldPassword.bind(this);
    this.setNewPassword = this.setNewPassword.bind(this);
    this.setNewPasswordConfirmed = this.setNewPasswordConfirmed.bind(this);
    this.submitNewPassword = this.submitNewPassword.bind(this);
  }

  componentDidMount() {
    this.fetchProfileData();
  }

  setOldPassword(event) {
    this.setState({ oldPassword: event.target.value });
  }

  setNewPassword(event) {
    this.setState({ newPassword: event.target.value });
  }

  setNewPasswordConfirmed(event) {
    this.setState({ newPasswordConfirmed: event.target.value });
  }

  cancel() {
    const { location, history } = this.props;
    if (location.state && location.state.returnPage) {
      history.push(location.state.returnPage);
    } else if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      history.push('/profile');
    } else {
      history.push('/');
    }
  }

  submitNewPassword(event) {
    event.preventDefault();
    const {
      oldPassword, newPassword, newPasswordConfirmed, email, passwordResetUri,
    } = this.state;
    if (!oldPassword || !newPassword || !newPasswordConfirmed) {
      this.setState({ failedSubmit: true });
    }
    if (passwordResetUri) {
      login()
        .then((response) => {
          cortexFetch(`${passwordResetUri}/?zoom=resetpasswordaction`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({ 'user-id': email }),
          })
            .then(() => {});
          return response;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    }
  }

  fetchProfileData() {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          if (res && res._passwordresetform) {
            this.setState({ passwordResetUri: res._passwordresetform[0].self.uri });
          }
          if (res && res._defaultprofile) {
            this.setState({ email: res._defaultprofile[0]._emails[0]._element[0].email });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  render() {
    const {
      oldPassword, newPassword, newPasswordConfirmed, failedSubmit,
    } = this.state;
    return (
      <div className="change-password-form-component form-component container">
        <div className="title">
          {intl.get('change-password')}
        </div>
        <div className="feedback-label feedback-container">
          {failedSubmit ? intl.get('failed-to-save-message') : ''}
        </div>
        <form className="form-horizontal" onSubmit={this.submitNewPassword}>
          <div className="form-group">
            <label htmlFor="OldPassword" className="control-label">
              <span className="required-label">
                *
              </span>
              {' '}
              {intl.get('old-password')}
            </label>
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input id="old_password" name="OldPassword" className="form-control" type="password" value={oldPassword} onChange={this.setOldPassword} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="NewPassword" className="control-label">
              <span className="required-label">
                *
              </span>
              {' '}
              {intl.get('new-password')}
            </label>
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <input id="new_password" name="NewPassword" className="form-control" type="password" value={newPassword} onChange={this.setNewPassword} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ConfirmNewPassword" className="control-label">
              <span className="required-label">
                *
              </span>
              {' '}
              {intl.get('confirm-new-password')}
            </label>
            <div className="form-input">
              <input id="new_password_confirmed" name="ConfirmNewPassword" className="form-control" type="password" value={newPasswordConfirmed} onChange={this.setNewPasswordConfirmed} />
            </div>
          </div>
          <div className="form-group">
            <div className="control-label" />
            <div className="form-input btn-container">
              <button className="ep-btn primary address-save-btn" type="submit">
                {intl.get('save')}
              </button>
              <button className="ep-btn address-cancel-btn" type="button" onClick={() => { this.cancel(); }}>
                {intl.get('cancel')}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ChangePasswordForm;
