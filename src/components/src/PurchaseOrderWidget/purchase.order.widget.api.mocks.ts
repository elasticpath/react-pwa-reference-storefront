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
import fetchPaymentOrderDataResponse from './MockHttpResponses/GET/fetch_payment_order_data_response.json';
import fetchPaymentOrderDataNoPOResponse from './MockHttpResponses/GET/fetch_payment_order_data_no_po_response.json';
import fetchPaymentOrderDataResponseNoInstrument from './MockHttpResponses/GET/fetch_payment_order_data_response_no_instrument.json';
import { mockAnonLoginResponse, mockRegisteredLoginResponse } from '../utils/MockLogins';

function mockfetchPONumberPaymentInstrumentFromOrder(mockObj) {
  mockObj.get(
    /(.*)(zoom=defaultcart:order:paymentinstrumentselector:choice:description,defaultcart:order:paymentinstrumentselector:chosen:description,defaultcart:order:paymentinstrumentselector:default:description,defaultcart:order:paymentmethodinfo:element:paymentinstrumentform)/,
    fetchPaymentOrderDataResponse,
  );
}

function mockFetchPONumberPaymentMethodNotAvailable(mockObj) {
  const delay = new Promise((res, rej) => setTimeout(res, 10000));
  mockObj.get(
    /(.*)(zoom=defaultcart:order:paymentinstrumentselector:choice:description,defaultcart:order:paymentinstrumentselector:chosen:description,defaultcart:order:paymentinstrumentselector:default:description,defaultcart:order:paymentmethodinfo:element:paymentinstrumentform)/,
    fetchPaymentOrderDataNoPOResponse,
  );
}

function mockFetchPONumberNoPaymentInstrument(mockObj) {
  const delay = new Promise((res, rej) => setTimeout(res, 10000));
  mockObj.get(
    /(.*)(zoom=defaultcart:order:paymentinstrumentselector:choice:description,defaultcart:order:paymentinstrumentselector:chosen:description,defaultcart:order:paymentinstrumentselector:default:description,defaultcart:order:paymentmethodinfo:element:paymentinstrumentform)/,
    fetchPaymentOrderDataResponseNoInstrument,
  );
}

export function mockPOPaymentInstrumentAvailableWithAnonUser() {
  fetchMock.restore();
  mockAnonLoginResponse(fetchMock);
  mockfetchPONumberPaymentInstrumentFromOrder(fetchMock);
}

export function mockPOPaymentMethodNotAvailableWithAnonUser() {
  fetchMock.restore();
  mockAnonLoginResponse(fetchMock);
  mockFetchPONumberPaymentMethodNotAvailable(fetchMock);
}

export function mockPOPaymentFormNoPaymentInstrument() {
  fetchMock.restore();
  mockAnonLoginResponse(fetchMock);
  mockFetchPONumberNoPaymentInstrument(fetchMock);
}