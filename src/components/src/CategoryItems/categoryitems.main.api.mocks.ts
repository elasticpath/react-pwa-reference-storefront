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
import { mockAnonLoginResponse } from '../utils/MockLogins';
import fetchNavigationFormResponse from './MockHttpResponses/GET/fetch_navigation_lookup_form_response.json';
import fetchNavigationForm from './MockHttpResponses/POST/fetch_navigation_lookup_response.json';

function mockLookupForm(mockObj) {
  mockObj.get(
    /(.*)?zoom=lookups:navigationlookupform/,
    fetchNavigationFormResponse,
  );
}

function mockNavigationLookup(mockObj) {
  mockObj.post(
    (url, opts) => {
      const matchNavigationLookupRegex = /\/cortex\/navigations\/vestri_reference\/lookups\/form(.*)/;
      const categoryToLookupInPayload = 'VV_VEHICLES';

      if (url.match(matchNavigationLookupRegex)) {
        if (opts.body && JSON.parse(opts.body).code === categoryToLookupInPayload) {
          return true;
        }
      }

      return false;
    },
    fetchNavigationForm,
  );
}

export default function mockCommonCategoryItemsMainResponses() {
  fetchMock.restore();
  mockAnonLoginResponse(fetchMock);
  mockLookupForm(fetchMock);
  mockNavigationLookup(fetchMock);
}
