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
