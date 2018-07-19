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
import { Link } from 'react-router-dom';
import { login } from '../utils/AuthService';
import imgPlaceholder from '../images/img-placeholder.png';

const Config = require('Config');

class CartLineItem extends React.Component {
  static propTypes = {
    item: PropTypes.objectOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool.isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { item } = this.props;
    this.state = {
      quantity: item.quantity,
    };
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleRemoveBtnClicked = this.handleRemoveBtnClicked.bind(this);
  }

  handleQuantityChange(event) {
    event.preventDefault();
    const newQuantity = event.target.value;
    const { item, handleQuantityChange } = this.props;
    const { quantity } = this.state;
    login().then(() => {
      this.setState({ quantity: newQuantity }, () => {
        fetch(item.self.href,
          {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({
              quantity,
            }),
          })
          .then(() => {
            handleQuantityChange();
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      });
    });
  }

  handleRemoveBtnClicked() {
    const { item, handleQuantityChange } = this.props;
    login().then(() => {
      fetch(item.self.href,
        {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(() => {
          handleQuantityChange();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  renderUnitPrice() {
    const { item, isLoading } = this.props;
    const listPrice = item._price[0]['list-price'][0].display;
    const purchasePrice = item._price[0]['purchase-price'][0].display;
    if (isLoading) {
      return (
        <div className="miniLoader" />
      );
    } if (listPrice !== purchasePrice) {
      return (
        <ul className="cart-lineitem-price-container">
          <li className="cart-unit-list-price" data-region="itemListPriceRegion">
            {listPrice}
          </li>
          <li className="cart-unit-purchase-price">
            {purchasePrice}
          </li>
        </ul>
      );
    }
    return (
      <ul className="cart-lineitem-price-container">
        <li className="cart-unit-purchase-price">
          {purchasePrice}
        </li>
      </ul>
    );
  }

  renderTotalPrice() {
    const { isLoading, item } = this.props;
    if (isLoading) {
      return (
        <div className="miniLoader" />
      );
    }
    return (
      <ul className="cart-lineitem-price-container">
        <li className="cart-total-list-price is-hidden" data-region="itemListPriceRegion" />
        <li className="cart-total-purchase-price">
          {item._total[0].cost[0].display}
        </li>
      </ul>
    );
  }

  renderOptions() {
    const { item } = this.props;
    const options = item._item[0]._definition[0]._options;
    if (options) {
      return (
        options[0]._element.map(option => (
          <li className="cart-lineitem-option" key={`_${Math.random().toString(36).substr(2, 9)}`}>
            <label htmlFor="cart-lineitem-option-value" className="cart-lineitem-option-name">
              {option['display-name']}
              :&nbsp;
            </label>
            <span className="cart-lineitem-option-value">
              {option._value[0]['display-name']}
            </span>
          </li>
        ))
      );
    }
    return null;
  }

  render() {
    const { item, isLoading } = this.props;
    const { quantity } = this.state;
    let availability = (item._availability[0].state === 'AVAILABLE');
    let availabilityString = '';
    if (item._availability.length >= 0) {
      if (item._availability[0].state === 'AVAILABLE') {
        availability = true;
        availabilityString = 'In Stock';
      } else if (item._availability[0].state === 'AVAILABLE_FOR_PRE_ORDER') {
        availability = true;
        availabilityString = 'Pre-order';
      } else if (item._availability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
        availability = true;
        availabilityString = 'Back-order';
      } else {
        availability = false;
        availabilityString = 'Out of Stock';
      }
    }
    return (
      <tr>
        <td className="cart-lineitem-thumbnail-col" data-el-value="lineItem.thumbnail">
          <img src={Config.skuImagesS3Url.replace('%sku%', item._item[0]._code[0].code)} onError={(e) => { e.target.src = imgPlaceholder; }} alt="Not Available" className="cart-lineitem-thumbnail" />
        </td>
        <td className="cart-lineitem-title-col" data-el-value="lineItem.displayName">
          <Link to={`/itemdetail/${encodeURIComponent(item._item[0].self.href)}`}>
            {item._item[0]._definition[0]['display-name']}
          </Link>
        </td>
        <td className="cart-lineitem-options-col" style={{ display: 'table-cell' }}>
          <ul className="cart-lineitem-options-container">
            {this.renderOptions()}
          </ul>
        </td>
        <td className="cart-lineitem-availability-col" data-region="cartLineitemAvailabilityRegion" style={{ display: 'table-cell' }}>
          <ul className="cart-lineitem-availability-container">
            <li className="cart-lineitem-availability itemdetail-availability-state" data-i18n="AVAILABLE">
              <div>
                {availability && <span className="icon" />}
                {availabilityString}
              </div>
            </li>
            <li className={`category-item-release-date${item._availability[0]['release-date'] ? '' : ' is-hidden'}`} data-region="itemAvailabilityDescriptionRegion">
              <label htmlFor="cart-lineitem-release-date-value" className="cart-lineitem-releasedate-label">
                Expected Release Date:&nbsp;
              </label>
              <span className="cart-lineitem-release-date-value">
                {(item._availability[0]['release-date']) ? item._availability[0]['release-date']['display-value'] : ''}
              </span>
            </li>
          </ul>
        </td>

        <td className="cart-lineitem-unit-price-col" data-region="cartLineitemUnitPriceRegion" style={{ display: 'table-cell' }}>
          <div>
            <div data-region="itemUnitPriceRegion" style={{ display: 'block' }}>
              {this.renderUnitPrice()}
            </div>
            <div data-region="itemUnitRateRegion" />
          </div>
        </td>

        <td className="cart-lineitem-quantity-col" data-el-value="lineItem.quantity">
          <select className="cart-lineitem-quantity-select form-control" id="cart-lineItem-select-quantity" name="cart-lineItem-select-quantity" disabled={isLoading} value={quantity} onChange={this.handleQuantityChange}>
            <option value="0">
              0
            </option>
            <option value="1">
              1
            </option>
            <option value="2">
              2
            </option>
            <option value="3">
              3
            </option>
            <option value="4">
              4
            </option>
            <option value="5">
              5
            </option>
            <option value="6">
              6
            </option>
            <option value="7">
              7
            </option>
            <option value="8">
              8
            </option>
            <option value="9">
              9
            </option>
            <option value="10">
              10
            </option>
          </select>
        </td>

        <td className="cart-lineitem-total-price-col" data-region="cartLineitemTotalPriceRegion" style={{ display: 'table-cell' }}>
          <div>
            <div data-region="itemTotalPriceRegion" style={{ display: 'block' }}>
              {this.renderTotalPrice()}
            </div>
            <div data-region="itemTotalRateRegion" />
          </div>
        </td>

        <td className="cart-lineitem-remove-btn-col">
          <button className="btn btn-cart-removelineitem" type="button" disabled={isLoading} onClick={this.handleRemoveBtnClicked}>
            <span className="icon" />
            <span className="btn-text">
              Remove
            </span>
          </button>
        </td>
      </tr>
    );
  }
}

export default CartLineItem;
