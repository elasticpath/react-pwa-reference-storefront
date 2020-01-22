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

import './ResetPasswordPage.less';

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'passwordresetform',
];

interface ResetPasswordFormState {
    emailReset: string,
    failedSubmit: boolean,
    passwordResetUri: string,
}

class ResetPasswordForm extends React.Component<RouteComponentProps, ResetPasswordFormState> {
  constructor(props) {
    super(props);
    this.state = {
      emailReset: '',
      failedSubmit: false,
      passwordResetUri: '',
    };
    this.setEmailReset = this.setEmailReset.bind(this);
    this.submitResetEmail = this.submitResetEmail.bind(this);
  }

  componentDidMount() {
    this.fetchPasswordResetData();
  }

  setEmailReset(event) {
    this.setState({ emailReset: event.target.value });
  }

  fetchPasswordResetData() {
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
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  submitResetEmail(event) {
    event.preventDefault();
    const { emailReset, passwordResetUri } = this.state;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailReset);
    if (!emailReset || !isValid) {
      this.setState({ failedSubmit: true });
    } else {
      this.setState({ failedSubmit: false });
      if (passwordResetUri) {
        login()
          .then((response) => {
            cortexFetch(`${passwordResetUri}/?zoom=resetpasswordaction`, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
              body: JSON.stringify({ 'user-id': emailReset }),
            })
              .then(() => {
              });
            return response;
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      }
    }
  }

  cancel() {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const {
      emailReset, failedSubmit,
    } = this.state;
    return (
      <div className="reset-password-form-component form-component container">
        <div className="title">
          {intl.get('reset-password')}
        </div>
        <div className="feedback-label feedback-container">
          {failedSubmit ? intl.get('incorrect-email') : ''}
        </div>
        <form className="form-horizontal" onSubmit={this.submitResetEmail}>
          <div className="form-group">
            <div className="control-label" />
            <div className="form-input">
              {/* eslint-disable-next-line max-len */}
              <p>
                {intl.get('reset-email-txt')}
              </p>
              <input id="email_reset" name="EmailReset" className="form-control" type="email" value={emailReset} onChange={this.setEmailReset} />
            </div>
          </div>
          <div className="form-group">
            <div className="control-label" />
            <div className="form-input btn-container">
              <button className="ep-btn primary address-save-btn" type="submit">
                {intl.get('reset-email')}
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

export default ResetPasswordForm;
