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
import fetchMock from 'fetch-mock/es5/client';
import loginResponse from '../CommonMockHttpResponses/login_response.json';
import fetchNavigationFormResponse from './MockHttpResponses/GET/fetch_navigation_lookup_form_response.json';
import fetchNavigationForm from './MockHttpResponses/POST/fetch_navigation_lookup_response.json';

function mockLoginResponse(mockObj) {
  mockObj.post(
    '/cortex/oauth2/tokens',
    loginResponse,
  );
}

function mockLookupForm(mockObj) {
  mockObj.get(
    '/cortex/?zoom=lookups:navigationlookupform',
    fetchNavigationFormResponse,
  );
}

function mockNavigationLookup(mockObj) {
  // How to match the payload when mocking as well? 
  mockObj.post(
    function(url, opts) {
      console.log('Matching mockNavigationLookup');
      console.log(url);
      console.log(opts);
      if (url.match(/\/cortex\/navigations\/vestri_reference\/lookups\/form(.*)/)) {
        if (opts.body && JSON.parse(opts.body).code=='VV_VEHICLES') {
          return true;
        }
      }
      return false;
    },
    fetchNavigationForm,
  );

  // return mockObj.mock(
  //   matcher,
  //   fetchNavigationForm,
  //   Object.assign({}, options, {method: 'PURGE'})
  // );
}

export default function mockCommonCategoryItemsMainResponses() {
  fetchMock.restore();
  mockLoginResponse(fetchMock);
  mockLookupForm(fetchMock);
  mockNavigationLookup(fetchMock);
}
