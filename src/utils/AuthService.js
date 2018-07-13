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

const Config = require('Config');

let user_formBody = [];
let user_formBody_string = '';

function generateFormBody(user_details) {
  for (const property in user_details) {
    const encodedKey = property;
    const encodedValue = user_details[property];
    user_formBody.push(`${encodedKey}=${encodedValue}`);
  }
  user_formBody_string = user_formBody.join('&');
}

export function login() {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) === null) {
      user_formBody_string = '';
      user_formBody = [];
      const public_user_details = {
        username: '',
        password: '',
        grant_type: 'password',
        role: 'PUBLIC',
        scope: Config.cortexApi.scope,
      };
      generateFormBody(public_user_details);

      fetch(`${Config.cortexApi.path}/oauth2/tokens`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: user_formBody_string,
      }).then(res => res.json())
        .then((res) => {
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, res.role);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, res.scope);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${res.access_token}`);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, public_user_details.username);
          resolve(res);
        }).catch((error) => {
          console.log(error);
          reject(error);
        });
    } else {
      resolve(user_formBody_string);
    }
  }));
}

export function loginRegistered(username, password) {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) != null) {
      user_formBody_string = '';
      user_formBody = [];
      const registered_user_details = {
        username,
        password,
        grant_type: 'password',
        role: 'REGISTERED',
        scope: Config.cortexApi.scope,
      };

      generateFormBody(registered_user_details);

      fetch(`${Config.cortexApi.path}/oauth2/tokens`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: user_formBody_string,
      }).then((res) => {
        if (res.status === 401) {
          resolve(401);
        }
        if (res.status === 400) {
          resolve(400);
        } else if (res.status === 200) {
          return res.json();
        }
      }).then((res) => {
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, res.role);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, res.scope);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${res.access_token}`);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, registered_user_details.username);
        resolve(200);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    } else {
      resolve(user_formBody_string);
    }
  }));
}

export function logout() {
  return new Promise(((resolve, reject) => {
    fetch(`${Config.cortexApi.path}/oauth2/tokens`, {
      method: 'delete',
    }).then((res) => {
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);
      resolve(res);
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  }));
}

export function getRegistrationForm() {
  return new Promise(((resolve, reject) => {
    fetch(`${Config.cortexApi.path}/registrations/${Config.cortexApi.scope}/newaccount/form`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
      .then(res => res.json())
      .then((res) => {
        resolve(res.self.href);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  }));
}

export function registerUser(lastname, firstname, username, password) {
  return new Promise(((resolve, reject) => {
    fetch(`${Config.cortexApi.path}/registrations/${Config.cortexApi.scope}/newaccount/form`, {
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
      console.log(error);
      reject(error);
    });
  }));
}
