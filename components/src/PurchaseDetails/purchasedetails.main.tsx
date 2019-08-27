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
import QuickOrderMain from '../QuickOrder/quickorder.main';
import ReorderMain from '../Reorder/reorder.main';
import { getConfig } from '../utils/ConfigProvider';
import PaymentMethodContainer from '../PaymentMethodContainer/paymentmethod.container';
import ShippingOptionContainer from '../ShippingOption/shippingoption.container';
import AddressContainer from '../AddressContainer/address.container';
import './purchasedetails.main.less';

let intl = { get: str => str };

interface PurchaseDetailsMainProps {
  data: {
    [key: string]: any
},
onReorderAllProducts?: (...args: any[]) => any,
  itemDetailLink?: string,
  onMoveToCart?: (...args: any[]) => any,
  onConfiguratorAddToCart?: (...args: any[]) => any
}

const PurchaseDetailsMain: React.FunctionComponent<PurchaseDetailsMainProps> = (props: PurchaseDetailsMainProps) => {
  const {
    data, itemDetailLink, onMoveToCart, onConfiguratorAddToCart,
  } = props;
  const { status } = data;
  ({ intl } = getConfig());
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
  const orderNumber = data.purchaseNumber;
  const orderTaxTotal = data.taxTotal.display;
  const orderPurchaseDate = data.purchaseDate.displayValue;
  const orderDiscount = data.discount ? data.discount.discount[0].display : '';
  const orderTotal = data.monetaryTotal[0].display;
  const { shipments } = data;

  const renderShippingOption = () => {
    if (shipments) {
      const option = data.shipments.elements[0].shippingoption;
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
      const shippingAddress = data.shipments.elements[0].destination;
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
    const billingAddress = data.billingaddress;
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
    const postedPayments = data.postedpayments || data.paymentmeans;
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px', verticalAlign: 'top' }}>
        <h3>
          {intl.get('payment-method')}
        </h3>
        {postedPayments.elements.map(postedpayment => (
          <PaymentMethodContainer displayName={postedpayment} />
        ))}
      </div>
    );
  };

  const renderItem = (purchaseItem) => {
    const { name, quantity } = purchaseItem;
    const subTotal = purchaseItem.lineExtensionAmount[0].display;
    const tax = purchaseItem.lineExtensionTax[0].display;
    const itemTotal = purchaseItem.lineExtensionTotal[0].display;
    const bundleConfiguration = purchaseItem.components;
    const { options, configuration } = purchaseItem;
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
            {options && (options.elements.map(option => (
              <tr key={option.name}>
                <td>
                  <label htmlFor="option">
                    {option.displayName}
                  </label>
                </td>
                <td>
                  <span id="option">
                    {option.value.displayName}
                  </span>
                </td>
              </tr>
            )))}
            {configuration.elements && (configuration.elements.map(config => (
              <tr key={config.name}>
                <td>
                  <label htmlFor="option">
                    {config.displayName}
                  </label>
                </td>
                <td>
                  <span id="option">
                    {config.value.displayName}
                  </span>
                </td>
              </tr>
            )))}
            {bundleConfiguration && (bundleConfiguration.elements.map(config => (
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
        {(purchaseItem) ? (
          <QuickOrderMain isBuyItAgain productData={purchaseItem} itemDetailLink={itemDetailLink} onMoveToCart={onMoveToCart} onConfiguratorAddToCart={onConfiguratorAddToCart} />
        ) : ('')
        }
      </li>
    );
  };

  const canReorder = productsData => productsData.defaultcart && productsData.defaultcart.additemstocartform;

  const handleReorderAll = () => {
    const { onReorderAllProducts } = props;
    onReorderAllProducts();
  };

  return (
    <div data-region="purchaseInformationRegion" style={{ display: 'block' }}>
      <div className="purchase-information-container container">
        <div data-region="purchaseSummaryRegion" style={{ display: 'block' }}>
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
        <div data-region="purchaseLineItemsRegion" className="purchase-items-container" style={{ display: 'block' }}>
          <ul className="purchase-items-list">
            {data.lineitems.elements.map(renderItem)}
          </ul>
        </div>
      </div>
    </div>
  );
};

PurchaseDetailsMain.defaultProps = {
  onReorderAllProducts: () => {},
  itemDetailLink: '',
  onMoveToCart: () => {},
  onConfiguratorAddToCart: () => {},
};

export default PurchaseDetailsMain;
