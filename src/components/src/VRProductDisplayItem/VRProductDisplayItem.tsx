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
import 'aframe';
import { Entity, Scene } from 'aframe-react';
import React, { Component } from 'react';
import './VRProductDisplayItem.less';
import intl from 'react-intl-universal';

interface IVRComponentState {
  showInfo: boolean,
  overlayScene: boolean,
}

interface IVRComponentProps {
  backgroundUri?: any,
  handleCloseVR: any,
}

// eslint-disable-next-line react/prefer-stateless-function
class VRProductDisplayItem extends Component<IVRComponentProps, IVRComponentState> {
  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      overlayScene: false,
    };
    this.handleInfoPanel = this.handleInfoPanel.bind(this);
    this.setOverlay = this.setOverlay.bind(this);
  }

  handleInfoPanel() {
    const { showInfo } = this.state;

    this.setState({ showInfo: !showInfo });
  }

  setOverlay() {
    this.setState({ overlayScene: true });
  }

  public render() {
    const { backgroundUri, handleCloseVR } = this.props;
    const { showInfo, overlayScene } = this.state;

    return (
      <div>
        {/* VR Window */}
        <div className="vr-window-container">
          <button type="button" className="exit-btn" onClick={() => handleCloseVR()} />

          <Scene className={`vr-container ${overlayScene ? 'overlay' : 'underlay'}`} embedded vr-mode-ui="enterVRButton: #myEnterVRButton;">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a id="myEnterVRButton" href="#">
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
              <div role="button" tabIndex={0} className="vr-fullscreen" onClick={() => { this.setOverlay(); }} />
            </a>

            <a-assets>
              <img alt="" id="luxuryCar" src={backgroundUri} />
            </a-assets>

            <Entity primitive="a-sky" radius="30" src="#luxuryCar" />
          </Scene>
        </div>

        {/* Info Container */}
        <div>
          <div className="info-top-container">
            <button type="button" className="info-description" onClick={() => this.handleInfoPanel()}>
              {intl.get('info-btn-description')}
            </button>
          </div>

          {(showInfo) && (
          <div className="info-container">
            <div id="pointer" />
            <div className="info-contents">
              <div className="info-text">
                {intl.get('vr-info-txt')}
              </div>
            </div>
          </div>)}
        </div>

      </div>
    );
  }
}

export default VRProductDisplayItem;
