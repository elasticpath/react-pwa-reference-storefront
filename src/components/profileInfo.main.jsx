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

import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

class ProfileInfoMain extends React.Component {
  static propTypes = {
    profileInfo: PropTypes.objectOf(PropTypes.any).isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { profileInfo } = this.props;
    this.state = {
      inEditMode: false,
      failedSubmit: false,
      firstName: profileInfo['given-name'],
      lastName: profileInfo['family-name'],
    };
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.submitPersonalInfoChange = this.submitPersonalInfoChange.bind(this);
  }

  setFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  setLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  cancel() {
    this.setState({
      inEditMode: false,
    });
  }

  editPersonalInfo() {
    this.setState({
      inEditMode: true,
    });
  }

  submitPersonalInfoChange(event) {
    event.preventDefault();
    const {
      firstName, lastName,
    } = this.state;
    login().then(() => {
      cortexFetch('/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(res => res.json())
        .then((res) => {
          const profileNameLink = res.links.find(link => link.rel === 'defaultprofile');
          cortexFetch(`${profileNameLink.uri}?followlocation`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
          }).then(linkRes => linkRes.json())
            .then((linkRes) => {
              cortexFetch(linkRes.self.uri, {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
                },
                body: JSON.stringify({
                  'given-name': firstName,
                  'family-name': lastName,
                }),
              }).then((response) => {
                if (response.status === 400) {
                  this.setState({ failedSubmit: true });
                } else if (response.status === 201 || response.status === 200 || response.status === 204) {
                  this.cancel();
                  const { onChange } = this.props;
                  onChange();
                }
              }).catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error.message);
              });
            }).catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
            });
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  render() {
    const {
      inEditMode, failedSubmit,
    } = this.state;
    const {
      profileInfo,
    } = this.props;
    if (inEditMode) {
      return (
        <div data-region="profilePersonalInfoRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('personal-information')}
            </h2>
            <form className="form-horizontal" onSubmit={this.submitPersonalInfoChange}>
              <div data-region="componentAddressFormRegion" style={{ display: 'block' }}>
                <div className="address-form-container">
                  <div className="feedback-label address-form-feedback-container" data-region="componentAddressFeedbackRegion">
                    {failedSubmit ? intl.get('failed-to-save-message') : ''}
                  </div>
                  <div className="form-group">
                    <label htmlFor="FirstName" data-el-label="addressForm.firstName" className="control-label address-form-label">
                      <span className="required-label">
                        *
                      </span>
                      {' '}
                      {intl.get('first-name')}
                    </label>
                    <div className="address-form-input">
                      {/* eslint-disable-next-line max-len */}
                      <input id="registration_form_firstName" name="FirstName" className="form-control" type="text" defaultValue={profileInfo['given-name']} onChange={this.setFirstName} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="LastName" data-el-label="addressForm.lastName" className="control-label address-form-label">
                      <span className="required-label">
                        *
                      </span>
                      {' '}
                      {intl.get('last-name')}
                    </label>
                    <div className="address-form-input">
                      {/* eslint-disable-next-line max-len */}
                      <input id="registration_form_lastName" name="LastName" className="form-control" type="text" defaultValue={profileInfo['family-name']} onChange={this.setLastName} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group create-address-btn-container container">
                <button className="btn btn-primary address-save-btn" data-el-label="addressForm.save" type="submit">
                  {intl.get('save')}
                </button>
                <button className="btn address-cancel-btn" data-el-label="addressForm.cancel" type="button" onClick={() => { this.cancel(); }}>
                  {intl.get('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
    if (profileInfo.links.length > 0) {
      return (
        <div data-region="profilePersonalInfoRegion" style={{ display: 'block' }}>
          <div>
            <h2>
              {intl.get('personal-information')}
            </h2>
            <dl className="profile-personal-info-container container">
              <dt className="profile-personal-info-label" data-el-label="profile.firstName">
                {intl.get('first-name')}
                :
              </dt>
              <dd className="profile-personal-info-value" id="profile_personal_info_givenName" data-el-value="givenName">
                {profileInfo['given-name']}
              </dd>
              <dt className="profile-personal-info-label" data-el-label="profile.lastName">
                {intl.get('last-name')}
                :
              </dt>
              <dd className="profile-personal-info-value" id="profile_personal_info_familyName" data-el-value="familyName">
                {profileInfo['family-name']}
              </dd>
            </dl>

            <button className="btn btn-primary profile-personal-info-edit-btn" type="button" id="profile_personal_info_edit_button" onClick={() => { this.editPersonalInfo(); }}>
              {intl.get('edit')}
            </button>
          </div>
        </div>
      );
    }
    return (<div className="loader" />);
  }
}

export default ProfileInfoMain;
