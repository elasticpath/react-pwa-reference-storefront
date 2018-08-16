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

const ShippingOptionContainer = (props) => {
  const { option } = props;
  return (
    <ul className="shipping-option-container">
      <li className="shippingOptionDisplayName">
        {option['display-name']}
      </li>
      <li className="shippingOptionCarrier">
        {option.carrier}
      </li>
      <li className="shippingOptionCost">
        {option.cost[0].display}
      </li>
    </ul>
  );
};

ShippingOptionContainer.propTypes = {
  option: PropTypes.shape({
    'display-name': PropTypes.string,
    carrier: PropTypes.string,
    cost: PropTypes.arrayOf(PropTypes.shape({
      display: PropTypes.string,
    })),
  }).isRequired,
};

export default ShippingOptionContainer;
