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

import React from 'react';
import {
  StoreProvider,
  createStore,
  createTypedHooks,
  Action,
  action,
  Thunk,
  thunk,
} from 'easy-peasy';
import Cookies from 'js-cookie';
import * as UserPrefs from '../components/src/utils/UserPrefs';
import Config from '../ep.config.json';


const publicUserDetails = {
  username: '',
  password: '',
  grant_type: 'password',
  role: 'PUBLIC',
  scope: Config.cortexApi.scope,
};

const publicRequestStr = Object.keys(publicUserDetails).map(k => `${k}=${publicUserDetails[k]}`).join('&');

async function fetchAuthToken() {
  const response = await fetch(`${Config.cortexApi.path}/oauth2/tokens`, {
    method: 'post',
    body: publicRequestStr,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  const result = await response.json();

  return result;
}

interface LookupForms {
  navigation: string;
}

export interface StoreModel {
  authHeader: string | undefined;
  userTraits: string;
  networkError: Error | undefined;
  lookupForms: LookupForms | undefined;

  setAuthHeader: Action<StoreModel, string>;
  setNetworkError: Action<StoreModel, Error>;
  setLookupForms: Action<StoreModel, LookupForms>;

  fetchAuthHeader: Thunk<StoreModel>;
  init: Thunk<StoreModel>;
}

const storeModel: StoreModel = {
  authHeader: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
  userTraits: `LOCALE=${UserPrefs.getSelectedLocaleValue()}, CURRENCY=${UserPrefs.getSelectedCurrencyValue()}`,
  networkError: undefined,
  lookupForms: undefined,

  setAuthHeader: action((state, payload) => { state.authHeader = payload; }),
  setNetworkError: action((state, error: Error) => { state.networkError = error; }),
  setLookupForms: action((state, lookupForms: LookupForms) => { state.lookupForms = lookupForms; }),

  fetchAuthHeader: thunk(async (actions, _payload, { getState }) => {
    // If cookie contains token set by punch out procurement system.

    if (getState().authHeader) {
      return;
    }
    try {
      const result = await fetchAuthToken();

      // If legacy code set the token while we were fetching ours abort and use their token
      // Once legacy code is refactored, this should be removed
      if (result.token_type === 'bearer' && result.access_token) {
        const newAuthHeader = `Bearer ${result.access_token}`;
        actions.setAuthHeader(newAuthHeader);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, result.scope);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, newAuthHeader);
        window.dispatchEvent(new CustomEvent('authHeaderChanged', { detail: { authHeader: `Bearer ${result.access_token}`, file: 'AuthService.1' } }));
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, publicUserDetails.username);
      }
      if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`) === null) {
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, result.role);
      }
    } catch (err) {
      actions.setNetworkError(err);
    }
  }),
  init: thunk(async (actions, _payload, { getState }) => {
    // Condition for procurement punchout flow.  Set localStorage through Cookie.
    if (Cookies.get('Authorization')) {
      const newAuthHeader = `Bearer ${Cookies.get('Authorization')}`;
      actions.setAuthHeader(newAuthHeader);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, Config.cortexApi.scope);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, newAuthHeader);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, 'REGISTERED');
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, 'PROCUREMENT');
    } else if (!getState().authHeader) {
      await actions.fetchAuthHeader();
    }
    // Listen to the events emitted by the legacy code
    // Once legacy code is refactored, this should be removed
    window.addEventListener('authHeaderChanged', (e: CustomEvent) => {
      actions.setAuthHeader(e.detail.authHeader);
    });
  }),
};

const store = createStore(storeModel);
store.getActions().init();

export const EpStore: React.FC = props => (
  <StoreProvider store={store}>
    {props.children}
  </StoreProvider>
);

const typedHooks = createTypedHooks<StoreModel>();

export function useAuthHeader(): string | undefined {
  const authHeader = typedHooks.useStoreState(state => state.authHeader);
  return authHeader;
}

export function useUserTraits(): string {
  const userTraits = typedHooks.useStoreState(state => state.userTraits);
  return userTraits;
}

export function login(): Promise<void> {
  return new Promise((resolve) => {
    const state = store.getState();
    if (state.authHeader) resolve();
    store.subscribe(() => {
      const updatedState = store.getState();
      if (updatedState.authHeader) resolve();
    });
  });
}
