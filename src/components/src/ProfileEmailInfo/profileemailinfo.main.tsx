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
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './profileemailinfo.main.less';

let Config: IEpConfig | any = {};

type ProfileemailinfoMainProps = {
  /** user email */
  profileInfo: {
    [key: string]: any
  },
  /** handle email change */
  onChange: (...args: any[]) => any
};

type ProfileemailinfoMainState = {
  failedSubmit: boolean,
  emailInEditMode: boolean,
  email: string
};

class ProfileemailinfoMain extends Component<ProfileemailinfoMainProps, ProfileemailinfoMainState> {
  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
    const { profileInfo } = this.props;
    const email = profileInfo && profileInfo._emails && profileInfo._emails[0]._element ? profileInfo._emails[0]._element[0].email : '';

    this.state = {
      failedSubmit: false,
      emailInEditMode: false,
      email,
    };

    this.setEmail = this.setEmail.bind(this);
    this.submitEmailChange = this.submitEmailChange.bind(this);
  }

  setEmail(event) {
    this.setState({ email: event.target.value });
  }

  cancelEmail() {
    this.setState({ emailInEditMode: false });
  }

  editEmail() {
    this.setState({
      emailInEditMode: true,
    });
  }

  submitEmailChange(event) {
    event.preventDefault();
    const { email } = this.state;
    const { profileInfo } = this.props;
    if (!profileInfo) return;
    login()
      .then(() => {
        cortexFetch(profileInfo._emails[0]._emailform[0].self.uri, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({ email }),
        })
          .then((response) => {
            if (response.status === 400) {
              this.setState({ failedSubmit: true });
            } else if (response.status === 201 || response.status === 200 || response.status === 204) {
              this.cancelEmail();
              const { onChange } = this.props;
              onChange();
            }
            return response;
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  render() {
    const { emailInEditMode, failedSubmit } = this.state;
    const { profileInfo } = this.props;
    const email = profileInfo && profileInfo._emails && profileInfo._emails[0]._element ? profileInfo._emails[0]._element[0].email : '';
    if (emailInEditMode) {
      return (
        <div className="personal-information-container" data-region="profilePersonalInfoRegion">
          <form className="form-horizontal" onSubmit={this.submitEmailChange}>
            <div data-region="componentAddressFormRegion">
              <span>{failedSubmit ? intl.get('failed-to-save-email') : ''}</span>
              <div className="form-group">
                <label htmlFor="email" data-el-label="addressForm.email" className="control-label address-form-label profile-info-email-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  {intl.get('email')}
                </label>
                <div className="address-form-input profile-info-email-form-input">
                  {/* eslint-disable-next-line max-len */}
                  <input id="registration_form_email" name="email" className="form-control" type="email" defaultValue={email} onChange={this.setEmail} />
                </div>
              </div>
            </div>
            <div className="form-group create-address-btn-container profile-info-btn-container">
              <button className="ep-btn primary small profile-info-save-btn" data-el-label="emailForm.save" type="submit">
                {intl.get('save')}
              </button>
              <button
                className="ep-btn small profile-info-cancel-btn"
                data-el-label="emailForm.cancel"
                type="button"
                onClick={() => {
                  this.cancelEmail();
                }}
              >
                {intl.get('cancel')}
              </button>
            </div>
          </form>
        </div>
      );
    }
    if (profileInfo && profileInfo._emails) {
      return (
        <div className="personal-information-container" data-region="profilePersonalInfoRegion">
          <span className="feedback-label">{email === '' && intl.get('email-validation')}</span>
          <div className="personal-info-container">
            <div className="personal-info-email">
              <span className="info-label" data-el-label="profile.email">
                {intl.get('email')}
                :
              </span>
              <span className="info-value" id="profile_personal_info_email" data-el-value="email">
                {email}
              </span>
              <br />
              {(profileInfo._emails && profileInfo._emails[0]._emailform) ? (
                <button
                  className="ep-btn small profile-email-edit-btn"
                  type="button"
                  id="profile_personal_info_edit_button"
                  onClick={() => {
                    this.editEmail();
                  }}
                >
                  {intl.get('edit')}
                </button>
              ) : ('')}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default ProfileemailinfoMain;
