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
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { login } from '../utils/AuthService';
import {
  isAnalyticsConfigured, trackAddItemAnalytics, setRemoveAnalytics, sendRemoveFromCartAnalytics,
} from '../utils/Analytics';
import imgPlaceholder from '../images/img-placeholder.png';
import { cortexFetch } from '../utils/Cortex';
/* eslint-disable-next-line import/no-cycle */
import AppModalBundleConfigurationMain from './appmodalbundleconfiguration.main';
import './cart.lineitem.less';

const Config = require('Config');

class CartLineItem extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    item: PropTypes.objectOf(PropTypes.any).isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
    handleErrorMessage: PropTypes.func,
    hideRemoveButton: PropTypes.bool,
  }

  static defaultProps = {
    handleErrorMessage: () => { },
    hideRemoveButton: false,
  }

  constructor(props) {
    super(props);
    const { item } = this.props;
    this.state = {
      quantity: item.quantity,
      openModal: false,
    };
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleQuantityDecrement = this.handleQuantityDecrement.bind(this);
    this.handleQuantityIncrement = this.handleQuantityIncrement.bind(this);
    this.handleMoveToCartBtnClicked = this.handleMoveToCartBtnClicked.bind(this);
    this.handleRemoveBtnClicked = this.handleRemoveBtnClicked.bind(this);
    this.handleConfiguratorAddToCartBtnClicked = this.handleConfiguratorAddToCartBtnClicked.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { quantity } = this.state;
    if (nextProps.item.quantity !== quantity) {
      this.state = {
        quantity: nextProps.item.quantity,
      };
    }
  }

  handleQuantityChange(event) {
    event.preventDefault();
    const { item, handleQuantityChange } = this.props;
    const { quantity } = this.state;
    if (quantity === '') {
      this.setState({ quantity: 1 });
    }
    login().then(() => {
      cortexFetch(item.self.uri,
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
          console.error(error.message);
        });
    });
  }

  handleQuantityDecrement() {
    const { quantity } = this.state;
    if (quantity > 1) {
      const newItemQuantity = parseInt(quantity, 10) - 1;
      this.setState({ quantity: newItemQuantity });
    }
  }

  handleQuantityIncrement() {
    const { quantity } = this.state;
    const newItemQuantity = parseInt(quantity, 10) + 1;
    this.setState({ quantity: newItemQuantity });
  }

  handleConfiguratorAddToCartBtnClicked() {
    const {
      item, history, handleQuantityChange, handleErrorMessage,
    } = this.props;
    handleQuantityChange();
    login().then(() => {
      const addToCartLink = item._addtocartform[0].links.find(link => link.rel === 'addtodefaultcartaction');
      cortexFetch(addToCartLink.uri,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({
            quantity: 1,
          }),
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            history.push('/mybag');
          } else {
            res.json().then((json) => {
              handleErrorMessage(json);
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleMoveToCartBtnClicked() {
    const { item, history } = this.props;
    login().then(() => {
      const moveToCartLink = item._movetocartform[0].links.find(link => link.rel === 'movetocartaction');
      cortexFetch(moveToCartLink.uri,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({
            quantity: 1,
          }),
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            history.push('/mybag');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleRemoveBtnClicked() {
    const {
      item, handleQuantityChange, location, history,
    } = this.props;
    handleQuantityChange();
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
          history.push(location.pathname);
          this.trackAddItemAnalytics();
          handleQuantityChange();
          history.push('/mybag'); // need call push to refresh header shopping cart items count
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleModalOpen() {
    this.setState({
      openModal: true,
    });
  }

  handleModalClose() {
    this.setState({
      openModal: false,
    });
  }

  trackAddItemAnalytics() {
    const { item } = this.props;
    if (isAnalyticsConfigured()) {
      const categoryTag = (item._item[0]._definition[0].details) ? (item._item[0]._definition[0].details.find(detail => detail['display-name'] === 'Tag')) : '';
      trackAddItemAnalytics(item._item[0].self.uri.split(`/items/${Config.cortexApi.scope}/`)[1], item._item[0]._definition[0]['display-name'], item._item[0]._code[0].code, item._price[0]['purchase-price'][0].display, (categoryTag !== undefined && categoryTag !== '') ? categoryTag['display-value'] : '', item.quantity);
      setRemoveAnalytics();
      sendRemoveFromCartAnalytics();
    }
  }

  renderUnitPrice() {
    const { item } = this.props;
    if (item._item && (item._price || item._item[0]._price)) {
      const itemPrice = ((item._price) ? (item._price) : (item._item[0]._price));
      const listPrice = itemPrice[0]['list-price'][0].display;
      const purchasePrice = itemPrice[0]['purchase-price'][0].display;
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
    return (
      <ul className="price-container">
        <li className="cart-unit-purchase-price">
          {}
        </li>
      </ul>
    );
  }

  renderTotalPrice() {
    const { item } = this.props;
    let itemTotal = ((item._total) ? (item._total[0].cost[0].display) : (''));
    if (!itemTotal && item._price) {
      itemTotal = item._price[0]['purchase-price'][0].display;
    }
    return (
      <ul className="price-container">
        <li className="cart-total-list-price is-hidden" data-region="itemListPriceRegion" />
        <li className="cart-total-purchase-price">
          {itemTotal}
        </li>
      </ul>
    );
  }

  renderBundleConfiguration() {
    const { item } = this.props;
    const bundleConfigs = (item._dependentlineitems && item._dependentlineitems[0] && item._dependentlineitems[0]._element) ? (item._dependentlineitems[0]._element) : (null);
    if (bundleConfigs) {
      return bundleConfigs.map(config => (
        (config._item)
          ? (
            <li className="bundle-configuration" key={config}>
              <label htmlFor="option-name" className="option-name">
                {config._item[0]._definition[0]['display-name']}
                &nbsp;
              </label>
            </li>
          )
          : ('')
      ));
    }
    return null;
  }

  renderConfiguration() {
    const { item } = this.props;
    const keys = (item.configuration) ? (Object.keys(item.configuration)) : ('');
    if (keys) {
      return keys.map((key) => {
        if (item.configuration[key] !== '') {
          return (
            <li className="configuration" key={key}>
              <label htmlFor="option-name" className="option-name">
                {key}
                :&nbsp;
              </label>
              <span>
                {item.configuration[key]}
              </span>
            </li>
          );
        }
        return null;
      });
    }
    return null;
  }

  renderOptions() {
    const { item } = this.props;
    let options = (item._item) ? (item._item[0]._definition[0]._options) : ('');
    if (!options && item._definition) {
      options = item._definition[0]._options;
    }
    if (options) {
      return (
        options[0]._element.map(option => (
          <li className="option" key={option['display-name']}>
            <label htmlFor="option-value" className="option-name">
              {option['display-name']}
              :&nbsp;
            </label>
            <span className="option-value">
              {(option._value)
                ? option._value[0]['display-name']
                : ('')}
            </span>
          </li>
        ))
      );
    }
    return null;
  }

  renderPromotions() {
    const { item } = this.props;
    if (item._appliedpromotions) {
      const promotions = item._appliedpromotions[0]._element;
      if (promotions) {
        return (
          promotions.map(promotion => (
            <li key={promotion.name}>
              {(promotion['display-name'])
                ? (promotion['display-name'])
                : (promotion.name)}
              &nbsp;
            </li>
          )));
      }
    }
    return null;
  }

  render() {
    const { item, hideRemoveButton } = this.props;
    const { quantity, openModal } = this.state;
    const itemAvailability = ((item._availability) ? (item._availability) : (item._item[0]._availability));
    let availability = (itemAvailability[0].state === 'AVAILABLE');
    let availabilityString = '';
    if (itemAvailability.length >= 0) {
      if (itemAvailability[0].state === 'AVAILABLE') {
        availability = true;
        availabilityString = intl.get('in-stock');
      } else if (itemAvailability[0].state === 'AVAILABLE_FOR_PRE_ORDER') {
        availability = true;
        availabilityString = intl.get('pre-order');
      } else if (itemAvailability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
        availability = true;
        availabilityString = intl.get('back-order');
      } else {
        availability = false;
        availabilityString = intl.get('out-of-stock');
      }
    }
    let itemCodeString = '';
    let itemDisplayName = '';
    if (item._item) {
      itemCodeString = item._item[0]._code[0].code;
      itemDisplayName = item._item[0]._definition[0]['display-name'];
    }
    if (item._code) {
      itemCodeString = item._code[0].code;
    }
    if (item._definition) {
      itemDisplayName = item._definition[0]['display-name'];
    }
    const featuredProductAttribute = (item._item && item._item[0]._definition[0].details) ? (item._item[0]._definition[0].details.find(detail => detail['display-name'] === 'Featured')) : '';
    return (
      <div id={`cart_lineitem_${itemCodeString}`} className="cart-lineitem-row">
        <div className="thumbnail-col" data-el-value="lineItem.thumbnail">
          {(featuredProductAttribute !== undefined && featuredProductAttribute !== '')
            ? (
              <div className="featured">
                {intl.get('featured')}
              </div>
            )
            : ('')
          }
          <Link to={`/itemdetail/${encodeURIComponent(itemCodeString)}`}>
            <img src={Config.skuImagesUrl.replace('%sku%', itemCodeString)} onError={(e) => { e.target.src = imgPlaceholder; }} alt="Not Available" className="cart-lineitem-thumbnail" />
          </Link>
        </div>
        <div className="title-col" data-el-value="lineItem.displayName">
          <Link to={`/itemdetail/${encodeURIComponent(itemCodeString)}`}>
            {itemDisplayName}
          </Link>
        </div>
        {(item._appliedpromotions && item._appliedpromotions[0]._element)
          ? (
            <div className="promotions-col">
              <ul className="promotions-container">
                <label htmlFor="promotions-container" className="cart-summary-label-col">
                  {intl.get('applied-promotions')}
                  :&nbsp;
                </label>
                {this.renderPromotions()}
              </ul>
            </div>
          )
          : ('')
        }
        <div className="options-col">
          <ul className="options-container">
            {this.renderOptions()}
            {this.renderConfiguration()}
            {this.renderBundleConfiguration()}
          </ul>
        </div>
        <div className="availability-col" data-region="cartLineitemAvailabilityRegion">
          <ul className="availability-container">
            <li className="availability itemdetail-availability-state" data-i18n="AVAILABLE">
              <div>
                {availability && <span className="icon" />}
                {availabilityString}
              </div>
            </li>
            <li className={`category-item-release-date${itemAvailability[0]['release-date'] ? '' : ' is-hidden'}`} data-region="itemAvailabilityDescriptionRegion">
              <label htmlFor="release-date-value" className="releasedate-label">
                {intl.get('expected-release-date')}
                :&nbsp;
              </label>
              <span className="release-date-value">
                {(itemAvailability[0]['release-date']) ? itemAvailability[0]['release-date']['display-value'] : ''}
              </span>
            </li>
          </ul>
        </div>
        <div className="unit-price-col" data-region="cartLineitemUnitPriceRegion">
          <div>
            <div data-region="itemUnitPriceRegion" style={{ display: 'block' }}>
              {this.renderUnitPrice()}
            </div>
          </div>
        </div>
        <div className="total-price-col" data-region="cartLineitemTotalPriceRegion">
          <div>
            <div data-region="itemTotalPriceRegion" style={{ display: 'block' }}>
              {this.renderTotalPrice()}
            </div>
            <div data-region="itemTotalRateRegion" />
          </div>
        </div>
        <form className="quantity-col form-content" onSubmit={this.handleQuantityChange}>
          {(quantity !== undefined) ? [
            <span className="input-group-btn">
              <button type="button" className="quantity-right-plus btn btn-number" data-type="plus" data-field="" onClick={this.handleQuantityIncrement}>
                <span className="glyphicon glyphicon-plus" />
              </button>
              <div className="quantity-col form-content form-content-quantity">
                <input className="product-display-item-quantity-select form-control form-control-quantity" type="number" step="1" min="1" max="9999" value={quantity} onChange={e => this.setState({ quantity: e.target.value })} />
              </div>
              <button type="button" className="quantity-left-minus btn btn-number" data-type="minus" data-field="" onClick={this.handleQuantityDecrement}>
                <span className="glyphicon glyphicon-minus" />
              </button>
            </span>,
            <input key="product-display-item-quantity-update-button" className="product-display-item-quantity-update-button" type="submit" value="Update Quantity" />,
          ] : ('')
          }
        </form>
        {(!hideRemoveButton) ? (
          <div className="remove-btn-col">
            <button className="ep-btn small btn-cart-removelineitem" type="button" onClick={this.handleRemoveBtnClicked}>
              <span className="btn-text">
                {intl.get('remove')}
              </span>
            </button>
          </div>
        ) : ('')
        }
        {(item._addtocartform) ? (
          <div className="move-to-cart-btn-col">
            <button className="ep-btn primary small btn-cart-addToCart" type="button" onClick={this.handleConfiguratorAddToCartBtnClicked}>
              <span className="btn-text">
                {intl.get('add-to-cart')}
              </span>
            </button>
          </div>
        ) : ('')
        }
        {(item._dependentoptions && item._dependentoptions[0] && (item._dependentoptions[0]._element || item._dependentlineitems[0]._element)) ? (
          <div className="configure-btn-col">
            <button className="ep-btn primary small btn-cart-configureBundle" type="button" onClick={() => this.handleModalOpen()}>
              <span className="btn-text">
                {intl.get('configure-bundle')}
              </span>
            </button>
            <AppModalBundleConfigurationMain key={`app-modal-bundle-configuration-main_${itemCodeString}`} handleModalClose={this.handleModalClose} bundleConfigurationItems={item} openModal={openModal} />
          </div>
        ) : ('')
        }
        {(item._movetocartform) ? (
          <div className="move-to-cart-btn-col">
            <button className="ep-btn primary small btn-cart-moveToCart" type="button" onClick={this.handleMoveToCartBtnClicked}>
              <span className="btn-text">
                {intl.get('move-to-cart')}
              </span>
            </button>
          </div>
        ) : ('')
        }
      </div>
    );
  }
}

export default withRouter(CartLineItem);
