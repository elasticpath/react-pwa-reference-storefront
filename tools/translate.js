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

const fs = require('fs');
const path = require('path');

const enStr = fs.readFileSync(path.join(__dirname, './../src/localization/en-CA.json'), 'utf8');
const enMessages = JSON.parse(enStr, null, 2);
const frMessages = Object.keys(enMessages)
  .reduce((collection, messageName) => ({
    ...collection,
    [messageName]: enMessages[messageName].split('').join('-'),
  }), {});

const frStr = JSON.stringify(frMessages, null, 2);
fs.writeFileSync(path.join(__dirname, './../src/localization/fr-FR.json'), `${frStr}\n`, 'utf8');
