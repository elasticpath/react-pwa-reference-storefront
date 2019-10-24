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
import subAccountResponse from '../CommonMockHttpResponses/b2bSubAccountData_response.json';
import loginResponse from '../CommonMockHttpResponses/login_response.json';

function mockSubAccountResponse(mockObj) {
  mockObj.get(
    /\/admin\/accounts\/am(.*)/,
    subAccountResponse,
  );
}

function mockLoginResponse(mockObj) {
  mockObj.post(
    '/cortex/oauth2/tokens',
    loginResponse,
  );
}

export function mockFetchSubAccount() {
  fetchMock.restore();
  mockLoginResponse(fetchMock);
  mockSubAccountResponse(fetchMock);
}
