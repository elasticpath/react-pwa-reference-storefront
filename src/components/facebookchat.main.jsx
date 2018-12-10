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
/* eslint-disable */
import * as styles from '!!../utils/less-var-loader!../style/common.less';
/* eslint-enable */
import scriptjs from 'scriptjs';

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
    pageId: PropTypes.string.isRequired,
    applicationId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { pageId, applicationId } = this.props;
    if (pageId && applicationId) {
      this.setFbAsync();
      FacebookChat.loadSDKAsynchronously();
    }
  }

  setFbAsync() {
    const { applicationId } = this.props;
    /* eslint-disable */
    window.fbAsyncInit = function () {
      FB.init({
        appId: applicationId,
        status: true,
        xfbml: true,
        version: 'v2.10',
      });
    };
    /* eslint-enable */
  }

  render() {
    const { pageId, applicationId } = this.props;
    if (pageId && applicationId) {
      return (
        <div>
          <div id="fb-root" />
          <div
            className="fb-customerchat"
            page_id={pageId}
            theme_color={styles['@mainColor']}
          />
        </div>
      );
    }
    return ('');
  }
}

export default FacebookChat;
