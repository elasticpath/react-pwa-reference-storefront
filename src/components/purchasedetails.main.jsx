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
import PaymentMethodContainer from './paymentmethod.container';
import ShippingOptionContainer from './shippingoption.container';
import AddressContainer from './address.container';

const PurchaseDetailsMain = (props) => {
  const { data } = props;
  const { status } = data;
  let statusString;
  switch (status) {
    case 'CANCELLED':
      statusString = 'Cancelled';
      break;
    case 'COMPLETED':
      statusString = 'Completed';
      break;
    default:
      statusString = 'In Progress';
  }
  const orderNumber = data['purchase-number'];
  const orderTaxTotal = data['tax-total'].display;
  const orderPurchaseDate = data['purchase-date']['display-value'];
  const orderTotal = data['monetary-total'][0].display;
  const renderShippingOption = () => {
    const [option] = data._shipments[0]._element[0]._shippingoption;
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
        <h3>
          Shipping Option
        </h3>
        <ShippingOptionContainer option={option} />
      </div>
    );
  };

  const renderShippingAddress = () => {
    const [shippingAddress] = data._shipments[0]._element[0]._destination;
    const { name, address } = shippingAddress;
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
        <h3>
          Shipping Address
        </h3>
        <AddressContainer name={name} address={address} />
      </div>
    );
  };

  const renderBillingAddress = () => {
    const [billingAddress] = data._billingaddress;
    const { name, address } = billingAddress;
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
        <h3>
          Billing Address
        </h3>
        <AddressContainer name={name} address={address} />
      </div>
    );
  };

  const renderPaymentMethod = () => {
    const displayName = data._paymentmeans[0]._element[0]['display-name'];
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px', verticalAlign: 'top' }}>
        <h3>
          Payment Method
        </h3>
        <PaymentMethodContainer displayName={displayName} />
      </div>
    );
  };

  const renderItem = (purchaseItem) => {
    const { name, quantity } = purchaseItem;
    const subTotal = purchaseItem['line-extension-amount'][0].display;
    const tax = purchaseItem['line-extension-tax'][0].display;
    const itemTotal = purchaseItem['line-extension-total'][0].display;
    const options = purchaseItem._options;
    return (
      <li key={name}>
        <table className="table">
          <tbody>
            <tr>
              <td>
                <label htmlFor="lineItemName">
                  Name:
                </label>
              </td>
              <td>
                <span id="lineItemName">
                  {name}
                </span>
              </td>
            </tr>
            {options && (options[0]._element.map(option => (
              <tr key={option.name}>
                <td>
                  <label htmlFor="option">
                    {option['display-name']}
                  </label>
                </td>
                <td>
                  <span id="option">
                    {option._value[0]['display-name']}
                  </span>
                </td>
              </tr>
            )))}
            <tr>
              <td>
                <label htmlFor="lineItemQuantity">
                  Quantity:
                </label>
              </td>
              <td>
                <span id="lineItemQuantity">
                  {quantity}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="lineItemAmount">
                  Sub-total:
                </label>
              </td>
              <td>
                <span id="lineItemAmount">
                  &nbsp;{subTotal}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="lineItemTax">
                  Tax:
                </label>
              </td>
              <td>
                <span id="lineItemTax">
                  &nbsp;{tax}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="lineItemTotal">
                  Item Total:
                </label>
              </td>
              <td>
                <span id="lineItemTotal">
                  {itemTotal}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </li>
    );
  };

  return (
    <div data-region="purchaseInformationRegion" style={{ display: 'block' }}>
      <div className="purchase-information-container container">
        <div data-region="purchaseSummaryRegion" style={{ display: 'block' }}>
          <div>
            <h3>
              Summary
            </h3>
            <table className="table table-striped">
              <tbody>
                <tr>
                  <td>
                    Status:
                  </td>
                  <td data-el-value="status">
                    {statusString}
                  </td>
                </tr>
                <tr data-el-container="purchaseNumber">
                  <td>
                    Order Number:
                  </td>
                  <td data-el-value="purchaseNumber">
                    {orderNumber}
                  </td>
                </tr>
                <tr data-el-container="taxTotal">
                  <td>
                    Order Tax Total:
                  </td>
                  <td data-el-value="taxTotal">
                    {orderTaxTotal}
                  </td>
                </tr>
                <tr>
                  <td>
                    Order Purchase Date:
                  </td>
                  <td data-el-value="purchaseDate">
                    {orderPurchaseDate}
                  </td>
                </tr>
                <tr data-el-container="orderTotal">
                  <td>
                    Order Total:
                  </td>
                  <td data-el-value="orderTotal">
                    {orderTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="order-options-container" style={{ display: 'block', paddingBottom: '20px' }}>
          {renderShippingOption()}
          {renderShippingAddress()}
          {renderBillingAddress()}
          {renderPaymentMethod()}
        </div>
        <h3>
          Items
        </h3>
        <div data-region="purchaseLineItemsRegion" className="purchase-items-container" style={{ display: 'block' }}>
          <ul className="purchase-items-list">
            {data._lineitems[0]._element.map(renderItem)}
          </ul>
        </div>
      </div>
    </div>
  );
};

PurchaseDetailsMain.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PurchaseDetailsMain;
