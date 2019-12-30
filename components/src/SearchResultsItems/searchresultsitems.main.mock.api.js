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
import getSearchFromResponse from './MockHttpResponses/GET/getSearchForm_response.json';
import offerSearchResponse from './MockHttpResponses/POST/offerSearch_response.json';
import { mockAnonLoginResponse } from '../utils/MockLogins';

function mockGetSearchForm(mockObj) {
  mockObj.get(
    /(.*)?zoom=searches:keywordsearchform,searches:offersearchform/,
    getSearchFromResponse,
  );
}

function mockOfferSearch(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/offersearches\/[a-zA-Z0-9_]*\/offers\/form?(.*)/,
    offerSearchResponse,
  );
}

export default function mockSearchResults() {
  fetchMock.restore();
  mockAnonLoginResponse(fetchMock);
  mockGetSearchForm(fetchMock);
  mockOfferSearch(fetchMock);
}
