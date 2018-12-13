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
import './quickorder.main.less';

const Config = require('Config');

class QuickOrderMain extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      failedSubmit: false,
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
      failedSubmit,
    } = this.state;
    return (
      <div className="quick-order-container" data-region="profilePersonalInfoRegion" style={{ display: 'block' }}>
        <div>
          <h2 className="quick-order-title">
            {intl.get('quick-order-title')}
          </h2>
          <form className="form-horizontal" onSubmit={this.submitPersonalInfoChange}>
            <div data-region="componentQuickOrderFormRegion">
              <div className="quick-order-form-container profile-info-edit-container">
                <div className="feedback-label quick-order-form-feedback-container" data-region="componentQuickOrderFeedbackRegion">
                  {failedSubmit ? intl.get('failed-to-save-message') : ''}
                </div>
                <div className="form-group quick-order-forms">
                  <div className="quick-order-form-input">
                    {/* eslint-disable-next-line max-len */}
                    <input id="registration_form_firstName" name="FirstName" className="form-control" type="text" defaultValue={intl.get('quick-order-sku-title')} onChange={this.setFirstName} />
                  </div>
                  <div className="quantity-col" data-el-value="lineItem.quantity">
                    <select className="quantity-select form-control" id="select-quantity" name="select-quantity" onChange={this.handleQuantityChange}>
                      <option value="1">
                        1
                      </option>
                      <option value="2">
                        2
                      </option>
                      <option value="3">
                        3
                      </option>
                      <option value="4">
                        4
                      </option>
                      <option value="5">
                        5
                      </option>
                      <option value="6">
                        6
                      </option>
                      <option value="7">
                        7
                      </option>
                      <option value="8">
                        8
                      </option>
                      <option value="9">
                        9
                      </option>
                      <option value="10">
                        10
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group quick-order-btn-container profile-info-btn-container">
              <button className="ep-btn primary wide profile-info-save-btn" data-el-label="quickOrderForm.save" type="submit">
                {intl.get('add-to-cart')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default QuickOrderMain;
