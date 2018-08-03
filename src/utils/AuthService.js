/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import cortexFetch from './Cortex';

const Config = require('Config');

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

export function login() {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) === null) {
      userFormBodyString = '';
      userFormBody = [];
      const publicUserDetails = {
        username: '',
        password: '',
        grant_type: 'password',
        role: 'PUBLIC',
        scope: Config.cortexApi.scope,
      };
      generateFormBody(publicUserDetails);

      cortexFetch('/oauth2/tokens', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: userFormBodyString,
      }).then(res => res.json())
        .then((res) => {
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, res.role);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, res.scope);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${res.access_token}`);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, publicUserDetails.username);
          resolve(res);
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
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);
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
