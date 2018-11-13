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

export function fetchUri(uri) {
  return login()
    .then(() => cortexFetch(uri, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json());
}

export function deleteUri(uri) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }));
}

export function postUri(uri) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }));
}

export function registerUser(lastname, firstname, username, password) {
  return login()
    .then(() => fetchUri('/?zoom=newaccountform'))
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

export function deletePromotionCode(uri) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
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

  return fetchUri(`/geographies/${Config.cortexApi.scope}/countries/?zoom=${zoomArray.join()}`);
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

export function updatePersonalInfo(firstName, lastName) {
  return login()
    .then(() => cortexFetch('/', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json())
    .then(body => cortexFetch(`${body.links.find(link => link.rel === 'defaultprofile').uri}?followlocation`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(linkRes => linkRes.json())
    .then(linkRes => cortexFetch(linkRes.self.uri, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        'given-name': firstName,
        'family-name': lastName,
      }),
    }))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      throw error;
    });
}

export function changeItemQuantity(uri, newQuantity) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        quantity: newQuantity,
      }),
    }));
}

export function moveToCart(uri) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        quantity: 1,
      }),
    }));
}

export function removeFromCart(uri) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }));
}

export function fetchOrderHistory(uri) {
  const zoomArray = [
    'total',
    'discount',
    'appliedpromotions:element',
    'lineitems:element',
    'lineitems:element:total',
    'lineitems:element:price',
    'lineitems:element:availability',
    'lineitems:element:appliedpromotions:element',
    'lineitems:element:item',
    'lineitems:element:item:code',
    'lineitems:element:item:definition',
    'lineitems:element:item:definition:options:element',
    'lineitems:element:item:definition:options:element:value',
    'lineitems:element:item:definition:options:element:selector:choice',
    'lineitems:element:item:definition:options:element:selector:chosen',
    'lineitems:element:item:definition:options:element:selector:choice:description',
    'lineitems:element:item:definition:options:element:selector:chosen:description',
    'lineitems:element:item:definition:options:element:selector:choice:selector',
    'lineitems:element:item:definition:options:element:selector:chosen:selector',
    'lineitems:element:item:definition:options:element:selector:choice:selectaction',
    'lineitems:element:item:definition:options:element:selector:chosen:selectaction',
  ];

  return fetchUri(`${uri}?zoom=${zoomArray.join()}`);
}

export function submitPayment(cardHolderName, card, cardNumber, saveToProfile) {
  const zoomArray = [
    'defaultcart:order:paymentmethodinfo:paymenttokenform',
    'defaultprofile:paymentmethods:paymenttokenform'
  ];

  return login().then(() => cortexFetch(`/?zoom=${zoomArray.join()}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
    },
  }))
    .then(res => res.json())
    .then(body => (saveToProfile
      ? body._defaultprofile[0]._paymentmethods[0]._paymenttokenform[0].links.find(link => link.rel === 'createpaymenttokenaction').uri
      : body._defaultcart[0]._order[0]._paymentmethodinfo[0]._paymenttokenform[0].links.find(link => link.rel === 'createpaymenttokenfororderaction').uri
    ))
    .then(uri => cortexFetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        'display-name': `${cardHolderName}'s ${card} ending in: ****${cardNumber.substring(cardNumber.length - 4)}`,
        token: Math.random().toString(36).substr(2, 9),
        /* token is being randomly generated here to be passed to the demo payment gateway
        ** in a true implementation this token should be received from the actual payment gateway
        ** when doing so, make sure you're compliant with PCI DSS
        */
      }),
    }));
}

