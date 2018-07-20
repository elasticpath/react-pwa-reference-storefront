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
import OrderTableLineItem from './ordertable.lineitem';

const OrderTableMain = (props) => {
  const { data } = props;
  return (
    <div className="order-main-inner table-responsive">
      <table className="table">
        <thead className="order-lineitem-table-headings">
          <tr>
            <th className="order-heading-product">
              <span className="lineitem-asset-col">
                Product
              </span>
            </th>
            <th className="order-heading-name">
              Name
            </th>
            <th className="order-heading-options">
              Options
            </th>
            <th className="order-heading-quantity">
              Quantity
            </th>
            <th className="order-heading-item-total">
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {data._lineitems[0]._element.map(product => (
            <OrderTableLineItem key={product._item[0]._code[0].code} item={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

OrderTableMain.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OrderTableMain;
