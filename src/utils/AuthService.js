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

var Config = require('Config')

var user_formBody = [];
var user_formBody_string = '';

function generateFormBody(user_details) {
    for (var property in user_details) {
        var encodedKey = property;
        var encodedValue = user_details[property];
        user_formBody.push(encodedKey + "=" + encodedValue);
    }
    user_formBody_string = user_formBody.join("&");
}

export function login() {
    return new Promise(function (resolve, reject) {
        if (localStorage.getItem(Config.cortexApi.scope + '_oAuthToken') === null) {
            user_formBody_string = '';
            user_formBody = [];
            var public_user_details = {
                'username': '',
                'password': '',
                'grant_type': 'password',
                'role': 'PUBLIC',
                'scope': Config.cortexApi.scope
            };
            generateFormBody(public_user_details);

            fetch(Config.cortexApi.path + '/oauth2/tokens', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                body: user_formBody_string
            }).then(res => res.json())
                .then(res => {
                    localStorage.setItem(Config.cortexApi.scope + '_oAuthRole', res.role);
                    localStorage.setItem(Config.cortexApi.scope + '_oAuthScope', res.scope);
                    localStorage.setItem(Config.cortexApi.scope + '_oAuthToken', 'Bearer ' + res.access_token);
                    localStorage.setItem(Config.cortexApi.scope + '_oAuthUserName', public_user_details['username']);
                    resolve(res);
                })
                .catch(error => {
                    console.log(error)
                    reject(error);
                });
        }
        else {
            resolve(user_formBody_string);
        }
    });
}

export function loginRegistered(username, password) {
    return new Promise(function (resolve, reject) {
        if (localStorage.getItem(Config.cortexApi.scope + '_oAuthToken') != null) {
            user_formBody_string = '';
            user_formBody = [];
            var registered_user_details = {
                'username': username,
                'password': password,
                'grant_type': 'password',
                'role': 'REGISTERED',
                'scope': Config.cortexApi.scope
            };

            generateFormBody(registered_user_details);

            fetch(Config.cortexApi.path + '/oauth2/tokens', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                },
                body: user_formBody_string
            }).then(res => res.json())
                .then(res => {
                    localStorage.setItem(Config.cortexApi.scope + '_oAuthRole', res.role);
                    localStorage.setItem(Config.cortexApi.scope + '_oAuthScope', res.scope);
                    localStorage.setItem(Config.cortexApi.scope + '_oAuthToken', 'Bearer ' + res.access_token);
                    localStorage.setItem(Config.cortexApi.scope + '_oAuthUserName', registered_user_details['username']);
                    resolve(res);
                })
                .catch(error => {
                    console.log(error)
                    reject(error);
                });
        }
        else {
            resolve(user_formBody_string);
        }

    });
}

export function logout() {
    return new Promise(function (resolve, reject) {
        fetch(Config.cortexApi.path + '/oauth2/tokens', {
            method: 'delete'
        }).then(res => {
            localStorage.removeItem(Config.cortexApi.scope + '_oAuthRole');
            localStorage.removeItem(Config.cortexApi.scope + '_oAuthScope');
            localStorage.removeItem(Config.cortexApi.scope + '_oAuthToken');
            localStorage.removeItem(Config.cortexApi.scope + '_oAuthUserName');
            resolve(res);
        })
            .catch(error => {
                console.log(error)
                reject(error);
            });
    });
}