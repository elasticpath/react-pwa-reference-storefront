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

import * as UserPrefs from './UserPrefs';
import mockFetch from './Mock';
import { getConfig } from './ConfigProvider';

export function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, ms);
    promise.then(resolve, reject);
  });
}

export function cortexFetch(input, init) {
  const Config = getConfig().config;
  const requestInit = init;

  if (requestInit && requestInit.headers) {
    requestInit.headers['x-ep-user-traits'] = `LOCALE=${UserPrefs.getSelectedLocaleValue()}, CURRENCY=${UserPrefs.getSelectedCurrencyValue()}`;
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserId`) && localStorage.getItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`)) {
      requestInit.headers['x-ep-user-id'] = localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserId`);
      requestInit.headers['x-ep-impersonation-token'] = localStorage.getItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`);
      requestInit.headers['x-ep-user-roles'] = localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`);
      requestInit.headers['x-ep-user-scopes'] = localStorage.getItem(`${Config.cortexApi.scope}_oAuthScope`);
    }
  }

  if (Config.enableOfflineMode) {
    return mockFetch(input, requestInit);
  }

  return timeout(Config.cortexApi.reqTimeout || 30000, fetch(`${Config.cortexApi.path + input}`, requestInit)
    .then((res) => {
      if ((res.status === 401 || res.status === 403) && input != '/oauth2/tokens') {
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);
        localStorage.removeItem(`${Config.cortexApi.scope}_b2bCart`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`);
        localStorage.removeItem(`${Config.cortexApi.scope}_keycloakSessionState`);
        localStorage.removeItem(`${Config.cortexApi.scope}_keycloakCode`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserId`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`);
        window.location.pathname = '/';
        window.location.reload();
      }
      if (res.status >= 500) {
        if (window.location.href.indexOf('/maintenance') === -1) {
          window.location.pathname = '/maintenance';
        }
      }
      return res;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }))
    .catch(() => {
      if (window.location.href.indexOf('/maintenance') === -1) {
        window.location.pathname = '/maintenance';
      }
      return new Response(new Blob(), {});
    });
}

export function adminFetch(input, init) {
  const Config = getConfig().config;
  const requestInit = init;

  if (requestInit && requestInit.headers) {
    requestInit.headers['x-ep-user-traits'] = `LOCALE=${UserPrefs.getSelectedLocaleValue()}, CURRENCY=${UserPrefs.getSelectedCurrencyValue()}`;
  }

  if (Config.enableOfflineMode) {
    return mockFetch(input, requestInit);
  }

  return timeout(Config.b2b.authServiceAPI.reqTimeout || 30000, fetch(`${Config.b2b.authServiceAPI.path + input}`, requestInit)
    .then((res) => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);
        localStorage.removeItem(`${Config.cortexApi.scope}_b2bCart`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`);
        localStorage.removeItem(`${Config.cortexApi.scope}_keycloakSessionState`);
        localStorage.removeItem(`${Config.cortexApi.scope}_keycloakCode`);
        window.location.pathname = '/';
        window.location.reload();
      }
      if (res.status >= 500) {
        if (window.location.href.indexOf('/maintenance') === -1) {
          window.location.pathname = '/maintenance';
        }
      }
      return res;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }))
    .catch(() => {
      if (window.location.href.indexOf('/maintenance') === -1) {
        window.location.pathname = '/maintenance';
      }
      return new Response(new Blob(), {});
    });
}
