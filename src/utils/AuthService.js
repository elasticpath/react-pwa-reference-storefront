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

import cortexFetch from './Cortex';

const Config = require('Config');

function generateFormBody(userDetails) {
  return Object.keys(userDetails)
    .map(key => `${key}=${userDetails[key]}`)
    .join('&');
}

export function login() {
  if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`)) {
    return Promise.resolve(200);
  }

  return cortexFetch('/oauth2/tokens', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: generateFormBody({
      grant_type: 'password',
      role: 'PUBLIC',
      scope: Config.cortexApi.scope,
    }),
  })
    .then((res) => {
      if (res.status === 504 || res.status === 503) {
        throw new Error();
      }
      return res;
    })
    .then(res => res.json())
    .then((body) => {
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, body.role);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, body.scope);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${body.access_token}`);
      localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, '');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      throw error;
    });
}

export function loginRegistered(username, password) {
  return cortexFetch('/oauth2/tokens', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
    },
    body: generateFormBody({
      username,
      password,
      grant_type: 'password',
      role: 'REGISTERED',
      scope: Config.cortexApi.scope,
    }),
  })
    .then(res => Promise.all([res, res.status === 200 ? res.json() : {}]))
    .then(([res, body]) => {
      if (res.status === 200) {
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, body.role);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, body.scope);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${body.access_token}`);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, username);
      }
      return res.status;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      throw error;
    });
}

export function logout() {
  localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
  localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
  localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
  localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);

  return Promise.resolve();
}

export function registerUser(lastname, firstname, username, password) {
  return cortexFetch('/?zoom=newaccountform', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
    },
  })
    .then(res => res.json())
    .then(body => body.links.find(link => link.rel === 'newaccountform').uri)
    .then(uri => cortexFetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        'family-name': lastname,
        'given-name': firstname,
        username,
        password,
      }),
    }))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      throw error;
    });
}

export function submitPromotionCode(promotionCode) {
  return login()
    .then(() => cortexFetch('/?zoom=defaultcart:order:couponinfo:couponform', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json())
    .then(body => body
      ._defaultcart[0]
      ._order[0]
      ._couponinfo[0]
      ._couponform[0]
      .links
      .find(link => link.rel === 'applycouponaction')
      .uri)
    .then(couponFormLink => cortexFetch(couponFormLink, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        code: promotionCode,
      }),
    }));
}

export function fetchGeoData() {
  const zoomArray = [
    'element',
    'element:regions',
    'element:regions:element',
    'countries:element',
    'countries:element:regions',
    'countries:element:regions:element',
  ];

  return login()
    // 7.4 Will expose the countries API at the root. In versions earlier than 7.4 we have to invoke geographies ourselves.
    .then(() => cortexFetch(`/geographies/${Config.cortexApi.scope}/countries/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json());
}

export function fetchAddressData(addressLink) {
  return login()
    .then(() => cortexFetch(addressLink, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json());
}

export function updateAddress(uri, firstName, lastName, address, extendedAddress, city, country, subCountry, postalCode) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        name: {
          'given-name': firstName,
          'family-name': lastName,
        },
        address: {
          'street-address': address,
          'extended-address': extendedAddress,
          locality: city,
          'country-name': country,
          region: subCountry,
          'postal-code': postalCode,
        },
      }),
    }));
}

export function createAddress(firstName, lastName, address, extendedAddress, city, country, subCountry, postalCode) {
  return login()
    .then(() => cortexFetch('/?zoom=defaultprofile:addresses:addressform', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json())
    .then(body => body._defaultprofile[0]._addresses[0]._addressform[0].links.find(link => link.rel === 'createaddressaction').uri)
    .then(uri => cortexFetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        name: {
          'given-name': firstName,
          'family-name': lastName,
        },
        address: {
          'street-address': address,
          'extended-address': extendedAddress,
          locality: city,
          'country-name': country,
          region: subCountry,
          'postal-code': postalCode,
        },
      }),
    }));
}

export function deleteAddress(uri) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }));
}
