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
import 'aframe-look-at-component';
import 'aframe-html-shader';
import './VRProductDisplayItem.less';
import intl from 'react-intl-universal';
import vrClose from '../../images/icons/vr_close.png';
import vrDetailsHotspot from '../../images/icons/vr_details_hotspot.png';
import headerLogo from '../../../images/site-images/Company-Logo-v1.png';

interface IVRComponentState {
  showInfo: boolean,
  isMobile: boolean,
  showVrProductInfo: boolean,
}

interface IVRComponentProps {
  /** the url to place a background image in the scene. */
  backgroundUri?: any,
  /** Called when Vr window is closed. */
  handleCloseVR: any,
  /** The 3D Mesh uri */
  meshUri: any
}

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
      showVrProductInfo: false,
    };
    this.handleInfoPanel = this.handleInfoPanel.bind(this);
    this.handleMoreInfoClicked = this.handleMoreInfoClicked.bind(this);
  }

  handleInfoPanel() {
    const { showInfo } = this.state;
    this.setState({ showInfo: !showInfo });
  }

  handleMoreInfoClicked() {
    const { showVrProductInfo } = this.state;
    this.setState({
      showVrProductInfo: !showVrProductInfo,
    });
  }

  public render() {
    const { backgroundUri, handleCloseVR, meshUri } = this.props;
    const { showInfo, isMobile, showVrProductInfo } = this.state;

    return (
      <div>
        {/* VR Window */}
        <div className="vr-window-container">
          <button type="button" className="exit-btn" onClick={() => handleCloseVR()} />

          <div className="cover-html-texture" />
          {/* eslint-disable-next-line react/style-prop-object */}
          <div className="outer-html-texture">
            <div id="boxHTML" className="inner-html-texture">
              <p className="html-text-texture">Place holder html</p>
            </div>
          </div>

          <Scene className="vr-container" embedded vr-mode-ui="enterVRButton: #myEnterVRButton;" background="color: grey" loading-screen="backgroundColor: #000000; dotsColor: white">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a id="myEnterVRButton" href="#">
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
              <div role="button" tabIndex={0} className="vr-fullscreen" />
            </a>

            {/* <a-assets>
              {
                VRProductDisplayItem.isSafari() ? (
                  <img alt="" id="background" src={backgroundUri} />
                ) : (
                  <img alt="" id="background" src={backgroundUri} crossOrigin="anonymous" />
                )
              }
            </a-assets>
            <Entity primitive="a-sky" radius="30" src="#background" /> */}


            <a-assets>
              <img alt="" id="hsIcon" src="/vr_details_hotspot.png" />
              <img alt="" id="hsIconExit" src="/vr_close.png" />
              {/* <vrClose id="hsIconExit" /> */}
            </a-assets>

            { showVrProductInfo ? (
              <Entity id="rstHotspot2" class="clickable sceneHotspotIcon" position="3 3 -1" look-at="#camera" geometry="primitive: circle" material="src: #hsIconExit; shader: flat; side: double" scale="0.25 0.25 0.25" rotation="0 100 0" visible="">
                <Entity
                  id="rstHotspotBtn2"
                  geometry=""
                  scale="2 2 2"
                  material="opacity: 0; transparent: true; depthTest: false"
                  events={{
                    click: this.handleMoreInfoClicked,
                  }}
                />
                <Entity geometry="primitive: plane" material="shader: html; target: #boxHTML" position="-5.5 -5.5 -1" rotation="" scale="12 12 12" visible="" look-at="#camera" />
              </Entity>
            ) : (
              <Entity id="rstHotspot1" class="clickable sceneHotspotIcon" position="1.3 1.3 -3" look-at="#camera" geometry="primitive: circle" material="src: #hsIcon; shader: flat; side: double" scale="0.25 0.25 0.25" rotation="0 100 0" visible="">
                <Entity
                  id="rstHotspotBtn1"
                  geometry=""
                  scale="4 4 4"
                  material="opacity: 0; transparent: true; depthTest: false"
                  events={{
                    click: this.handleMoreInfoClicked,
                  }}
                />
              </Entity>
            )
            }

            <Entity
              gltf-model="https://referenceexp.s3.amazonaws.com/vr/meshes/scene.glb"
              modify-materials
              scale="1 1 1"
              position="0 1 -3"
              cursor-listener
              animation__rotate={{
                property: 'rotation', dur: 20500, loop: true, to: '0 720',
              }}
            />

            {isMobile ? (
              <Entity id="camera" primitive="a-camera">
                <Entity
                  primitive="a-cursor"
                  animation__click={{
                    property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150,
                  }}
                />
              </Entity>
            ) : (
              <Entity id="camera" primitive="a-camera" cursor="rayOrigin: mouse" />
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
