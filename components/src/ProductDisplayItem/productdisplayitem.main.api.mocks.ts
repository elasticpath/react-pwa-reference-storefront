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
import itemLookupFormResponse from './MockHttpResponses/GET/itemLookupForm_response.json';
import itemLookupPlainResponse from './MockHttpResponses/POST/itemLookupPlain_response.json';
import itemLookupColorAndSizeResponse from './MockHttpResponses/POST/itemLookupColorAndSize_response.json';
import itemLookupInputResponse from './MockHttpResponses/POST/itemLookupInput_response.json';
import itemLookupMultiCartResponse from '../CommonMockHttpResponses/itemLookupMultiCart_response.json';
import yellowMultiSkuSelectionResponse from './MockHttpResponses/POST/yellowMultiSkuSelection_response.json';
import blackMultiSkuSelectionResponse from './MockHttpResponses/POST/blackMultiSkuSelection_response.json';
import largeMultiSkuSelectionResponse from './MockHttpResponses/POST/largeMultiSkuSelection_response.json';
import mediumMultiSkuSelectionResponse from './MockHttpResponses/POST/mediumMultiSkuSelection_response.json';
import smallMultiSkuSelectionResponse from './MockHttpResponses/POST/smallMultiSkuSelection_response.json';
import { mockAnonLoginResponse } from '../utils/MockLogins';

function mockLookupForm(mockObj) {
  mockObj.get(
    /(.*)?zoom=lookups:itemlookupform/,
    itemLookupFormResponse,
  );
}

function mockItemLookupPlain(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/items\/vestri_b2c\/lookups\/form?(.*)/,
    itemLookupPlainResponse,
  );
}

function mockItemLookupColorAndSize(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/items\/vestri_b2c\/lookups\/form?(.*)/,
    itemLookupColorAndSizeResponse,
  );
}

function mockItemLookupInputResponse(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/items\/vestri_b2c\/lookups\/form?(.*)/,
    itemLookupInputResponse,
  );
}

function mockMultiCartResponse(mockObj) {
  mockObj.get(
    /(.*)?zoom=carts,carts:element,carts:element:additemstocartform,carts:element:descriptor/,
    itemLookupMultiCartResponse,
  );
}

function mockAllSizeOptions(mockObj) {
  mockObj.post( // large
    /(.*)\/cortex\/itemselections\/[a-zA-Z0-9_]*\/qgqvhjjsgqydioa=\/options\/kzcvgvcsjfpucucqifjektc7knevuri=\/selector\/kzcvgvcsjfpvgsk2ivpuyqksi5cq(.*)/,
    largeMultiSkuSelectionResponse,
  )
    .post( // medium
      /(.*)\/cortex\/itemselections\/[a-zA-Z0-9_]*\/qgqvhjjygm4tkmi=\/options\/kzcvgvcsjfpucucqifjektc7knevuri=\/selector\/kzcvgvcsjfpvgsk2ivpu2rkejfku2(.*)/,
      mediumMultiSkuSelectionResponse,
    )
    .post( // small
      /(.*)\/cortex\/itemselections\/[a-zA-Z0-9_]*\/qgqvhjjygm4tkmi=\/options\/kzcvgvcsjfpucucqifjektc7knevuri=\/selector\/kzcvgvcsjfpvgsk2ivpvgtkbjrga(.*)/,
      smallMultiSkuSelectionResponse,
    );
}

function mockAllColorOptions(mockObj) {
  mockObj
    .post( // Yellow
      /(.*)\/cortex\/itemselections\/[a-zA-Z0-9_]*\/qgqvhjjygm4tkmi=\/options\/kzcvgvcsjfpucucqifjektc7inhuyt2s=\/selector\/kzcvgvcsjfpugt2mj5jf6wkfjrge6vy=(.*)/,
      yellowMultiSkuSelectionResponse,
    )
    .post( // Black
      /(.*)\/cortex\/itemselections\/[a-zA-Z0-9_]*\/qgqvhjjrg44tgmy=\/options\/kzcvgvcsjfpucucqifjektc7inhuyt2s=\/selector\/kzcvgvcsjfpugt2mj5jf6qsmifbuw(.*)/,
      blackMultiSkuSelectionResponse,
    );
}

function mockAddToCart(mockObj) {
  mockObj.post(
    /(.*)\/cortex\/carts\/items\/[a-zA-Z0-9_]*\/[a-zA-Z0-9_=]*\/form/,
    201,
  );
}

function mockItemSelections(mockObj) {
  mockAllSizeOptions(fetchMock);
  mockAllColorOptions(fetchMock);
}

function mockCommonProductDisplayResponses(mockObj) {
  mockAnonLoginResponse(fetchMock);
  mockLookupForm(fetchMock);
  mockAddToCart(fetchMock);
}

export function mockProductDisplayItemMainPlain() {
  fetchMock.restore();
  mockCommonProductDisplayResponses(fetchMock);
  mockItemLookupPlain(fetchMock);
}

export function mockProductDisplayItemMainColorAndSize() {
  fetchMock.restore();
  mockCommonProductDisplayResponses(fetchMock);
  mockItemLookupColorAndSize(fetchMock);
  mockItemSelections(fetchMock);
}

export function mockProductDisplayItemMainInput() {
  fetchMock.restore();
  mockCommonProductDisplayResponses(fetchMock);
  mockItemLookupInputResponse(fetchMock);
}

export function mockProductDisplayItemMainMultiCart() {
  fetchMock.restore();
  mockCommonProductDisplayResponses(fetchMock);
  mockItemLookupPlain(fetchMock);
  mockMultiCartResponse(fetchMock);
}
