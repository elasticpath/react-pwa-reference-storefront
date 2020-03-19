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
import VRPanelContent from './VRPanelContent';
import { IVRComponentProps, IVRComponentState } from './VRProductDisplayItem.d';

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
    this.background = this.background.bind(this);
    this.mesh = this.mesh.bind(this);
    this.meshDetails = this.meshDetails.bind(this);
    this.camera = this.camera.bind(this);
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

  mesh() {
    const { meshUri } = this.props;
    if (meshUri) {
      return (
        <Entity
          gltf-model={meshUri}
          modify-materials
          scale="1 1 1"
          position="0 1 -3"
          cursor-listener
          animation__rotate={{
            property: 'rotation', dur: 20500, loop: true, to: '0 720',
          }}
        />);
    }

    return null;
  }

  meshDetails() {
    const { meshUri } = this.props;
    const { showVrProductInfo } = this.state;

    const renderReturn = [
      <a-assets>
        <img alt="" id="hsIcon" src="/vr_details_hotspot.svg" />
        <img alt="" id="hsIconExit" src="/vr_close.svg" />
      </a-assets>,
    ];

    if (meshUri) {
      if (showVrProductInfo) {
        renderReturn.push(
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
          </Entity>,
        );
      } else {
        renderReturn.push(
          <a-assets>
            <img alt="" id="hsIcon" src="/vr_details_hotspot.png" />
            <img alt="" id="hsIconExit" src="/vr_close.png" />
          </a-assets>,
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
          </Entity>,
        );
      }
      return renderReturn;
    }
    return null;
  }

  background() {
    const { backgroundUri } = this.props;
    if (backgroundUri) {
      return [
        <a-assets>
          {
          VRProductDisplayItem.isSafari() ? (
            <img alt="" id="background" src={backgroundUri} />
          ) : (
            <img alt="" id="background" src={backgroundUri} crossOrigin="anonymous" />
          )
        }
        </a-assets>,
        <Entity primitive="a-sky" radius="30" src="#background" />,
      ];
    }

    return null;
  }

  camera() {
    const { isMobile } = this.state;
    if (isMobile) {
      return (
        <Entity id="camera" primitive="a-camera">
          <Entity
            primitive="a-cursor"
            animation__click={{
              property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150,
            }}
          />
        </Entity>
      );
    }
    return (
      <Entity id="camera" primitive="a-camera" cursor="rayOrigin: mouse" />
    );
  }

  public render() {
    const { handleCloseVR } = this.props;
    const { showInfo } = this.state;

    return (
      <div>
        {/* VR Window */}
        <div className="vr-window-container">
          <button type="button" className="exit-btn" onClick={() => handleCloseVR()} />

          <div className="cover-html-texture" />

          <VRPanelContent />

          <Scene
            className="vr-container"
            embedded
            vr-mode-ui="enterVRButton: #myEnterVRButton;"
            background="color: grey"
            loading-screen="backgroundColor: #000000; dotsColor: white"
          >

            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a id="myEnterVRButton" href="#">
              <div role="button" tabIndex={0} className="vr-fullscreen" />
            </a>

            {this.background()}
            {this.mesh()}
            {this.meshDetails()}
            {this.camera()}
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
