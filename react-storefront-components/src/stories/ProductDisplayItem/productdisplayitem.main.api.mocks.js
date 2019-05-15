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
import fetchMock from 'fetch-mock';
import colorSizeOptionCortexResponse from './MockHttpResponses/color_size_option_cortex_response.json';
import b2bProductResponse from './MockHttpResponses/b2b_product_cortex_response.json';
import itemLookupFormResponse from './MockHttpResponses/itemlookup_form_response.json';
import publicUserAuthenticationResponse from './MockHttpResponses/public_user_authentication_response.json';

// TODO: Need to check that the request contains a particular body.
export function mockSizeAndColorProductAPI() {
  fetchMock
    .restore()
    .mock(
      'http://localhost:9080/cortex/oauth2/tokens',
      publicUserAuthenticationResponse,
    )
    .mock(
      'http://localhost:9080/cortex/?zoom=lookups:itemlookupform',
      itemLookupFormResponse,
    )
    .mock(
      /* eslint-disable max-len */
      'http://localhost:9080/cortex/items/vestri_b2c/lookups/form?zoom=availability,addtocartform,addtowishlistform,price,rate,definition,definition:assets:element,definition:options:element,definition:options:element:value,definition:options:element:selector:choice,definition:options:element:selector:chosen,definition:options:element:selector:choice:description,definition:options:element:selector:chosen:description,definition:options:element:selector:choice:selector,definition:options:element:selector:chosen:selector,definition:options:element:selector:choice:selectaction,definition:options:element:selector:chosen:selectaction,definition:components,definition:components:element,definition:components:element:code,definition:components:element:standaloneitem,definition:components:element:standaloneitem:code,definition:components:element:standaloneitem:definition,definition:components:element:standaloneitem:availability,recommendations,recommendations:crosssell,recommendations:recommendation,recommendations:replacement,recommendations:upsell,recommendations:warranty,recommendations:crosssell:element:code,recommendations:recommendation:element:code,recommendations:replacement:element:code,recommendations:upsell:element:code,recommendations:warranty:element:code,recommendations:crosssell:element:definition,recommendations:recommendation:element:definition,recommendations:replacement:element:definition,recommendations:upsell:element:definition,recommendations:warranty:element:definition,recommendations:crosssell:element:price,recommendations:recommendation:element:price,recommendations:replacement:element:price,recommendations:upsell:element:price,recommendations:warranty:element:price,recommendations:crosssell:element:availability,recommendations:recommendation:element:availability,recommendations:replacement:element:availability,recommendations:upsell:element:availability,recommendations:warranty:element:availability,code&followlocation=true',
      colorSizeOptionCortexResponse,
    );
}

export function mockB2BProductAPI() {
  fetchMock
    .restore()
    .mock(
      'http://localhost:9080/cortex/oauth2/tokens',
      publicUserAuthenticationResponse,
    )
    .mock(
      'http://localhost:9080/cortex/?zoom=lookups:itemlookupform',
      itemLookupFormResponse,
    )
    .mock(
      /* eslint-disable max-len */
      'http://localhost:9080/cortex/items/vestri_b2c/lookups/form?zoom=availability,addtocartform,addtowishlistform,price,rate,definition,definition:assets:element,definition:options:element,definition:options:element:value,definition:options:element:selector:choice,definition:options:element:selector:chosen,definition:options:element:selector:choice:description,definition:options:element:selector:chosen:description,definition:options:element:selector:choice:selector,definition:options:element:selector:chosen:selector,definition:options:element:selector:choice:selectaction,definition:options:element:selector:chosen:selectaction,definition:components,definition:components:element,definition:components:element:code,definition:components:element:standaloneitem,definition:components:element:standaloneitem:code,definition:components:element:standaloneitem:definition,definition:components:element:standaloneitem:availability,recommendations,recommendations:crosssell,recommendations:recommendation,recommendations:replacement,recommendations:upsell,recommendations:warranty,recommendations:crosssell:element:code,recommendations:recommendation:element:code,recommendations:replacement:element:code,recommendations:upsell:element:code,recommendations:warranty:element:code,recommendations:crosssell:element:definition,recommendations:recommendation:element:definition,recommendations:replacement:element:definition,recommendations:upsell:element:definition,recommendations:warranty:element:definition,recommendations:crosssell:element:price,recommendations:recommendation:element:price,recommendations:replacement:element:price,recommendations:upsell:element:price,recommendations:warranty:element:price,recommendations:crosssell:element:availability,recommendations:recommendation:element:availability,recommendations:replacement:element:availability,recommendations:upsell:element:availability,recommendations:warranty:element:availability,code&followlocation=true',
      b2bProductResponse,
    );
}
