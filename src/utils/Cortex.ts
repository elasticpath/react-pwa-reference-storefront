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

import intl from 'react-intl-universal';
import * as UserPrefs from './UserPrefs';
import mockFetch from './Mock';
import { ErrorInlet } from '../components/src/utils/MessageContext';

import * as Config from '../ep.config.json';

export function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, ms);
    promise.then(resolve, reject);
  });
}

export function cortexFetch(input, init): any {
  const requestInit = init;

  if (requestInit && requestInit.headers) {
    requestInit.headers['x-ep-user-traits'] = `LOCALE=${UserPrefs.getSelectedLocaleValue()}, CURRENCY=${UserPrefs.getSelectedCurrencyValue()}`;
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserId`) && localStorage.getItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`)) {
      requestInit.headers['x-ep-user-id'] = localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserId`);
      requestInit.headers['x-ep-impersonation-token'] = localStorage.getItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`);
      requestInit.headers['x-ep-user-roles'] = localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`);
      requestInit.headers['x-ep-user-scopes'] = localStorage.getItem(`${Config.cortexApi.scope}_oAuthScope`);
    }
  }

  if (Config.enableOfflineMode) {
    return mockFetch(input);
  }

  let queryFormat = '';
  if (input && (Config.formatQueryParameter.standardlinks || Config.formatQueryParameter.noself || Config.formatQueryParameter.nodatalinks)) {
    const queryCharacter = input.includes('?') ? '&' : '?';
    const standardlinks = Config.formatQueryParameter.standardlinks ? 'standardlinks,' : '';
    const noself = Config.formatQueryParameter.noself ? 'zoom.noself,' : '';
    const nodatalinks = Config.formatQueryParameter.nodatalinks ? 'zoom.nodatalinks' : '';
    queryFormat = `${queryCharacter}format=${standardlinks}${noself}${nodatalinks}`;
  }

  return timeout((<any>Config).cortexApi.reqTimeout || 30000, fetch(`${Config.cortexApi.path}${input}${queryFormat}`, requestInit)
    .then((res) => {
      res.clone().json().then((json) => {
        function getErrorMessages(data) {
          let messages = [];
          if (data.messages && data.messages.length) {
            const messageData = {
              debugMessages: '',
              type: '',
              id: '',
            };

            let debugMessages = '';
            let debugMessageKey = '';
            for (let i = 0; i < data.messages.length; i++) {
              const message = data.messages[i].data;
              const messageId = data.messages[i].id;

              if (messageId === 'field.invalid.minimum.value') {
                debugMessageKey = message['invalid-value'] ? messageId : `${messageId}-msg-2`;
              } else if (messageId === 'item.insufficient.inventory') {
                debugMessageKey = message['quantity-requested'] ? `${messageId}-msg-2` : messageId;
              } else if (messageId === 'item.not.available') {
                debugMessageKey = message['field-value'] ? `${messageId}-msg-2` : messageId;
              } else if (messageId === 'item.not.in.store.catalog') {
                debugMessageKey = message['field-value'] ? `${messageId}-msg-2` : messageId;
              } else debugMessageKey = messageId;
              const msg = intl.get(debugMessageKey, message);
              debugMessages = debugMessages.concat(`${msg || data.messages[i]['debug-message']} \n `);
            }
            if (debugMessages) {
              messageData.debugMessages = debugMessages;
              messageData.type = data.messages[0].type;
              messageData.id = data.messages[0].id;
              if (messageData.id !== 'cart.is.not.empty') {
                messages.push(messageData);
              }
            }
          }
          const dataKeys = Object.keys(data).filter(key => key[0] === '_');
          dataKeys.forEach((key) => {
            if (Array.isArray(data[key])) {
              data[key].forEach((el) => {
                const res1 = getErrorMessages(el);
                messages = messages.concat(res1);
              });
            }
          });
          return messages;
        }

        const errorMessages = getErrorMessages(json);
        if (errorMessages.length > 0) {
          ErrorInlet(errorMessages[0]);
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
      if ((res.status === 401 || res.status === 403) && input !== '/oauth2/tokens') {
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);
        localStorage.removeItem(`${Config.cortexApi.scope}_b2bCart`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`);
        localStorage.removeItem(`${Config.cortexApi.scope}_openIdcSessionState`);
        localStorage.removeItem(`${Config.cortexApi.scope}_openIdcCode`);
        localStorage.removeItem(`${Config.cortexApi.scope}_keycloakSessionState`);
        localStorage.removeItem(`${Config.cortexApi.scope}_keycloakCode`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserId`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`);
        window.location.pathname = '/';
        window.location.reload();
      }
      if (res.status >= 500) {
        if (window.location.href.indexOf('/maintenance') === -1) {
          window.location.pathname = '/maintenance';
        }
      }
      return res;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }))
    .catch(() => {
      if (window.location.href.indexOf('/maintenance') === -1) {
        window.location.pathname = '/maintenance';
      }
      return new Response(new Blob(), {});
    });
}

export function adminFetch(input, init): any {
  const requestInit = init;

  if (requestInit && requestInit.headers) {
    requestInit.headers['x-ep-user-traits'] = `LOCALE=${UserPrefs.getSelectedLocaleValue()}, CURRENCY=${UserPrefs.getSelectedCurrencyValue()}`;
  }

  if (Config.enableOfflineMode) {
    return mockFetch(input);
  }

  return timeout((<any>Config).b2b.authServiceAPI.reqTimeout || 30000, fetch(`${Config.b2b.authServiceAPI.path + input}`, requestInit)
    .then((res) => {
      if ((res.status === 401 || res.status === 403) && input !== '/oauth2/tokens') {
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);
        localStorage.removeItem(`${Config.cortexApi.scope}_b2bCart`);
        localStorage.removeItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`);
        localStorage.removeItem(`${Config.cortexApi.scope}_openIdcSessionState`);
        localStorage.removeItem(`${Config.cortexApi.scope}_openIdcCode`);
        localStorage.removeItem(`${Config.cortexApi.scope}_keycloakSessionState`);
        localStorage.removeItem(`${Config.cortexApi.scope}_keycloakCode`);
        window.location.pathname = '/';
      }
      if (res.status >= 500) {
        if (window.location.href.indexOf('/maintenance') === -1) {
          window.location.pathname = '/maintenance';
        }
      }
      return res;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }))
    .catch(() => {
      if (window.location.href.indexOf('/maintenance') === -1) {
        window.location.pathname = '/maintenance';
      }
      return new Response(new Blob(), {});
    });
}
