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

// @ts-check

import Cookies from 'js-cookie';
import { cortexFetch } from './Cortex';
import Config from '../../../ep.config.json';

let userFormBody = [];
let userFormBodyString = '';
let newaccountform = '';

function generateFormBody(userDetails) {
  Object.keys(userDetails).forEach((encodedKey) => {
    const encodedValue = userDetails[encodedKey];
    userFormBody.push(`${encodedKey}=${encodedValue}`);
  });
  userFormBodyString = userFormBody.join('&');
}

export function loginRegistered(username, password) {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) != null) {
      userFormBodyString = '';
      userFormBody = [];
      const registeredUserDetails = {
        username,
        password,
        grant_type: 'password',
        role: 'REGISTERED',
        scope: Config.cortexApi.scope,
      };

      generateFormBody(registeredUserDetails);

      cortexFetch('/oauth2/tokens', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: userFormBodyString,
      }).then((res) => {
        if (res.status === 401) {
          resolve(401);
        }
        if (res.status === 400) {
          resolve(400);
        } else if (res.status === 200) {
          return res.json();
        }
        return null;
      }).then((res) => {
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, res.role);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, res.scope);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${res.access_token}`);
        window.dispatchEvent(new CustomEvent('authHeaderChanged', { detail: { authHeader: `Bearer ${res.access_token}`, file: 'AuthService.2' } }));
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, registeredUserDetails.username);
        resolve(200);
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        reject(error);
      });
    } else {
      resolve(userFormBodyString);
    }
  }));
}

export function logout() {
  return new Promise(((resolve, reject) => {
    cortexFetch('/oauth2/tokens', {
      method: 'delete',
    }).then((res) => {
      Cookies.remove('Authorization');
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
      window.dispatchEvent(new CustomEvent('authHeaderChanged', { detail: { authHeader: null, file: 'AuthService.3' } }));
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);
      localStorage.removeItem(`${Config.cortexApi.scope}_b2bCart`);
      localStorage.removeItem(`${Config.cortexApi.scope}_b2bSharedId`);
      localStorage.removeItem(`${Config.cortexApi.scope}_cartItemsCount`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserId`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`);
      resolve(res);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      reject(error);
    });
  }));
}

export function getRegistrationForm() {
  return new Promise(((resolve, reject) => {
    cortexFetch('/?zoom=newaccountform',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
      .then(res => res.json())
      .then((res) => {
        const registrationLink = res.links.find(link => link.rel === 'newaccountform');
        newaccountform = registrationLink.uri;
        resolve(registrationLink.uri);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        reject(error);
      });
  }));
}

export function registerUser(lastname, firstname, username, password) {
  return new Promise(((resolve, reject) => {
    cortexFetch(newaccountform, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        'family-name': lastname, 'given-name': firstname, username, password,
      }),
    }).then((res) => {
      resolve(res);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      reject(error);
    });
  }));
}

export function getAccessToken(token) {
  return new Promise(((resolve, reject) => {
    cortexFetch(`/impersonation/${Config.cortexApi.scope}/form?followlocation`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        'impersonation-token': token,
      }),
    })
      .then(res => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        reject(error);
      });
  }));
}

export function isLoggedIn(config) {
  return (localStorage.getItem(`${config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
}
