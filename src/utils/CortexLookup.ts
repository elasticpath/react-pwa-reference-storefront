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

import { cortexFetch } from './Cortex';
import * as Config from '../ep.config.json';

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
  'offers',
  'offers:element',
  'offers:element:code',
  'offers:element:availability',
  'offers:element:definition',
  'offers:element:definition:assets:element',
  'offers:element:pricerange',
  'offers:element:items',
  'offers:element:items:element',
  'offers:element:items:element:availability',
  'offers:element:items:element:definition',
  'offers:element:items:element:definition:assets:element',
  'offers:element:items:element:price',
  'offers:element:items:element:rate',
  'offers:element:items:element:code',
  'offers:element:rate',
  'element',
  'element:availability',
  'element:definition',
  'element:definition:assets:element',
  'element:price',
  'element:rate',
  'element:code',
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
  'offers:facets',
  'offers:facets:element',
  'offers:facets:element:facetselector',
  'offers:facets:element:facetselector:choice:description',
  'offers:facets:element:facetselector:choice:selector',
  'offers:facets:element:facetselector:choice:selectaction',
  'offers:facets:element:facetselector:chosen:description',
  'offers:facets:element:facetselector:chosen:selector',
  'offers:facets:element:facetselector:chosen:selectaction',
  'offers:sortattributes',
  'offers:sortattributes:choice',
  'offers:sortattributes:choice:description',
  'offers:sortattributes:choice:selectaction',
  'offers:sortattributes:choice:selector',
  'offers:sortattributes:chosen',
  'offers:sortattributes:chosen:description',
  'offers:sortattributes:chosen:selectaction',
  'offers:sortattributes:chosen:selector',
  'offers:sortattributes:offersearchresult',
  'featuredoffers',
  'featuredoffers:element',
  'featuredoffers:element:availability',
  'featuredoffers:element:definition',
  'featuredoffers:element:definition:assets:element',
  'featuredoffers:element:price',
  'featuredoffers:element:rate',
  'featuredoffers:element:code',
  'featuredoffers:element:items',
  'featuredoffers:element:items:element',
  'featuredoffers:element:items:element:availability',
  'featuredoffers:element:items:element:definition',
  'featuredoffers:element:items:element:definition:assets:element',
  'featuredoffers:element:items:element:price',
  'featuredoffers:element:items:element:rate',
  'featuredoffers:element:items:element:code',
  'parent',
  'sortattributes',
  'sortattributes:choice',
  'sortattributes:choice:description',
  'sortattributes:choice:selectaction',
  'sortattributes:choice:selector',
  'sortattributes:chosen',
  'sortattributes:chosen:description',
  'sortattributes:chosen:selectaction',
  'sortattributes:chosen:selector',
  'sortattributes:offersearchresult',
];

// Array of zoom parameters to pass to Cortex for itemDetails
const itemFormZoomArray = [
  'availability',
  'addtocartform',
  'addtocartforms:element:addtocartaction',
  'addtocartforms:element:target:descriptor',
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
  'definition:components',
  'definition:components:element',
  'definition:components:element:code',
  'definition:components:element:standaloneitem',
  'definition:components:element:standaloneitem:code',
  'definition:components:element:standaloneitem:definition',
  'definition:components:element:standaloneitem:availability',
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
  'postedpayments:element',
  'paymentinstruments:element',
  'shipments:element:destination',
  'shipments:element:shippingoption',
  'billingaddress',
  'discount',
  'appliedpromotions:element',
  'lineitems:element',
  'lineitems:element:item:code',
  'lineitems:element:item:availability',
  'lineitems:element:item:definition',
  'lineitems:element:item:addtocartform',
  'lineitems:element:item:definition:assets:element',
  'lineitems:element:item:price',
  'lineitems:element:item:rate',
  'lineitems:element:options:element',
  'lineitems:element:options:element:value',
  'lineitems:element:components',
  'lineitems:element:components:element',
  'lineitems:element:components:element:item:addtocartform',
  'lineitems:element:components:element:item:availability',
  'lineitems:element:components:element:item:definition',
  'lineitems:element:components:element:item:code',
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
  'sortattributes',
  'sortattributes:choice',
  'sortattributes:choice:description',
  'sortattributes:choice:selectaction',
  'sortattributes:choice:selector',
  'sortattributes:chosen',
  'sortattributes:chosen:description',
  'sortattributes:chosen:selectaction',
  'sortattributes:chosen:selector',
  'sortattributes:offersearchresult',
];

