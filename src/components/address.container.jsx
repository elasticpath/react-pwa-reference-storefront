/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

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
          {address.region}
          ,&nbsp;
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
