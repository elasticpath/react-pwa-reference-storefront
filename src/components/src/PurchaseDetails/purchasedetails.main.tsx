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
import intl from 'react-intl-universal';
import QuickOrderMain from '../QuickOrder/quickorder.main';
import ReorderMain from '../Reorder/reorder.main';
import PaymentMethodContainer from '../PaymentMethodContainer/paymentmethod.container';
import ShippingOptionContainer from '../ShippingOption/shippingoption.container';
import AddressContainer from '../AddressContainer/address.container';
import './purchasedetails.main.less';

interface PurchaseDetailsMainProps {
  /** purchase data */
  data: {
    [key: string]: any
  },
  /** handle reorder all products */
  onReorderAllProducts?: (...args: any[]) => any,
  /** item detail link */
  itemDetailLink?: string,
  /** handle move to cart */
  onMoveToCart?: (...args: any[]) => any,
  /** handle configurator add to cart */
  onConfiguratorAddToCart?: (...args: any[]) => any
}

function PurchaseDetailsMain(props: PurchaseDetailsMainProps) {
  const {
    data, itemDetailLink, onMoveToCart, onConfiguratorAddToCart,
  } = props;
  const { status } = data;
  let statusString;
  switch (status) {
    case 'CANCELLED':
      statusString = intl.get('cancelled');
      break;
    case 'COMPLETED':
      statusString = intl.get('completed');
      break;
    default:
      statusString = intl.get('in-progress');
  }
  const orderNumber = data['purchase-number'];
  const orderTaxTotal = data['tax-total'].display;
  const orderPurchaseDate = data['purchase-date']['display-value'];
  const orderDiscount = data._discount[0].discount[0].display;
  const orderTotal = data['monetary-total'][0].display;
  const shipments = data._shipments;

  const renderShippingOption = () => {
    if (shipments) {
      const [option] = data._shipments[0]._element[0]._shippingoption;
      return (
        <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
          <h3>
            {intl.get('shipping-option')}
          </h3>
          <ShippingOptionContainer option={option} />
        </div>
      );
    }
    return null;
  };

  const renderShippingAddress = () => {
    if (shipments) {
      const [shippingAddress] = data._shipments[0]._element[0]._destination;
      const { name, address } = shippingAddress;
      return (
        <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
          <h3>
            {intl.get('shipping-address')}
          </h3>
          <AddressContainer name={name} address={address} />
        </div>
      );
    }
    return null;
  };

  const renderBillingAddress = () => {
    const [billingAddress] = data._billingaddress;
    const { name, address } = billingAddress;
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
        <h3>
          {intl.get('billing-address')}
        </h3>
        <AddressContainer name={name} address={address} />
      </div>
    );
  };

  const renderPaymentMethod = () => {
    const postedPayments = data._postedpayments || data._paymentmeans || data._paymentinstruments;
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px', verticalAlign: 'top' }}>
        <h3>
          {intl.get('payment-method')}
        </h3>
        {postedPayments[0]._element.map(postedpayment => (
          <PaymentMethodContainer displayName={postedpayment} key={postedpayment['display-name'] || postedpayment.name} />
        ))}
      </div>
    );
  };

  const renderItem = (purchaseItem) => {
    const { name, quantity } = purchaseItem;
    const subTotal = purchaseItem['line-extension-amount'][0].display;
    const tax = purchaseItem['line-extension-tax'][0].display;
    const itemTotal = purchaseItem['line-extension-total'][0].display;
    const options = purchaseItem._options;
    const configuration = purchaseItem._configuration;
    const bundleConfiguration = purchaseItem._components;
    return (
      <li key={name}>
        <table className="table">
          <tbody>
            <tr>
              <td>
                <label htmlFor="lineItemName">
                  {intl.get('name')}
                  :
                </label>
              </td>
              <td>
                <span id="lineItemName">
                  {name}
                </span>
              </td>
            </tr>
            {options && options[0]._element && (options[0]._element.map(option => (
              <tr key={option.name}>
                <td>
                  <label htmlFor="option">
                    {option['display-name']}
                  </label>
                </td>
                <td>
                  <span id="option">
                    {option._value && option._value[0]['display-name']}
                  </span>
                </td>
              </tr>
            )))}
            {configuration && (configuration[0]._element.map(config => (
              <tr key={config.name}>
                <td>
                  <label htmlFor="option">
                    {config['display-name']}
                  </label>
                </td>
                <td>
                  <span id="option">
                    {config._value[0]['display-name']}
                  </span>
                </td>
              </tr>
            )))}
            {bundleConfiguration && (bundleConfiguration[0]._element.map(config => (
              <tr key={config.name}>
                <td>
                  <span id="option">
                    {config.name}
                  </span>
                </td>
              </tr>
            )))}
            <tr>
              <td>
                <label htmlFor="lineItemQuantity">
                  {intl.get('quantity')}
                  :
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
                  {intl.get('sub-total')}
                  :
                </label>
              </td>
              <td>
                <span id="lineItemAmount">
                  &nbsp;
                  {subTotal}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="lineItemTax">
                  {intl.get('tax')}
                  :
                </label>
              </td>
              <td>
                <span id="lineItemTax">
                  &nbsp;
                  {tax}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="lineItemTotal">
                  {intl.get('item-total')}
                  :
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
        {(purchaseItem._item) ? (
          <QuickOrderMain isBuyItAgain productData={purchaseItem._item[0]} itemDetailLink={itemDetailLink} onMoveToCart={onMoveToCart} onConfiguratorAddToCart={onConfiguratorAddToCart} />
        ) : ('')
        }
      </li>
    );
  };

  const canReorder = productsData => productsData._defaultcart && productsData._defaultcart[0]._additemstocartform;

  const handleReorderAll = () => {
    const { onReorderAllProducts } = props;
    onReorderAllProducts();
  };

  return (
    <div data-region="purchaseInformationRegion">
      <div className="purchase-information-container container">
        <div data-region="purchaseSummaryRegion">
          <div>
            <h3 className="purchase-summary-title">
              {intl.get('summary')}
            </h3>
            {(canReorder(data)) ? (
              <div className="purchase-reorder">
                <ReorderMain productsData={data} onReorderAll={handleReorderAll} itemDetailLink={itemDetailLink} />
              </div>
            ) : ('')}
            <table className="table table-striped">
              <tbody>
                <tr>
                  <td>
                    {intl.get('status')}
                    :
                  </td>
                  <td data-el-value="status">
                    {statusString}
                  </td>
                </tr>
                <tr data-el-container="purchaseNumber">
                  <td>
                    {intl.get('order-number')}
                    :
                  </td>
                  <td data-el-value="purchaseNumber">
                    {orderNumber}
                  </td>
                </tr>
                <tr data-el-container="taxTotal">
                  <td>
                    {intl.get('order-tax-total')}
                    :
                  </td>
                  <td data-el-value="taxTotal">
                    {orderTaxTotal}
                  </td>
                </tr>
                <tr>
                  <td>
                    {intl.get('order-purchase-date')}
                    :
                  </td>
                  <td data-el-value="purchaseDate">
                    {orderPurchaseDate}
                  </td>
                </tr>
                <tr data-el-container="orderDiscount">
                  <td>
                    {intl.get('todays-discount')}
                    :
                  </td>
                  <td data-el-value="orderDiscount">
                    {orderDiscount}
                  </td>
                </tr>
                <tr data-el-container="orderTotal">
                  <td>
                    {intl.get('order-total')}
                    :
                  </td>
                  <td data-el-value="orderTotal">
                    {orderTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="order-options-container" style={{ display: 'block', paddingBottom: 'px' }}>
          {renderShippingOption()}
          {renderShippingAddress()}
          {renderBillingAddress()}
          {renderPaymentMethod()}
        </div>
        <h3>
          {intl.get('items')}
        </h3>
        <div data-region="purchaseLineItemsRegion" className="purchase-items-container">
          <ul className="purchase-items-list">
            {data._lineitems[0]._element.map(renderItem)}
          </ul>
        </div>
      </div>
    </div>
  );
}

PurchaseDetailsMain.defaultProps = {
  onReorderAllProducts: () => {},
  itemDetailLink: '',
  onMoveToCart: () => {},
  onConfiguratorAddToCart: () => {},
};

export default PurchaseDetailsMain;
