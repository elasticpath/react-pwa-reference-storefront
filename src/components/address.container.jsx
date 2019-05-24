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

import React from 'react';
import PropTypes from 'prop-types';

import './address.container.less';

const AddressContainer = (props) => {
  const { name, address } = props;
  return (
    <ul className="address-container">
      <li className="address-name">
        {name['given-name']}&nbsp;
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
};

AddressContainer.propTypes = {
  name: PropTypes.shape({
    'given-name': PropTypes.string,
    'family-name': PropTypes.string,
  }).isRequired,
  address: PropTypes.shape({
    'street-address': PropTypes.string,
    'extended-address': PropTypes.string,
    locality: PropTypes.string,
    region: PropTypes.string,
    'country-name': PropTypes.string,
    'postal-code': PropTypes.string,
  }).isRequired,
};

export default AddressContainer;