export function fetchSkuDetails(uri) {
  const zoomArray = [
    'availability',
    'addtocartform',
    'addtowishlistform',
    'price',
    'rate',
    'definition',
    'definition:assets:element',
    'definition:options:element',
    'definition:options:element:value',
    'definition:options:element:selector:choice',
    'definition:options:element:selector:chosen',
    'definition:options:element:selector:choice:description',
    'definition:options:element:selector:chosen:description',
    'definition:options:element:selector:choice:selector',
    'definition:options:element:selector:chosen:selector',
    'definition:options:element:selector:choice:selectaction',
    'definition:options:element:selector:chosen:selectaction',
    'recommendations',
    'recommendations:crosssell',
    'recommendations:recommendation',
    'recommendations:replacement',
    'recommendations:upsell',
    'recommendations:warranty',
    'recommendations:crosssell:element:code',
    'recommendations:recommendation:element:code',
    'recommendations:replacement:element:code',
    'recommendations:upsell:element:code',
    'recommendations:warranty:element:code',
    'code',
  ];

  return login()
    .then(() => cortexFetch(`${uri}?followlocation&zoom=${zoomArray.sort().join()}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({}),
    }))
    .then(res => res.json());
}

export function addItemToCart(uri, itemQuantity, itemConfiguration) {
  const body = {
    quantity: itemQuantity,
  };

  if (itemConfiguration) {
    body.configuration = itemConfiguration;
  }

  return login()
    .then(() => cortexFetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify(body),
    }));
}

export function ensureItemLookupForm() {
  if (localStorage.getItem(`${Config.cortexApi.scope}_itemLookupForm`)) {
    return Promise.resolve();
  }

  return login()
    .then(() => cortexFetch('/?zoom=lookups:itemlookupform', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json())
    .then((res) => {
      const itemForm = res._lookups[0]._itemlookupform[0].links.find(link => link.rel === 'itemlookupaction').uri;
      localStorage.setItem(`${Config.cortexApi.scope}_itemLookupForm`, itemForm);
    });
}

export function itemLookup(itemLookupCode) {
  const itemFormZoomArray = [
    'availability',
    'addtocartform',
    'addtowishlistform',
    'price',
    'rate',
    'definition',
    'definition:assets:element',
    'definition:options:element',
    'definition:options:element:value',
    'definition:options:element:selector:choice',
    'definition:options:element:selector:chosen',
    'definition:options:element:selector:choice:description',
    'definition:options:element:selector:chosen:description',
    'definition:options:element:selector:choice:selector',
    'definition:options:element:selector:chosen:selector',
    'definition:options:element:selector:choice:selectaction',
    'definition:options:element:selector:chosen:selectaction',
    'recommendations',
    'recommendations:crosssell',
    'recommendations:recommendation',
    'recommendations:replacement',
    'recommendations:upsell',
    'recommendations:warranty',
    'recommendations:crosssell:element:code',
    'recommendations:recommendation:element:code',
    'recommendations:replacement:element:code',
    'recommendations:upsell:element:code',
    'recommendations:warranty:element:code',
    'code',
  ];

  return login()
    .then(() => ensureItemLookupForm())
    .then(() => cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_itemLookupForm`)}?zoom=${itemFormZoomArray.join()}&followlocation`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        code: itemLookupCode,
      }),
    }))
    .then((res) => {
      if (res.status === 504 || res.status === 503) {
        throw res;
      }
      if (res.status === 404 || res.status === 403) {
        localStorage.removeItem(`${Config.cortexApi.scope}_itemLookupForm`);
      }
      return res;
    })
    .then(res => res.json());
}

export function addToWishList(uri, itemQuantity) {
  return login()
    .then(() => cortexFetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        quantity: itemQuantity,
      }),
    }));
}

export function fetchCategories() {
  const zoomArray = [
    'navigations:element',
    'navigations:element:child',
  ];

  return login()
    .then(() => cortexFetch(`/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => Promise.all([res, res.status === 200 ? res.json() : {}]));
}

export function searchProducts(searchKeywords) {
  const zoomArray = [
    'element',
    'element:availability',
    'element:definition',
    'element:definition:assets:element',
    'element:price',
    'element:rate',
    'element:code',
  ];

  return login()
    .then(() => cortexFetch('/?zoom=searches:keywordsearchform', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json())
    .then(body => body._searches[0]._keywordsearchform[0].links.find(link => link.rel === 'itemkeywordsearchaction').uri)
    .then(uri => cortexFetch(`${uri}?zoom=${zoomArray.join()}&followlocation`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        keywords: searchKeywords,
      }),
    }))
    .then(res => res.json());
}

