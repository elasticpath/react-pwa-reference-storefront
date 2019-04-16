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
import intl from 'react-intl-universal';
import { withRouter } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import './gdprsupport.main.less';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';

const Config = require('Config');

class GdprSupportModal extends React.Component {
  constructor() {
    super();
    this.state = {
      open: true,
      checked: false,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleAcceptGdpr = this.handleAcceptGdpr.bind(this);
    this.handleDeclineGdpr = this.handleDeclineGdpr.bind(this);
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

  handleAcceptGdpr() {
    const { checked } = this.state;
    if (checked) {
      this.dataPolicyConsent();
    }
  }

  dataPolicyConsent() {
    localStorage.setItem(`${Config.cortexApi.scope}_GDPR_Support_Accept`, 'true');
    this.setState({ open: false });
    login().then(() => {
      cortexFetch(`/datapolicies/${Config.cortexApi.scope}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            'X-Ep-Data-Policy-Segments': 'EU_Data_Policy',
          },
        })
        .then(res => res.json())
        .then((res) => {
          if (res && res.links) {
            for (let i = 0; i < res.links.length; i++) {
              if (res.links[i].type === 'datapolicies.data-policy') {
                cortexFetch(res.links[i].uri,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
                      'X-Ep-Data-Policy-Segments': 'EU_Data_Policy',
                    },
                  })
                  .then(datapolicies => datapolicies.json())
                  .then((datapolicies) => {
                    if (datapolicies['data-policy-consent'] === 'false') {
                      cortexFetch(`${datapolicies.links[1].uri}?followlocation`,
                        {
                          method: 'post',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
                            'X-Ep-Data-Policy-Segments': 'EU_Data_Policy',
                          },
                          body: JSON.stringify({ 'data-policy-consent': true }),
                        })
                        .then(() => {
                          window.location.reload();
                        })
                        .catch((error) => {
                          // eslint-disable-next-line no-console
                          console.error(error.message);
                          window.location.reload();
                        });
                    }
                  })
                  .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.error(error.message);
                    window.location.reload();
                  });
              }
            }
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          window.location.reload();
        });
    });
  }

  handleDeclineGdpr() {
    localStorage.setItem(`${Config.cortexApi.scope}_GDPR_Support_Decline`, 'true');
    this.setState({ open: false });
  }

  render() {
    const { open, checked } = this.state;

    return (
      <div>
        <Modal open={open} onClose={this.handleCloseModal}>
          <div className="modal-lg gdpr-support-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('gdpr')}
                </h2>
              </div>
              <div className="modal-body">
                <div className="gdpr-checkbox-wrap">
                  <label htmlFor="gdpr_agreement">
                    <input id="gdpr_agreement" type="checkbox" onChange={this.handleCheck} defaultChecked={checked} />
                    <span className="helping-el" />
                    <span className="label-text">
                      {intl.get('gdpr-label')}
                    </span>
                  </label>
                </div>
                <div className="action-row">
                  <button type="button" onClick={this.handleAcceptGdpr} className="ep-btn primary wide" disabled={!checked}>{intl.get('accept')}</button>
                  <button type="button" onClick={this.handleDeclineGdpr} className="ep-btn primary wide">{intl.get('decline')}</button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(GdprSupportModal);
