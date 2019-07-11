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
import fetchMock from 'fetch-mock/es5/client';
import itemLookupFormResponse from './MockHttpResponses/GET/itemLookupForm_response.json';
import itemLookupResponse from './MockHttpResponses/POST/itemLookup_response.json';
import loginResponse from '../CommonMockHttpResponses/login_response.json';

function mockLoginResponse(mockObj) {
  mockObj.post(
    '/cortex/oauth2/tokens',
    loginResponse,
  );
}

function mockLookupForm(mockObj) {
  mockObj.get(
    '/cortex/?zoom=lookups:itemlookupform',
    itemLookupFormResponse
  );
}

function mockItemLookup(mockObj) {
  mockObj.post(
    /\/cortex\/items\/vestri_b2c\/lookups\/form?(.*)/,
    itemLookupResponse
  );
}
export function mockProductDisplayItemMain() {
  fetchMock.restore();
  mockLoginResponse(fetchMock);
  mockLookupForm(fetchMock);
  mockItemLookup(fetchMock);
}