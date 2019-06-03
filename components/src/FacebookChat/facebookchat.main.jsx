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
import PropTypes from 'prop-types';
import scriptjs from 'scriptjs';
// eslint-disable-next-line
import * as styles from '!!../utils/less-var-loader!../style/common.less';

class FacebookChat extends React.Component {
  static loadSDKAsynchronously() {
    scriptjs('https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js', () => {
      // eslint-disable-next-line (unaccepted unnamed function)
      (function loadSdk(d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    });
  }

  static propTypes = {
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    handleFbAsyncInit: PropTypes.func,
  };

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

  render() {
    const { config } = this.props;
    return (
      <div>
        <div id="fb-root" />
        <div
          className="fb-customerchat"
          page_id={config.pageId}
          theme_color={styles['@mainColor']}
        />
      </div>
    );
  }
}

export default FacebookChat;
