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

import './profilecompliance.main.less';

let Config: IEpConfig | any = {};

interface ProfileComplianceMainProps {
  /** data policies */
  dataPolicies: {
      [key: string]: any
  },
  /** handle data policies change */
  onChange: (...args: any[]) => any,
}

interface ProfileComplianceMainState {
    openNewPaymentModal: boolean
}

class ProfileComplianceMain extends Component<ProfileComplianceMainProps, ProfileComplianceMainState> {
  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
  }

  handleOnClick(link, consented) {
    if (consented === 'true') {
      this.handleRevokeConsent(link);
    } else {
      this.handleGiveConsent(link);
    }
  }

  handleRevokeConsent(link) {
    login().then(() => {
      cortexFetch(link, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          'X-Ep-Data-Policy-Segments': `${Config.Compliance.dataPolicySegments}`,
        },
        body: JSON.stringify({ 'data-policy-consent': false }),
      }).then(() => {
        const { onChange } = this.props;
        onChange();
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  handleGiveConsent(link) {
    login().then(() => {
      cortexFetch(link, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          'X-Ep-Data-Policy-Segments': `${Config.Compliance.dataPolicySegments}`,
        },
        body: JSON.stringify({ 'data-policy-consent': true }),
      }).then(() => {
        const { onChange } = this.props;
        onChange();
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  renderDataPolicies() {
    const { dataPolicies } = this.props;
    return (dataPolicies._element) ? (
      dataPolicies._element.map(element => (
        <ul key={`${element['policy-name']}-${element['policy-reference-key']}`} className="profile-data-policy-listing">
          <li className="profile-data-policy-container">
            <div className="profile-data-policy-label-container">
              <span className="data-policy-container">
                {element['policy-name']}
              </span>
            </div>
            <div className="profile-data-policy-label-container">
              <span className="data-policy-container">
                {`${intl.get('data-policy-reference-key')}: ${element['policy-reference-key']}`}
              </span>
            </div>
            <button className="ep-btn small profile-delete-data-policy-btn" type="button" onClick={() => { this.handleOnClick(element._datapolicyconsentform[0].links[0].uri, element['data-policy-consent']); }}>
              {(element['data-policy-consent'] === 'true') ? intl.get('compliance-consent-revoke') : intl.get('compliance-consent')}
            </button>
          </li>
        </ul>
      ))
    ) : ('');
  }

  render() {
    const { dataPolicies } = this.props;
    if (dataPolicies) {
      return (
        <div className="dataPolicyRegions" data-region="dataPolicyRegions">
          <div>
            <h2>
              {intl.get('data-policies')}
            </h2>
            {this.renderDataPolicies()}
          </div>
        </div>
      );
    }
    return (<div className="loader" />);
  }
}

export default ProfileComplianceMain;
