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
import fetchGeoDataResponse from './MockHttpResponses/fetchGeoData_response.json';
import fetchAddressFormResponse from './MockHttpResponses/fetchAddressForm_response.json';
import profileAddressResponse from './MockHttpResponses/profile_address_response.json';
import publicUserAuthenticationResponse from './MockHttpResponses/public_user_authentication_response.json';

// TODO: Need to check that the request contains a particular body.

export function mockCountryDataAPI() {
  fetchMock
    .restore()
    .mock(
      '/cortex/oauth2/tokens',
      publicUserAuthenticationResponse,
    )
    .mock(
      /* eslint-disable max-len */
      '/cortex/geographies/vestri/countries/?zoom=element,element:regions,element:regions:element,countries:element,countries:element:regions,countries:element:regions:element',
      fetchGeoDataResponse,
    )
    .mock(
      '/cortex/?zoom=defaultprofile:addresses:addressform',
      fetchAddressFormResponse,
    )
    .mock(
      '/cortex/addresses/vestri/test',
      profileAddressResponse,
    );
}
