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

interface IVRComponentState {
  color: any;
}

interface IVRComponentProps {
  backgroundUri?: any,
}

class VRProductDisplayItem extends Component<IVRComponentProps, IVRComponentState> {
  constructor(props) {
    super(props);
    this.state = { color: 'red' };
  }

  public changeColor() {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  public render() {
    const { backgroundUri } = this.props;
    const { color } = this.state;

    return (
      <Scene className="vr-container" embedded>
        <a-assets>
          <img alt="" id="luxuryCar" src={backgroundUri} />
        </a-assets>
        {/* <Entity primitive="a-sky" height="960" radius="30" src="#luxuryCar" width="1920" /> */}
        <Entity primitive="a-sky" radius="30" src="#luxuryCar" />
      </Scene>
    );
  }
}

export default VRProductDisplayItem;
