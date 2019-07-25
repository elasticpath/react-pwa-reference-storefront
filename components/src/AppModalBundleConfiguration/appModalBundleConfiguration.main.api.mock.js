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
import loginResponse from '../CommonMockHttpResponses/login_response.json';
import mockFetchDependantItemDataResponse from './MockHttpResponses/GET/fetchDependantItemData_response.json';

function mockLoginResponse(mockObj) {
    mockObj.post(
        '/cortex/oauth2/tokens',
        loginResponse,
    );
}

function mockFetchDependantItemData(fetchMock) {
    fetchMock.get(
        /(.*)\/cortex\/carts\/[a-zA-Z0-9_]*\/(.*)/,
        mockFetchDependantItemDataResponse,
    );
}

export function mockAppModalBundleConfigurationMain() {
    fetchMock.restore();
    mockLoginResponse(fetchMock)
    mockFetchDependantItemData(fetchMock);
}
