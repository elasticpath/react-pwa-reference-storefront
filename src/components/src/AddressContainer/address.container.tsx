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

import React from 'react';

import './address.container.less';

interface AddressContainerProps {
  /** name data */
    name: {
        'given-name': string,
        'family-name': string,
    },
  /** address data */
    address: {
        'street-address': string,
        'extended-address': string,
        locality: string,
        region: string,
        'country-name': string,
        'postal-code': string,
    },
}

function AddressContainer(props: AddressContainerProps) {
  const { name, address } = props;

  return (
    <ul className="address-container">
      <li className="address-name">
        {name['given-name']}
        &nbsp;
        {name['family-name']}
      </li>
      <li className="address-street-address">
        {address['street-address']}
      </li>
      <li className="address-extended-address">
        {address['extended-address']}
      </li>
      <li>
        <span className="address-city">
          {address.locality}
            ,&nbsp;
        </span>
        <span className="address-region">
          {(address.region)
            ? (
              `${address.region}, `
            ) : ('')}
        </span>
        <span className="address-country">
          {address['country-name']}
                    &nbsp;
        </span>
        <span className="address-postal-code">
          {address['postal-code']}
        </span>
      </li>
    </ul>
  );
}

export default AddressContainer;
