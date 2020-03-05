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
}

interface IVRComponentProps {
  /** the url to place a background image in the scene. */
  backgroundUri?: any,
  /** Called when Vr window is closed. */
  handleCloseVR: any,
}

// eslint-disable-next-line react/prefer-stateless-function
class VRProductDisplayItem extends Component<IVRComponentProps, IVRComponentState> {
  static isSafari() {
    const { userAgent } = navigator;
    return (/Safari/i).test(userAgent) && !(/Chrome/i).test(userAgent);
  }

  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
    };
    this.handleInfoPanel = this.handleInfoPanel.bind(this);
  }

  handleInfoPanel() {
    const { showInfo } = this.state;

    this.setState({ showInfo: !showInfo });
  }

  public render() {
    const { backgroundUri, handleCloseVR } = this.props;
    const { showInfo } = this.state;

    return (
      <div>
        {/* VR Window */}
        <div className="vr-window-container">
          <button type="button" className="exit-btn" onClick={() => handleCloseVR()} />

          <Scene className="vr-container" embedded vr-mode-ui="enterVRButton: #myEnterVRButton;" loading-screen="backgroundColor: #000000; dotsColor: white">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a id="myEnterVRButton" href="#">
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
              <div role="button" tabIndex={0} className="vr-fullscreen" />
            </a>

            <a-assets>
              {
                VRProductDisplayItem.isSafari() ? (
                  <img alt="" id="background" src={backgroundUri} />
                ) : (
                  <img alt="" id="background" src={backgroundUri} crossOrigin="anonymous" />
                )
              }
            </a-assets>

            <a-assets>
              {/* eslint-disable-next-line react/self-closing-comp */}
              <a-asset-item id="cityModel" src="https://referenceexp.s3.amazonaws.com/vr/meshes/scene.gltf" response-type="arraybuffer"></a-asset-item>
            </a-assets>
            {/* eslint-disable-next-line react/self-closing-comp */}
            <Entity gltf-model="#cityModel" modify-materials scale="1 1 1" position="-3 0 -5"></Entity>

            <Entity primitive="a-sky" radius="30" src="#background" />


            {/* Deal with camera sounds... */}

            <Entity camera look-controls>
              {/* eslint-disable-next-line react/self-closing-comp */}
              <Entity
                cursor="fuse: true; fuseTimeout: 500"
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
                material="color: red; shader: flat"
              >
              </Entity>
            </Entity>

            <Entity id="box" cursor-listener geometry="primitive: box" material="color: blue" />

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