export function fetchCartData() {
  const zoomArray = [
    'defaultcart',
    'defaultcart:total',
    'defaultcart:discount',
    'defaultcart:appliedpromotions:element',
    'defaultcart:order:couponinfo:coupon',
    'defaultcart:lineitems:element',
    'defaultcart:lineitems:element:total',
    'defaultcart:lineitems:element:price',
    'defaultcart:lineitems:element:availability',
    'defaultcart:lineitems:element:appliedpromotions',
    'defaultcart:lineitems:element:appliedpromotions:element',
    'defaultcart:lineitems:element:item',
    'defaultcart:lineitems:element:item:code',
    'defaultcart:lineitems:element:item:definition',
    'defaultcart:lineitems:element:item:definition:details',
    'defaultcart:lineitems:element:item:definition:options:element',
    'defaultcart:lineitems:element:item:definition:options:element:value',
    'defaultcart:lineitems:element:item:definition:options:element:selector:choice',
    'defaultcart:lineitems:element:item:definition:options:element:selector:chosen',
    'defaultcart:lineitems:element:item:definition:options:element:selector:choice:description',
    'defaultcart:lineitems:element:item:definition:options:element:selector:chosen:description',
  ];

  return fetchUri(`/?zoom=${zoomArray.sort().join()}`);
}

export function submitEmail(email) {
  return fetchUri('/?zoom=defaultprofile:emails:emailform')
    .then(body => body._defaultprofile[0]._emails[0]._emailform[0].links.find(link => link.rel === 'createemailaction').uri)
    .then(uri => cortexFetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({ email }),
    }));
}

export function fetchOrderData() {
  const zoomArray = [
    // zooms for checkout summary
    'defaultcart',
    'defaultcart:total',
    'defaultcart:discount',
    'defaultcart:order',
    'defaultcart:order:tax',
    'defaultcart:order:total',
    'defaultcart:appliedpromotions:element',
    // zooms for billing address
    'defaultcart:order:billingaddressinfo:billingaddress',
    'defaultcart:order:billingaddressinfo:selector:choice',
    'defaultcart:order:billingaddressinfo:selector:choice:description',
    // zooms for shipping address
    'defaultcart:order:deliveries:element:destinationinfo:destination',
    'defaultcart:order:deliveries:element:destinationinfo:selector:choice',
    'defaultcart:order:deliveries:element:destinationinfo:selector:choice:description',
    // zooms for shipping options
    'defaultcart:order:deliveries:element:shippingoptioninfo:shippingoption',
    'defaultcart:order:deliveries:element:shippingoptioninfo:selector:choice',
    'defaultcart:order:deliveries:element:shippingoptioninfo:selector:choice:description',
    // zooms for payment methods
    'defaultcart:order:paymentmethodinfo:paymentmethod',
    'defaultcart:order:paymentmethodinfo:selector:choice',
    'defaultcart:order:paymentmethodinfo:selector:choice:description',
  ];

  return fetchUri(`/?zoom=${zoomArray.sort().join()}`);
}

