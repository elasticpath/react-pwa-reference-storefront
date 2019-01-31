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
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import intl from 'react-intl-universal';

import './socialnetworkslogin.main.less';

class SocialNetworksLogin extends React.Component {
  static propTypes = {
    config: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  // eslint-disable-next-line class-methods-use-this
  onSuccess(res) {
    // eslint-disable-next-line no-console
    console.log(res);
  }

  render() {
    const { config } = this.props;
    return (
      <div className="social-networks-login">
        {config && config.fbApplicationId && (
          <FacebookLogin
            appId={config.fbApplicationId}
            autoLoad={false}
            fields="name,email,picture"
            callback={this.onSuccess}
            render={renderProps => (
              <button type="button" className="ep-btn primary wide fb-login-btn" onClick={renderProps.onClick}>{intl.get('fb-login-btn')}</button>
            )}
          />
        )}
        {config && config.googleClientId && (
          <GoogleLogin
            clientId={config.googleClientId}
            buttonText="Login"
            onSuccess={this.onSuccess}
            render={renderProps => (
              <button type="button" className="ep-btn primary wide google-login-btn" onClick={renderProps.onClick}>{intl.get('google-login-btn')}</button>
            )}
          />
        )}
      </div>
    );
  }
}

export default SocialNetworksLogin;
