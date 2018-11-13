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

import cortexFetch from './Cortex';

const Config = require('Config');

let newaccountform = '';

function generateFormBody(userDetails) {
  return Object.keys(userDetails)
    .map(key => `${key}=${userDetails[key]}`)
    .join('&');
}

export function login() {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) === null) {

      cortexFetch('/oauth2/tokens', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: generateFormBody({
          username: '',
          password: '',
          grant_type: 'password',
          role: 'PUBLIC',
          scope: Config.cortexApi.scope,
        }),
      }).then((res) => {
        if (res.status === 504 || res.status === 503) {
          reject(res);
        }
        return res;
      }).then(res => res.json())
        .then((res) => {
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, res.role);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, res.scope);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${res.access_token}`);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, '');
          resolve(res);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          reject(error);
        });
    } else {
      resolve();
    }
  }));
}

export function login2() {
  if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`)) {
    return Promise.resolve(200);
  }

  return cortexFetch('/oauth2/tokens', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: generateFormBody({
      grant_type: 'password',
      role: 'PUBLIC',
      scope: Config.cortexApi.scope,
    }),
  })
    .then((res) => {
      if (res.status === 504 || res.status === 503) {
        throw new Error();
      }
      return res;
    })
    .then(res => res.json())
    .then((body) => {
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, body.role);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, body.scope);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${body.access_token}`);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, '');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      throw error;
    });
}

export function loginRegistered(username, password) {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) != null) {
      cortexFetch('/oauth2/tokens', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: generateFormBody({
          username,
          password,
          grant_type: 'password',
          role: 'REGISTERED',
          scope: Config.cortexApi.scope,
        }),
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
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, username);
        resolve(200);
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        reject(error);
      });
    } else {
      resolve(200);
    }
  }));
}

export function loginRegistered2(username, password) {
  return cortexFetch('/oauth2/tokens', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: generateFormBody({
      username,
      password,
      grant_type: 'password',
      role: 'REGISTERED',
      scope: Config.cortexApi.scope,
    }),
  })
    .then(res => Promise.all([res, res.status === 200 ? res.json() : {}]))
    .then(([res, body]) => {
      if (res.status === 200) {
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, body.role);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, body.scope);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${body.access_token}`);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, username);
      }

      return res.status;
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      throw error;
    });
}

// export function login() {
//   if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`)) {
//     return Promise.resolve(200);
//   }

//   return loginRegistered('', '');
// }

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

export function logout2() {
  localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
  localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
  localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
  localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);

  return Promise.resolve();
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
