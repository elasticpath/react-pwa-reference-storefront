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

import bloomreachFetch from './Bloomreach';
import { searchLookup } from './CortexLookup';

import { getConfig } from './ConfigProvider';

function generateBaseBloomreachUrl(baseUri = getConfig().config.bloomreachSearch.config.baseUri) {
  const {
    accountId,
    authKey,
    domainKey,
    requestId,
    brUID2,
    url,
    refurl,
  } = getConfig().config.bloomreachSearch.config;
  return `${baseUri}${accountId}&${authKey}&${domainKey}&${requestId}&${brUID2}&${url}&${refurl}`;
}

// eslint-disable-next-line import/prefer-default-export
export function bloomreachSuggestionSearch<T>(keyword): Promise<T> {
  const {
    baseUri,
    requestType,
  } = getConfig().config.bloomreachSearch.config.suggestionConfig;

  const baseUrl = generateBaseBloomreachUrl(baseUri);
  const q = `q=${keyword}`;
  const searchUrl = `${baseUrl}&${requestType}&${q}`;

  return new Promise(((resolve, reject) => {
    bloomreachFetch(searchUrl, {})
      .then((res) => {
        if (res.status >= 500) {
          reject(res);
        }
        return res;
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
