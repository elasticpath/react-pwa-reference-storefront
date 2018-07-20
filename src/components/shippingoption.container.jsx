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
