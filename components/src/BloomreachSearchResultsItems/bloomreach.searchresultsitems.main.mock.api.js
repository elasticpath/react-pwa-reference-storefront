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
import getSearchFromResponse from './MockHttpResponses/GET/bloomreach_getKeywordSearch_response.json';

function mockGetSearchForm(mock) {
  mock.get(
    'http://core.dxpapi.com/api/v1/core/?account_id=6226&auth_key=fcao6uq86z58xup0&domain_key=elastic_path&request_id=1239723156472&_br_uid_2=uid%3D8030319374785%3Av%3D11.8%3Ats%3D1536857546532%3Ahc%3D111&url=www.bloomique.com&ref_url=www.bloomique.com&request_type=search&rows=10&start=0&facet.limit=20&fl=pid%2Ctitle%2Cbrand%2Cprice%2Csale_price%2Cpromotions%2Cthumb_image%2Csku_thumb_images%2Csku_swatch_images%2Csku_color_group%2Curl%2Cprice_range%2Csale_price_range%2Cdescription&q=x-class&null&search_type=keyword',
    getSearchFromResponse,
  );
}

// eslint-disable-next-line import/prefer-default-export
export function mockSearchResults() {
  fetchMock.restore();
  mockGetSearchForm(fetchMock);
}