// Array of zoom parameters to pass to Cortex for batches
const batchFormZoomArray = [
  'element',
  'element:availability',
  'element:addtocartform',
  'element:addtowishlistform',
  'element:price',
  'element:rate',
  'element:definition',
  'element:definition:assets:element',
  'element:definition:options:element',
  'element:definition:options:element:value',
  'element:definition:options:element:selector:choice',
  'element:definition:options:element:selector:chosen',
  'element:definition:options:element:selector:choice:description',
  'element:definition:options:element:selector:chosen:description',
  'element:definition:options:element:selector:choice:selector',
  'element:definition:options:element:selector:chosen:selector',
  'element:definition:options:element:selector:choice:selectaction',
  'element:definition:options:element:selector:chosen:selectaction',
  'element:definition:components',
  'element:definition:components:element',
  'element:definition:components:element:code',
  'element:definition:components:element:standaloneitem',
  'element:definition:components:element:standaloneitem:code',
  'element:definition:components:element:standaloneitem:definition',
  'element:definition:components:element:standaloneitem:availability',
  'element:recommendations',
  'element:recommendations:crosssell',
  'element:recommendations:recommendation',
  'element:recommendations:replacement',
  'element:recommendations:upsell',
  'element:recommendations:warranty',
  'element:recommendations:crosssell:element:code',
  'element:recommendations:recommendation:element:code',
  'element:recommendations:replacement:element:code',
  'element:recommendations:upsell:element:code',
  'element:recommendations:warranty:element:code',
  'element:recommendations:crosssell:element:definition',
  'element:recommendations:recommendation:element:definition',
  'element:recommendations:replacement:element:definition',
  'element:recommendations:upsell:element:definition',
  'element:recommendations:warranty:element:definition',
  'element:recommendations:crosssell:element:price',
  'element:recommendations:recommendation:element:price',
  'element:recommendations:replacement:element:price',
  'element:recommendations:upsell:element:price',
  'element:recommendations:warranty:element:price',
  'element:recommendations:crosssell:element:availability',
  'element:recommendations:recommendation:element:availability',
  'element:recommendations:replacement:element:availability',
  'element:recommendations:upsell:element:availability',
  'element:recommendations:warranty:element:availability',
  'element:code',
];

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

export function cortexFetchBatchItemLookupForm() {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_batchLookupForm`) === null) {
      cortexFetch('/?zoom=lookups:batchitemslookupform,lookups:batchofferslookupform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          let batchForm = '';
          if (res._lookups[0]._batchofferslookupform) {
            batchForm = res._lookups[0]._batchofferslookupform[0].links.find(link => link.rel === 'batchofferslookupaction').uri;
          } else {
            batchForm = res._lookups[0]._batchitemslookupform[0].links.find(link => link.rel === 'batchitemslookupaction').uri;
          }
          localStorage.setItem(`${Config.cortexApi.scope}_batchLookupForm`, batchForm);
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
    if (navigationLookupCode.includes('/') && navigationLookupCode.includes(Config.cortexApi.scope.toLowerCase())) {
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
      cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_navigationLookupForm`)}?zoom=${navigationFormZoomArray.join()}&followlocation=true`,
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

export function itemLookup(itemLookupCode, reload = true) {
  return new Promise(((resolve, reject) => {
    cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_itemLookupForm`)}?zoom=${itemFormZoomArray.join()}&followlocation=true`,
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
          if (reload) window.location.reload();
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
    cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_purchaseLookupForm`)}?zoom=${purchaseFormZoomArray.join()}&followlocation=true`,
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
    if (searchKeyword.includes('/') && searchKeyword.includes(Config.cortexApi.scope.toLowerCase())) {
      cortexFetch(`/${searchKeyword}?zoom=${searchFormZoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
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
          cortexFetch(`${searchForm}?zoom=${searchFormZoomArray.join()}&followlocation=true`,
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
              if (res.status >= 500) {
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

export function batchLookup(batchLookupCodes) {
  return new Promise(((resolve, reject) => {
    cortexFetch(`${localStorage.getItem(`${Config.cortexApi.scope}_batchLookupForm`)}?zoom=${batchFormZoomArray.join()}&followlocation=true`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          codes: batchLookupCodes,
        }),
      })
      .then((res) => {
        if (res.status === 400 || res.status === 404 || res.status === 403) {
          localStorage.removeItem(`${Config.cortexApi.scope}_batchLookupForm`);
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
