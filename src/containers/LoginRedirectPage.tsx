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

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { loginRegisteredAuthService } from '../utils/AuthService';
import { adminFetch } from '../utils/Cortex';

import Config from '../ep.config.json';

const oidcDiscoveryEndpoint = '/.well-known/openid-configuration';

interface LoginRedirectPageProps extends RouteComponentProps {
}

interface LoginRedirectPageState {
}

interface OidcParameters {
  clientId: string;
  scopes: string;
  authorizationEndpoint: string;
  endSessionEndpoint: string;
}

export class LoginRedirectPage extends React.Component<LoginRedirectPageProps, LoginRedirectPageState> {
  async componentDidMount() {
    const locationData = window.location.search;
    const url = locationData;
    const params = queryString.parse(url);
    if (Config.b2b.openId && Config.b2b.openId.enable && params.code && params.session_state) {
      localStorage.setItem(`${Config.cortexApi.scope}_openIdcCode`, params.code);
      localStorage.setItem(`${Config.cortexApi.scope}_openIdcSessionState`, params.session_state);
      localStorage.removeItem('OidcSecret');
    }

    const oidcParameters: OidcParameters = await LoginRedirectPage.discoverOIDCParameters();
    const redirectUri = encodeURIComponent(((Config.b2b.openId && Config.b2b.openId.enable) ? `${window.location.origin}/loggedin` : Config.b2b.keycloak.callbackUrl));
    const clientId = encodeURIComponent(((Config.b2b.openId && Config.b2b.openId.enable) ? oidcParameters.clientId : Config.b2b.keycloak.client_id));

    loginRegisteredAuthService(params.code, redirectUri, clientId).then(() => {
      window.location.href = '/';
    });
  }

  static async discoverOIDCParameters() {
    const data = await adminFetch(oidcDiscoveryEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
      },
    });
    const res = await data.json();
    return {
      clientId: res.account_management_client_id,
      scopes: res.account_management_required_scopes,
      authorizationEndpoint: res.authorization_endpoint,
      endSessionEndpoint: res.end_session_endpoint,
    };
  }

  render() {
    return (
      <div className="loader" />
    );
  }
}

export default LoginRedirectPage;
