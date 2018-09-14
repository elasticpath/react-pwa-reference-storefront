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
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { login } from '../utils/AuthService';
import {
  isAnalyticsConfigured, trackAddItemAnalytics, setRemoveAnalytics, sendRemoveFromCartAnalytics,
} from '../utils/Analytics';
import imgPlaceholder from '../images/img-placeholder.png';
import cortexFetch from '../utils/Cortex';
import './cart.lineitem.less';

const Config = require('Config');

class CartLineItem extends React.Component {
  static propTypes = {
    item: PropTypes.objectOf(PropTypes.any).isRequired,
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
    login().then(() => {
      this.setState({ quantity: newQuantity }, () => {
        cortexFetch(item.self.uri,
          {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({
              quantity: newQuantity,
            }),
          })
          .then(() => {
            handleQuantityChange();
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    });
  }

  handleRemoveBtnClicked() {
    const { item, handleQuantityChange } = this.props;
    login().then(() => {
      cortexFetch(item.self.uri,
        {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(() => {
          if (isAnalyticsConfigured) {
            const categoryTag = (item._item[0]._definition[0].details) ? (item._item[0]._definition[0].details.find(detail => detail['display-name'] === 'Tag')) : '';
            trackAddItemAnalytics(item._item[0].self.uri.split(`/items/${Config.cortexApi.scope}/`)[1], item._item[0]._definition[0]['display-name'], item._item[0]._code[0].code, item._price[0]['purchase-price'][0].display, (categoryTag !== '') ? categoryTag['display-value'] : '', item.quantity);
            setRemoveAnalytics();
            sendRemoveFromCartAnalytics();
          }
          handleQuantityChange();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  renderUnitPrice() {
    const { item } = this.props;
    const listPrice = item._price[0]['list-price'][0].display;
    const purchasePrice = item._price[0]['purchase-price'][0].display;
    if (listPrice !== purchasePrice) {
      return (
        <ul className="price-container">
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
      <ul className="price-container">
        <li className="cart-unit-purchase-price">
          {purchasePrice}
        </li>
      </ul>
    );
  }

  renderTotalPrice() {
    const { item } = this.props;
    return (
      <ul className="price-container">
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
          <li className="option" key={option['display-name']}>
            <label htmlFor="option-value" className="option-name">
              {option['display-name']}
              :&nbsp;
            </label>
            <span className="option-value">
              {option._value[0]['display-name']}
            </span>
          </li>
        ))
      );
    }
    return null;
  }

  render() {
    const { item } = this.props;
    const { quantity } = this.state;
    let availability = (item._availability[0].state === 'AVAILABLE');
    let availabilityString = '';
    if (item._availability.length >= 0) {
      if (item._availability[0].state === 'AVAILABLE') {
        availability = true;
        availabilityString = intl.get('in-stock');
      } else if (item._availability[0].state === 'AVAILABLE_FOR_PRE_ORDER') {
        availability = true;
        availabilityString = intl.get('pre-order');
      } else if (item._availability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
        availability = true;
        availabilityString = intl.get('back-order');
      } else {
        availability = false;
        availabilityString = intl.get('out-of-stock');
      }
    }
    return (
      <tr className="cart-lineitem-row">
        <td className="thumbnail-col" data-el-value="lineItem.thumbnail">
          <Link to={`/itemdetail/${encodeURIComponent(item._item[0].self.uri)}`}>
            <img src={Config.skuImagesUrl.replace('%sku%', item._item[0]._code[0].code)} onError={(e) => { e.target.src = imgPlaceholder; }} alt="Not Available" className="cart-lineitem-thumbnail" />
          </Link>
        </td>
        <td className="title-col" data-el-value="lineItem.displayName">
          <Link to={`/itemdetail/${encodeURIComponent(item._item[0].self.uri)}`}>
            {item._item[0]._definition[0]['display-name']}
          </Link>
        </td>
        <td className="options-col" style={{ display: 'table-cell' }}>
          <ul className="options-container">
            {this.renderOptions()}
          </ul>
        </td>
        <td className="availability-col" data-region="cartLineitemAvailabilityRegion" style={{ display: 'table-cell' }}>
          <ul className="availability-container">
            <li className="availability itemdetail-availability-state" data-i18n="AVAILABLE">
              <div>
                {availability && <span className="icon" />}
                {availabilityString}
              </div>
            </li>
            <li className={`category-item-release-date${item._availability[0]['release-date'] ? '' : ' is-hidden'}`} data-region="itemAvailabilityDescriptionRegion">
              <label htmlFor="release-date-value" className="releasedate-label">
                {intl.get('expected-release-date')}
                :&nbsp;
              </label>
              <span className="release-date-value">
                {(item._availability[0]['release-date']) ? item._availability[0]['release-date']['display-value'] : ''}
              </span>
            </li>
          </ul>
        </td>
        <td className="unit-price-col" data-region="cartLineitemUnitPriceRegion" style={{ display: 'table-cell' }}>
          <div>
            <div data-region="itemUnitPriceRegion" style={{ display: 'block' }}>
              {this.renderUnitPrice()}
            </div>
            <div data-region="itemUnitRateRegion" />
          </div>
        </td>
        <td className="quantity-col" data-el-value="lineItem.quantity">
          <select className="quantity-select form-control" id="select-quantity" name="select-quantity" value={quantity} onChange={this.handleQuantityChange}>
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

        <td className="total-price-col" data-region="cartLineitemTotalPriceRegion" style={{ display: 'table-cell' }}>
          <div>
            <div data-region="itemTotalPriceRegion" style={{ display: 'block' }}>
              {this.renderTotalPrice()}
            </div>
            <div data-region="itemTotalRateRegion" />
          </div>
        </td>

        <td className="remove-btn-col">
          <button className="btn btn-cart-removelineitem" type="button" onClick={this.handleRemoveBtnClicked}>
            <span className="icon" />
            <span className="btn-text">
              {intl.get('remove')}
            </span>
          </button>
        </td>
      </tr>
    );
  }
}

export default CartLineItem;
