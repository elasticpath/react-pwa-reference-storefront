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
  isMobile: boolean,
}

interface IVRComponentProps {
  /** the url to place a background image in the scene. */
  backgroundUri?: any,
  /** Called when Vr window is closed. */
  handleCloseVR: any,
  /** The 3D Mesh uri */
  meshUri: any
}

// eslint-disable-next-line react/prefer-stateless-function
class VRProductDisplayItem extends Component<IVRComponentProps, IVRComponentState> {
  static isSafari() {
    const { userAgent } = navigator;
    return (/Safari/i).test(userAgent) && !(/Chrome/i).test(userAgent);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return {
        isMobile: true,
      };
    }
    return {
      isMobile: false,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      isMobile: false,
    };
    this.handleInfoPanel = this.handleInfoPanel.bind(this);
  }

  handleInfoPanel() {
    const { showInfo } = this.state;

    this.setState({ showInfo: !showInfo });
  }

  public render() {
    const { backgroundUri, handleCloseVR, meshUri } = this.props;
    const { showInfo, isMobile } = this.state;

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
            <Entity primitive="a-sky" radius="30" src="#background" />

            <a-assets>
              <a-asset-item id="mesh" src="https://referenceexp.s3.amazonaws.com/vr/meshes/scene.gltf" response-type="arraybuffer" />
            </a-assets>
            <Entity gltf-model="#mesh" modify-materials scale="1 1 1" position="-3 0 -5" />

            {isMobile && (
              <a-camera>
                {/* eslint-disable-next-line react/self-closing-comp */}
                <a-cursor
                  cursor="fuse: true; fuseTimeout: 2000"
                  position="0 0 -1"
                  geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.02"
                  material="color: grey; shader: flat"
                />
              </a-camera>
            )
            }

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