export function submitOrder(uri) {
  const purchaseZoomArray = [
    'paymentmeans:element',
    'shipments:element:destination',
    'shipments:element:shippingoption',
    'billingaddress',
    'discount',
    'appliedpromotions:element',
    'lineitems:element',
    'lineitems:element:options:element',
    'lineitems:element:options:element:value',
  ];

  return login()
    .then(() => cortexFetch(`${uri}?followlocation&zoom=${purchaseZoomArray.sort().join()}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json());
}

export function fetchWishlistData() {
  const zoomArray = [
    'defaultwishlist',
    'defaultwishlist:lineitems',
    'defaultwishlist:lineitems:element',
    'defaultwishlist:lineitems:element:item:price',
    'defaultwishlist:lineitems:element:item:availability',
    'defaultwishlist:lineitems:element:list',
    'defaultwishlist:lineitems:element:list:element',
    'defaultwishlist:lineitems:element:item',
    'defaultwishlist:lineitems:element:item:code',
    'defaultwishlist:lineitems:element:item:definition',
    'defaultwishlist:lineitems:element:item:definition:options:element',
    'defaultwishlist:lineitems:element:item:definition:options:element:value',
    'defaultwishlist:lineitems:element:item:definition:options:element:selector:choice',
    'defaultwishlist:lineitems:element:item:definition:options:element:selector:chosen',
    'defaultwishlist:lineitems:element:item:definition:options:element:selector:choice:description',
    'defaultwishlist:lineitems:element:item:definition:options:element:selector:chosen:description',
    'defaultwishlist:lineitems:element:movetocartform',
  ];

  return login()
    .then(() => cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }))
    .then(res => res.json());
}

export function ensureNavigationLookupForm() {
  if (localStorage.getItem(`${Config.cortexApi.scope}_navigationLookupForm`)) {
    return Promise.resolve();
  }

  return login()
    .then(() => fetchUri('/?zoom=lookups:navigationlookupform'))
    .then((body) => {
      const navigationForm = body._lookups[0]._navigationlookupform[0].links.find(link => link.rel === 'navigationlookupaction').uri;
      localStorage.setItem(`${Config.cortexApi.scope}_navigationLookupForm`, navigationForm);
    });
}

export function navigationLookup(navigationLookupCode) {
  const navigationFormZoomArray = [
    'items',
    'items:element',
    'items:element:code',
    'element',
    'element:availability',
    'element:definition',
    'element:definition:assets:element',
    'element:price',
    'element:rate',
    'element:code',
  ];

  return ensureNavigationLookupForm()
    .then(navigationLookupCode.includes('/')
      ? cortexFetch(`${navigationLookupCode}?zoom=${navigationFormZoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then((res) => {
          if (res.status === 504 || res.status === 503) {
            throw new Error();
          }
          return res;
        })
        .then(res => res.json())
      : cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_navigationLookupForm`)}?zoom=${navigationFormZoomArray.join()}&followlocation`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          code: navigationLookupCode,
        }),
      })
        .then((res) => {
          if (res.status === 504 || res.status === 503) {
            throw new Error();
          }
          if (res.status === 404 || res.status === 403) {
            localStorage.removeItem(`${Config.cortexApi.scope}_navigationLookupForm`);
          }
          return res;
        })
        .then(res => res.json()));
}


export function ensurePurchaseLookupForm() {
  if (localStorage.getItem(`${Config.cortexApi.scope}_purchaseLookupForm`)) {
    return Promise.resolve();
  }

  return fetchUri('/?zoom=lookups:purchaselookupform')
    .then((res) => {
      const purchaseForm = res._lookups[0]._purchaselookupform[0].links.find(link => link.rel === 'purchaselookupaction').uri;
      localStorage.setItem(`${Config.cortexApi.scope}_purchaseLookupForm`, purchaseForm);
    });
}

export function purchaseLookup(purchaseLookupCode) {
  const purchaseFormZoomArray = [
    'paymentmeans:element',
    'shipments:element:destination',
    'shipments:element:shippingoption',
    'billingaddress',
    'discount',
    'appliedpromotions:element',
    'lineitems:element',
    'lineitems:element:options:element',
    'lineitems:element:options:element:value',
  ];

  return ensurePurchaseLookupForm(purchaseLookupCode)
    .then(() => cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_purchaseLookupForm`)}?zoom=${purchaseFormZoomArray.join()}&followlocation`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        'purchase-number': purchaseLookupCode,
      }),
    }))
    .then((res) => {
      if (res.status === 504 || res.status === 503) {
        throw new Error();
      }
      if (res.status === 404 || res.status === 403) {
        localStorage.removeItem(`${Config.cortexApi.scope}_purchaseLookupForm`);
      }
      return res;
    })
    .then(res => res.json());
}
