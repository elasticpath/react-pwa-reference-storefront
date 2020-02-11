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
import poPaymentCreationSuccess from './MockHttpResponses/POST/po_payment_creation_success.json';
import nameMustNotBeBlankError from './MockHttpResponses/POST/name_must_not_be_blank_error.json';
import poMustNotBeBlankError from './MockHttpResponses/POST/po_must_not_be_blank_error.json';
import { mockAnonLoginResponse, mockRegisteredLoginResponse } from '../utils/MockLogins';


function mockFetchPostToCreatePoPaymentInstrumentSuccess(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/paymentinstruments\/paymentmethods\/(orders|profiles)\/(.*)\/form/,
    {
      body: poPaymentCreationSuccess,
      status: 201,
    },
    {
      status: 201,
      delay: 1000, // fake a slow network
    },
  );
}

function mockPaymentInstrumentFormActionFailure(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/paymentinstruments\/paymentmethods\/(orders|profiles)\/(.*)\/form/,
    {
      body: nameMustNotBeBlankError,
      status: 404,
    },
    {
      delay: 1000, // fake a slow network
    },
  );
}

function mockPaymentInstrumentFormActionPOFailure(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/paymentinstruments\/paymentmethods\/(orders|profiles)\/(.*)\/form/,
    {
      body: poMustNotBeBlankError,
      status: 404,
    },
    {
      status: 404,
      delay: 1000, // fake a slow network
    },
  );
}

export default function mockPostToCreatePOPaymentInstrumentWithAnonUser() {
  fetchMock.restore();
  mockAnonLoginResponse(fetchMock);
  mockFetchPostToCreatePoPaymentInstrumentSuccess(fetchMock);
}
