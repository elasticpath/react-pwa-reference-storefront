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

// mock data example
// The files below have not been created, but are referenced as an example of requiring mock data files.
/*
const addressData = require('../offlineData/addressData.json');
const appHeaderNavigationData = require('../offlineData/appHeaderNavigationData.json');
*/


// forms
// The example constants below reference the urls defined for their required forms usually returned by Cortex, but mocked for mock data.
/*
const addToCartForm = '/carts/items/vestri/qgqvhwjakzcvgvcsjfpvot2nivhfgx2nj5cektc7lbpvat2mj5puous7jvca=/form';
const emailForm = '/emails/vestri/form';
*/

// map of request -> response
const mockData = new Map();
// The example below sets the mock data for their required invocations mocked for mock data.
/*
mockData.set(addressData.self.uri, { status: 200, data: addressData });
mockData.set(appHeaderNavigationData.self.uri, { status: 200, data: appHeaderNavigationData });
mockData.set(addToCartForm, { status: 201, data: {} });
mockData.set(emailForm, { status: 201, data: {} });
*/

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
