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

import { useLocalStorage } from '@rehooks/local-storage';
import Config from '../ep.config.json';

export function useAuth() {
  const [localOAuthUserName] = useLocalStorage(`${Config.cortexApi.scope}_oAuthUserName`, null);
  const [localOAuthUserId] = useLocalStorage(`${Config.cortexApi.scope}_oAuthUserId`, null);
  const userName = localOAuthUserName || localOAuthUserId;
  const [impersonating] = useLocalStorage(`${Config.cortexApi.scope}_oAuthImpersonationToken`, null);
  const [role] = useLocalStorage(`${Config.cortexApi.scope}_oAuthRole`);
  const isLoggedIn = role === 'REGISTERED';

  return {
    userName,
    impersonating,
    role,
    isLoggedIn,
  };
}

export const anotherExport = 123;
