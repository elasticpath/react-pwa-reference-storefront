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

function createNetworkMonitor(page, delay) {
  let counter = 0;
  let isClear = true;
  let timer = null;

  function timeout() {
    timer = null;
    isClear = true;
    page.emit('clear');
  }

  page.on('request', (e) => {
    counter += 1;
    isClear = false;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  });

  page.on('requestfinished', (e) => {
    counter -= 1;

    if (counter === 0) {
      timer = setTimeout(timeout, delay);
    }
  });

  return {
    waitForIdle: async function() {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (isClear) {
            resolve();
          } else {
            page.on('clear', () => resolve());
          }
        }, delay);
      });
    }
  };
}

module.exports = {
  createNetworkMonitor: createNetworkMonitor
};
