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
// import 'aframe-animation-component';
// import 'aframe-particle-system-component';
import { Entity, Scene } from 'aframe-react';
import React, { Component } from 'react';
import './VRProductDisplayItem.less';
import { ReactComponent as CloseIcon } from '../../../images/icons/close-icon.svg';
import { ReactComponent as Fullscreen } from '../../../images/icons/fullscreen.svg';
import { ReactComponent as InfoIcon } from '../../../images/icons/info.svg';

interface IVRComponentState {
  showInfo: boolean,
}

interface IVRComponentProps {
  backgroundUri?: any,
  handleCloseVR: any,
}

// eslint-disable-next-line react/prefer-stateless-function
class VRProductDisplayItem extends Component<IVRComponentProps, IVRComponentState> {
  INFO_TEXT = 'This is a 360 view! You can use your mouse/touch screen to pan.  Click the bottom right corner icon to enable fullscreen VR mode.  Click the top right X to return to normal product images.';

  constructor(props) {
    super(props);
    this.state = { showInfo: false };
    this.showInfoPlane = this.showInfoPlane.bind(this);
    this.closeInfoPlane = this.showInfoPlane.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  showInfoPlane() {
    console.log('show info plane running');
    this.setState({ showInfo: true });
  }

  closeInfoPlane() {
    console.log('close info plane running');
    this.setState({ showInfo: false });
  }

  public render() {
    const { backgroundUri, handleCloseVR } = this.props;
    const { showInfo } = this.state;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div>
        <button type="button" className="exit-btn" onClick={() => handleCloseVR()}>
          <CloseIcon />
        </button>

        <button type="button" className="info-btn" onClick={() => this.showInfoPlane()}>
          <InfoIcon />
        </button>

        {(showInfo) && (
        <div className="info-container">
          <div className="info-contents">
            <p className="info-text">{this.INFO_TEXT}</p>
          </div>
        </div>)}

        <Scene className="vr-container" embedded vr-mode-ui="enterVRButton: #myEnterVRButton;">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a id="myEnterVRButton" href="#">
            <Fullscreen />
          </a>

          <a-assets>
            <img alt="" id="luxuryCar" src={backgroundUri} />
          </a-assets>

          <Entity primitive="a-sky" radius="30" src="#luxuryCar" />
        </Scene>
      </div>
    );
  }
}

export default VRProductDisplayItem;
