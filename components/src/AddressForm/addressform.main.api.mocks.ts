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
import fetchGeoDataResponse from './MockHttpResponses/GET/fetchGeoData_response.json';
import fetchAddressFormResponse from './MockHttpResponses/GET/fetchAddressForm_response.json';
import fetchAddressDataResponse from './MockHttpResponses/GET/fetchAddressData_response.json';
import submitAddressResponse from './MockHttpResponses/POST/submitAddress_response.json';
import { mockAnonLoginResponse } from '../utils/MockLogins';

fetchMock.config.fallbackToNetwork = true;

function mockCountriesResponse(mockObj) {
  mockObj.get(
    /* eslint-disable max-len */
    /\/cortex\/geographies\/[a-zA-Z0-9_]*\/countries\/\?zoom(.*)/,
    fetchGeoDataResponse,
  );
}

function mockAddressFormResponse(mockObj) {
  mockObj.get(
    '/cortex/?zoom=defaultprofile:addresses:addressform',
    fetchAddressFormResponse,
  );
}

function mockAddressDataResponse(mockObj) {
  mockObj.get(
    /(.*)\/cortex\/addresses\/[a-zA-Z0-9_]*/,
    fetchAddressDataResponse,
  );
}

function mockSubmitAddressResponseSuccessResponse(mockObj) {
  mockObj
    .put(
      /(.*)\/cortex\/addresses\/[a-zA-Z0-9_]*/,
      submitAddressResponse,
    )
    .post(
      /(.*)\/cortex\/addresses\/[a-zA-Z0-9_]*/,
      submitAddressResponse,
    );
}

function mockSubmitAddressResponseFailureResponse(mockObj) {
  mockObj
    .put(
      /^(?!\/cortex\/addresses\/[a-zA-Z0-9_]).*$/,
      400,
    )
    .post(
      /^(?!\/cortex\/addresses\/[a-zA-Z0-9_]).*$/,
      400,
    );
}

function mockCommonAddressFormResponses(mockObj) {
  mockAnonLoginResponse(mockObj);
  mockCountriesResponse(mockObj);
  mockAddressFormResponse(mockObj);
  mockAddressDataResponse(mockObj);
}

export function mockAddressFormSubmitSuccess() {
  fetchMock.restore();
  mockCommonAddressFormResponses(fetchMock);
  mockSubmitAddressResponseSuccessResponse(fetchMock);
}

export function mockAddressFormSubmitFailure() {
  fetchMock.restore();
  mockCommonAddressFormResponses(fetchMock);
  mockSubmitAddressResponseFailureResponse(fetchMock);
}
