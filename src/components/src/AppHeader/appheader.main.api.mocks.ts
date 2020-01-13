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
import itemLookupMultiCartResponse from '../CommonMockHttpResponses/itemLookupMultiCart_response.json';
import { mockAnonLoginResponse } from '../utils/MockLogins';

function mockMultiCartResponse(mockObj) {
  mockObj.get(
    /(.*)\/?zoom=carts,carts:element,defaultcart,defaultcart:additemstocartform/,
    itemLookupMultiCartResponse,
  );
}

export default function mockProductDisplayItemMainMultiCart() {
  fetchMock.restore();
  mockAnonLoginResponse(fetchMock);
  mockMultiCartResponse(fetchMock);
}
