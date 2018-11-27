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

// Array of zoom parameters to pass to Cortex for navigationForm
const navigationFormZoomArray = [
  'items',
  'items:element',
  'items:element:code',
  'items:element:availability',
  'items:element:definition',
  'items:element:definition:assets:element',
  'items:element:price',
  'items:element:rate',
  'element',
  'element:availability',
  'element:definition',
  'element:definition:assets:element',
  'element:price',
  'element:rate',
  'element:code',
];

// Array of zoom parameters to pass to Cortex for itemDetails
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
  'recommendations:crosssell:element:definition',
  'recommendations:recommendation:element:definition',
  'recommendations:replacement:element:definition',
  'recommendations:upsell:element:definition',
  'recommendations:warranty:element:definition',
  'recommendations:crosssell:element:price',
  'recommendations:recommendation:element:price',
  'recommendations:replacement:element:price',
  'recommendations:upsell:element:price',
  'recommendations:warranty:element:price',
  'recommendations:crosssell:element:availability',
  'recommendations:recommendation:element:availability',
  'recommendations:replacement:element:availability',
  'recommendations:upsell:element:availability',
  'recommendations:warranty:element:availability',
  'code',
];

// Array of zoom parameters to pass to Cortex for purchaseDetails
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

// Array of zoom parameters to pass to Cortex for searchDetails
const searchFormZoomArray = [
  'element',
  'element:availability',
  'element:definition',
  'element:definition:assets:element',
  'element:price',
  'element:rate',
  'element:code',
  'element',
  'element:availability',
  'element:definition',
  'element:definition:assets:element',
  'element:pricerange',
  'element:items',
  'element:items:element',
  'element:items:element:availability',
  'element:items:element:definition',
  'element:items:element:definition:assets:element',
  'element:items:element:price',
  'element:items:element:rate',
  'element:items:element:code',
  'facets',
  'facets:element',
  'facets:element:facetselector',
  'facets:element:facetselector:choice:description',
  'facets:element:facetselector:choice:selector',
  'facets:element:facetselector:choice:selectaction',
  'facets:element:facetselector:chosen:description',
  'facets:element:facetselector:chosen:selector',
  'facets:element:facetselector:chosen:selectaction',
];

const Config = require('Config');

export function cortexFetchNavigationLookupForm() {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_navigationLookupForm`) === null) {
      cortexFetch('/?zoom=lookups:navigationlookupform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const navigationForm = res._lookups[0]._navigationlookupform[0].links.find(link => link.rel === 'navigationlookupaction').uri;
          localStorage.setItem(`${Config.cortexApi.scope}_navigationLookupForm`, navigationForm);
          resolve();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          reject(error);
        });
    } else {
      resolve();
    }
  }));
}

export function cortexFetchItemLookupForm() {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_itemLookupForm`) === null) {
      cortexFetch('/?zoom=lookups:itemlookupform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const itemForm = res._lookups[0]._itemlookupform[0].links.find(link => link.rel === 'itemlookupaction').uri;
          localStorage.setItem(`${Config.cortexApi.scope}_itemLookupForm`, itemForm);
          resolve();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          reject(error);
        });
    } else {
      resolve();
    }
  }));
}

export function cortexFetchPurchaseLookupForm() {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_purchaseLookupForm`) === null) {
      cortexFetch('/?zoom=lookups:purchaselookupform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const purchaseForm = res._lookups[0]._purchaselookupform[0].links.find(link => link.rel === 'purchaselookupaction').uri;
          localStorage.setItem(`${Config.cortexApi.scope}_purchaseLookupForm`, purchaseForm);
          resolve();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          reject(error);
        });
    } else {
      resolve();
    }
  }));
}

export function navigationLookup(navigationLookupCode) {
  return new Promise(((resolve, reject) => {
    if (navigationLookupCode.includes('/') && navigationLookupCode.includes(Config.cortexApi.scope)) {
      cortexFetch(`/${navigationLookupCode}?zoom=${navigationFormZoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
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
    } else {
      cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_navigationLookupForm`)}?zoom=${navigationFormZoomArray.join()}&followlocation`,
        {
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
          if (res.status === 400 || res.status === 404 || res.status === 403) {
            localStorage.removeItem(`${Config.cortexApi.scope}_navigationLookupForm`);
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
    }
  }));
}

export function itemLookup(itemLookupCode) {
  return new Promise(((resolve, reject) => {
    cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_itemLookupForm`)}?zoom=${itemFormZoomArray.join()}&followlocation`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          code: itemLookupCode,
        }),
      })
      .then((res) => {
        if (res.status === 400 || res.status === 404 || res.status === 403) {
          localStorage.removeItem(`${Config.cortexApi.scope}_itemLookupForm`);
          window.location.reload();
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

export function purchaseLookup(purchaseLookupCode) {
  return new Promise(((resolve, reject) => {
    cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_purchaseLookupForm`)}?zoom=${purchaseFormZoomArray.join()}&followlocation`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          'purchase-number': purchaseLookupCode,
        }),
      })
      .then((res) => {
        if (res.status === 400 || res.status === 404 || res.status === 403) {
          localStorage.removeItem(`${Config.cortexApi.scope}_purchaseLookupForm`);
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

export function searchLookup(searchKeyword) {
  return new Promise(((resolve, reject) => {
    if (searchKeyword.includes('/') && searchKeyword.includes(Config.cortexApi.scope)) {
      cortexFetch(`/${searchKeyword}?zoom=${searchFormZoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then((res) => {
          if (res.status === 504 || res.status === 503) {
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
    } else {
      cortexFetch('/?zoom=searches:keywordsearchform,searches:offersearchform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          let searchForm = '';
          if (res._searches[0]._offersearchform) {
            searchForm = res._searches[0]._offersearchform[0].links.find(link => link.rel === 'offersearchaction').uri;
          } else {
            searchForm = res._searches[0]._keywordsearchform[0].links.find(link => link.rel === 'itemkeywordsearchaction').uri;
          }
          cortexFetch(`${searchForm}?zoom=${searchFormZoomArray.join()}&followlocation`,
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
              body: JSON.stringify({
                keywords: searchKeyword,
              }),
            })
            .then((resData) => {
              if (res.status === 504 || res.status === 503) {
                reject(resData);
              }
              return resData;
            })
            .then(resData => resData.json())
            .then((resData) => {
              resolve(resData);
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
              reject(error);
            });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          reject(error);
        });
    }
  }));
}
