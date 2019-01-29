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
      localStorage.setItem(`${Config.cortexApi.scope}_GDPR_Support`, 'true');
      this.setState({ open: false });
      window.location.reload();
    }
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
                      {intl.get('gdrp-label')}
                    </span>
                  </label>
                </div>
                <div className="action-row">
                  <button type="button" onClick={this.handleAcceptGdpr} className="ep-btn primary wide" disabled={!checked}>{intl.get('accept')}</button>
                  <button type="button" onClick={this.handleCloseModal} className="ep-btn primary wide">{intl.get('decline')}</button>
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
