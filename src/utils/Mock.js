/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

// mock data
const addressData = require('../offlineData/addressData.json');
const appHeaderNavigationData = require('../offlineData/appHeaderNavigationData.json');
const cartData = require('../offlineData/cartData.json');
const checkoutData = require('../offlineData/checkoutData.json');
const countryData = require('../offlineData/countryData.json');
const emailFormData = require('../offlineData/emailFormData.json');
const orderReviewData = require('../offlineData/orderReviewData.json');
const purchaseReceiptData = require('../offlineData/purchaseReceiptData.json');
const searchData = require('../offlineData/searchData.json');
const searchFormData = require('../offlineData/searchFormData.json');
const searchProduct1 = require('../offlineData/searchProduct1.json');
const searchProduct2 = require('../offlineData/searchProduct2.json');
const womensCategoryItemsData = require('../offlineData/womensCategoryItemsData.json');
const womensProduct1 = require('../offlineData/womensProduct1.json');
const womensProduct2 = require('../offlineData/womensProduct2.json');
const womensProduct3 = require('../offlineData/womensProduct3.json');
const womensProduct4 = require('../offlineData/womensProduct4.json');
const womensProduct5 = require('../offlineData/womensProduct5.json');
const womensProduct6 = require('../offlineData/womensProduct6.json');
const womensProduct7 = require('../offlineData/womensProduct7.json');
const womensProduct8 = require('../offlineData/womensProduct8.json');

// followlocation
// eslint-disable-next-line max-len
const purchaseReceiptFollow = '/purchases/orders/vestri/ga3wgmbxgi2wcljxga4taljuha4dcljymyzdcljrgnswgolggnqwkntdge=/form?followlocation&zoom=appliedpromotions:element,billingaddress,discount,lineitems:element,lineitems:element:options:element,lineitems:element:options:element:value,paymentmeans:element,shipments:element:destination,shipments:element:shippingoption';
const searchFollow = '/searches/vestri/keywords/form?zoom=element,element:availability,element:definition,element:definition:assets:element,element:price,element:rate,element:code&followlocation';

// forms
const addToCartForm = '/carts/items/vestri/qgqvhwjakzcvgvcsjfpvot2nivhfgx2nj5cektc7lbpvat2mj5puous7jvca=/form';
const emailForm = '/emails/vestri/form';

// map of request -> response
const mockData = new Map();
mockData.set(addressData.self.uri, { status: 200, data: addressData });
mockData.set(appHeaderNavigationData.self.uri, { status: 200, data: appHeaderNavigationData });
mockData.set(cartData.self.uri, { status: 200, data: cartData });
mockData.set(checkoutData.self.uri, { status: 200, data: checkoutData });
mockData.set(countryData.self.uri, { status: 200, data: countryData });
mockData.set(emailFormData.self.uri, { status: 200, data: emailFormData });
mockData.set(orderReviewData.self.uri, { status: 200, data: orderReviewData });
mockData.set(purchaseReceiptFollow, { status: 200, data: purchaseReceiptData });
mockData.set(searchFollow, { status: 201, data: searchData });
mockData.set(searchFormData.self.uri, { status: 200, data: searchFormData });
mockData.set(searchProduct1.self.uri, { status: 200, data: searchProduct1 });
mockData.set(searchProduct2.self.uri, { status: 200, data: searchProduct2 });
mockData.set(womensCategoryItemsData.self.uri, { status: 200, data: womensCategoryItemsData });
mockData.set(womensProduct1.self.uri, { status: 200, data: womensProduct1 });
mockData.set(womensProduct2.self.uri, { status: 200, data: womensProduct2 });
mockData.set(womensProduct3.self.uri, { status: 200, data: womensProduct3 });
mockData.set(womensProduct4.self.uri, { status: 200, data: womensProduct4 });
mockData.set(womensProduct5.self.uri, { status: 200, data: womensProduct5 });
mockData.set(womensProduct6.self.uri, { status: 200, data: womensProduct6 });
mockData.set(womensProduct7.self.uri, { status: 200, data: womensProduct7 });
mockData.set(womensProduct8.self.uri, { status: 200, data: womensProduct8 });
mockData.set(addToCartForm, { status: 201, data: {} });
mockData.set(emailForm, { status: 201, data: {} });

const mockFetch = (input) => {
  const mockResponse = mockData.get(input);
  if (!mockResponse) {
    throw new Error(`Cannot find your mock data for: ${input}`);
  }
  const { data, status } = mockResponse;

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const init = { status };
  const res = new Response(blob, init);

  return new Promise(resolve => resolve(res));
};

export default mockFetch;
