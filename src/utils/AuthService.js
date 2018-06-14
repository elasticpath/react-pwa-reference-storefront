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

var details = {
    'userName': 'Anonymous',
    'password': '',
    'grant_type': 'password',
    'role': 'PUBLIC',
    'scope': Config.cortexApi.scope
};

var formBody = [];
for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");

export function login() {
    fetch(Config.cortexApi.path + '/oauth2/tokens', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    }).then(res => res.json())
        .then(res => {
            console.log(res);
            localStorage.setItem(Config.cortexApi.scope + '_oAuthRole', res.role);
            localStorage.setItem(Config.cortexApi.scope + '_oAuthScope', res.scope);
            localStorage.setItem(Config.cortexApi.scope + '_oAuthToken', 'Bearer ' + res.access_token);
            localStorage.setItem(Config.cortexApi.scope + '_oAuthUserName', details['userName']);
        })
        .catch(error => {
            console.log(error)
        });
}