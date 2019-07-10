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
import fetchGeoDataResponse from './MockHttpResponses/GET/fetchGeoData_response.json';
import fetchAddressFormResponse from './MockHttpResponses/GET/fetchAddressForm_response.json';
import fetchAddressDataResponse from './MockHttpResponses/GET/fetchAddressData_response.json';
import loginResponse from './MockHttpResponses/POST/login_response.json';
import submitAddressResponse from './MockHttpResponses/POST/submitAddress_response.json';

function mockLoginResponse(mockObj) {
  mockObj.post(
    '/cortex/oauth2/tokens',
    loginResponse,
  );
}

function mockCountriesResponse(mockObj) {
  mockObj.get(
    /* eslint-disable max-len */
    /\/cortex\/geographies\/[a-zA-Z0-9]*\/countries\/\?zoom=element,element:regions,element:regions:element,countries:element,countries:element:regions,countries:element:regions:element/,
    fetchGeoDataResponse,
  );
}

function mockAddressFormResponse(mockObj) {
  mockObj.get(
    '/cortex/?zoom=defaultprofile:addresses:addressform',
    fetchAddressFormResponse,
  )
}

function mockAddressDataResponse(mockObj) {
  mockObj.get(
    /(.*)\/cortex\/addresses\/[a-zA-Z0-9]*/,
    fetchAddressDataResponse,
  );
}

function mockSubmitAddressResponseSuccessResponse(mockObj) {
  mockObj
    .put(
      /(.*)\/cortex\/addresses\/[a-zA-Z0-9]*/,
      submitAddressResponse
    )
    .post(
      /(.*)\/cortex\/addresses\/[a-zA-Z0-9]*/,
      submitAddressResponse
    );
}

function mockSubmitAddressResponseFailureResponse(mockObj) {
  mockObj
    .put(
      /(.*)\/cortex\/addresses\/[a-zA-Z0-9]*/,
      400
    )
    .post(
      /(.*)\/cortex\/addresses\/[a-zA-Z0-9]*/,
      400
    );
}

function mockCommonAddressFormResponses(mockObj) {
    mockLoginResponse(mockObj);
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