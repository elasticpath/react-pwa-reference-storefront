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

import * as cortex from '@elasticpath/cortex-client/dist';
import { getConfig } from './ConfigProvider';

// eslint-disable-next-line
export async function userLogin(client: cortex.IClient, username, password) {
  const Config = getConfig().config;
  if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) != null) {
    const result = await client.serverFetch('/oauth2/tokens', {
      method: 'post',
      useAuth: false,
      urlEncoded: true,
      body: {
        username,
        password,
        grant_type: 'password',
        role: 'REGISTERED',
        scope: Config.cortexApi.scope,
      },
    });
    localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${result.parsedJson.access_token}`);
    localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, result.parsedJson.role);
    return result;
  }
  return null;
}
