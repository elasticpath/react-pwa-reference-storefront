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
import paymentInstrumentFormResponse from './MockHttpResponses/GET/paymentInstrumentForm_response.json';
import registeredResponse from '../CommonMockHttpResponses/registered_login_response.json';
import anonLoginResponse from '../CommonMockHttpResponses/anonymous_login_response.json';

function mockPaymentInstrumentForm(mockObj) {
  mockObj.get(
    /(.*)(zoom=defaultcart:order:paymentmethodinfo:element:paymentinstrumentform|zoom=defaultprofile:paymentmethods:element:paymentinstrumentform)/,
    paymentInstrumentFormResponse,
  );
}

function mockPaymentInstrumentFormActionSuccess(mockObj) {
  const delay = new Promise((res, rej) => setTimeout(res, 10000));
  mockObj.post(
    /(.*)\/cortex\/paymentinstruments\/paymentmethods\/(orders|profiles)\/(.*)\/form/,
    delay.then(() => paymentInstrumentFormResponse),
  );
}

function mockPaymentInstrumentFormActionFailure(mockObj) {
  const delay = new Promise((res, rej) => setTimeout(res, 10000));
  mockObj.post(
    /(.*)\/cortex\/paymentinstruments\/paymentmethods\/(orders|profiles)\/(.*)\/form/,
    delay.then(() => 400),
  );
}

function mockRegisteredLoginResponse(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/oauth2\/tokens/,
    registeredResponse,
  );
}

function mockAnonLoginResponse(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/oauth2\/tokens/,
    anonLoginResponse,
  );
}

export function mockPaymentFormSuccessWithAnonUser() {
  fetchMock.restore();
  localStorage.clear();
  mockAnonLoginResponse(fetchMock);
  mockPaymentInstrumentForm(fetchMock);
  mockPaymentInstrumentFormActionSuccess(fetchMock);
}

export function mockPaymentFormSuccessWithRegisteredUser() {
  fetchMock.restore();
  localStorage.clear();
  mockRegisteredLoginResponse(fetchMock);
  mockPaymentInstrumentForm(fetchMock);
  mockPaymentInstrumentFormActionSuccess(fetchMock);
}

export function mockPaymentFormFailureWithAnonUser() {
  fetchMock.restore();
  localStorage.clear();
  mockAnonLoginResponse(fetchMock);
  mockPaymentInstrumentForm(fetchMock);
  mockPaymentInstrumentFormActionFailure(fetchMock);
}
