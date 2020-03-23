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
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './compliancesupport.main.less';

let Config: IEpConfig | any = {};

interface ComplianceSupportModalProps {
  /** handle accept data policy */
  onAcceptDataPolicy?: (...args: any[]) => any,
}

interface ComplianceSupportModalState {
  open: boolean,
  checked: boolean,
}

class ComplianceSupportModal extends Component<ComplianceSupportModalProps, ComplianceSupportModalState> {
  static defaultProps = {
    onAcceptDataPolicy: () => {},
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      open: true,
      checked: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleAcceptCompliance = this.handleAcceptCompliance.bind(this);
    this.handleDeclineCompliance = this.handleDeclineCompliance.bind(this);
  }

  handleOpenModal() {
    this.setState({ open: true });
  }

  handleCloseModal() {
    this.setState({ open: false });
  }

  handleCheck() {
    const { checked } = this.state;
    this.setState({ checked: !checked });
  }

  handleAcceptCompliance() {
    const { checked } = this.state;
    if (checked) {
      this.dataPolicyConsent();
    }
  }

  dataPolicyConsent() {
    const { onAcceptDataPolicy } = this.props;
    localStorage.setItem(`${Config.cortexApi.scope}_Compliance_Accept`, 'true');
    this.setState({ open: false });
    login().then(() => {
      cortexFetch(`/datapolicies/${Config.cortexApi.scope}?zoom=element,element:datapolicyconsentform`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            'X-Ep-Data-Policy-Segments': `${Config.Compliance.dataPolicySegments}`,
          },
        })
        .then(res => res.json())
        .then((res) => {
          if (res._element) {
            const dataPolicyPromises = res._element.filter(element => element['data-policy-consent'] === 'false')
              .map(element => cortexFetch(element._datapolicyconsentform[0].links[0].uri, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
                  'X-Ep-Data-Policy-Segments': `${Config.Compliance.dataPolicySegments}`,
                },
                body: JSON.stringify({ 'data-policy-consent': true }),
              }));
            Promise.all(dataPolicyPromises)
              .then(() => onAcceptDataPolicy())
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error.message);
              });
          } else {
            onAcceptDataPolicy();
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleDeclineCompliance() {
    localStorage.setItem(`${Config.cortexApi.scope}_Compliance_Decline`, 'true');
    this.setState({ open: false });
  }

  render() {
    const { open, checked } = this.state;
    const privacyAndPolicy = (
      <Link to="/privacypolicies" onClick={this.handleCloseModal}>
        {intl.get('privacy-policy')}
      </Link>);
    const termsConditions = (
      <Link to="/termsandconditions" onClick={this.handleCloseModal}>
        {intl.get('terms-conditions')}
      </Link>);
    const msg = intl.get('compliance-label').split(/[{}]/g);
    const obj = { privacyAndPolicy, termsConditions };
    return (
      <div>
        <Modal open={open} onClose={this.handleCloseModal}>
          <div className="compliance-support-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('your-compliance-notice')}
                </h2>
              </div>
              <div className="modal-body">
                <div className="compliance-checkbox-wrap">
                  <label htmlFor="compliance_agreement">
                    <div className="first-label">
                      {intl.get('compliance-first-label')}
                    </div>
                    <div className="checkbox-label">
                      <input id="compliance_agreement" type="checkbox" onChange={this.handleCheck} defaultChecked={checked} />
                      <span className="helping-el" />
                      {intl.get('compliance-check-box-label')}
                    </div>
                    <div className="label-text">
                      {msg.map((str) => {
                        const i = Object.keys(obj).indexOf(str);
                        return i === -1 ? str : obj[str];
                      })}
                    </div>
                  </label>
                </div>
                <div className="action-row">
                  <button type="button" onClick={this.handleDeclineCompliance} className="ep-btn">{intl.get('decline')}</button>
                  <button type="button" onClick={this.handleAcceptCompliance} className="ep-btn primary" disabled={!checked}>{intl.get('accept')}</button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ComplianceSupportModal;
