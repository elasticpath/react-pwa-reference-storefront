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
import scriptjs from 'scriptjs';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax,import/no-unresolved
import * as styles from '!!../utils/less-var-loader!../../../theme/common.less';

interface FacebookChatProps {
  /** config */
  config: {
    [key: string]: any
  },
  /** handle Fb Async Init */
  handleFbAsyncInit?: (...args: any[]) => any
}

class FacebookChat extends Component<FacebookChatProps, {}> {
  static loadSDKAsynchronously() {
    scriptjs('https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js', () => {
      // eslint-disable-next-line (unaccepted unnamed function)
      (function loadSdk(d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js: any = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    });
  }

  static defaultProps = {
    handleFbAsyncInit: () => {},
  };

  componentDidMount() {
    const { config } = this.props;
    if (config.enable) {
      this.setFbAsync();
      FacebookChat.loadSDKAsynchronously();
    }
  }

  setFbAsync() {
    const { handleFbAsyncInit } = this.props;
    handleFbAsyncInit();
  }

  getFbDiv() {
    const { config } = this.props;
    const props = {
      page_id: config.pageId,
      theme_color: styles['@mainColor'],
    };
    return (<div className="fb-customerchat" {...props} />);
  }

  render() {
    const { config } = this.props;
    return (
      <div>
        <div id="fb-root" />
        {this.getFbDiv()}
      </div>
    );
  }
}

export default FacebookChat;
