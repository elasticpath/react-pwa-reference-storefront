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

const fs = require('fs');
const path = require('path');

function translate (enStr) {
  const enMessages = JSON.parse(enStr, null, 2);
  const frMessages = Object.keys(enMessages)
    .reduce((collection, messageName) => {
      const msg = enMessages[messageName]
        .split(/(\{[\S]+\})/)
        .reduce((a,b)=>{
          if (b[0] !== '{') {
            b = b.split('').join('-')
          }
          return a + b;
        }, '');
      return {
        ...collection,
        [messageName]: msg,
      }
    }, {});

  return JSON.stringify(frMessages, null, 2);
}
const enStr = fs.readFileSync(path.join(__dirname, './../src/localization/en-CA.json'), 'utf8');
const enDebugStr = fs.readFileSync(path.join(__dirname, './../src/localization/messages-en-CA.json'), 'utf8');

fs.writeFileSync(path.join(__dirname, './../src/localization/fr-FR.json'), `${translate(enStr)}\n`, 'utf8');
fs.writeFileSync(path.join(__dirname, './../src/localization/messages-fr-FR.json'), `${translate(enDebugStr)}\n`, 'utf8');
