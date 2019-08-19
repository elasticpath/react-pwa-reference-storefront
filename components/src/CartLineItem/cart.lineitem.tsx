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
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import * as cortex from '@elasticpath/cortex-client';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import imgPlaceholder from '../images/img_missing_horizontal@2x.png';
/* eslint-disable-next-line import/no-cycle */
import AppModalBundleConfigurationMain from '../AppModalBundleConfiguration/appmodalbundleconfiguration.main';
import { ClientContext } from '../ClientContext';

import './cart.lineitem.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface CartLineItemProps {
  item: { [key: string]: any },
  handleQuantityChange: (...args: any[]) => any,
  handleErrorMessage?: (...args: any[]) => any,
  hideRemoveButton?: boolean,
  hideAddToBagButton?: boolean,
  itemQuantity?: number,
  featuredProductAttribute?: boolean,
  onConfiguratorAddToCart?: (...args: any[]) => any,
  onMoveToCart?: (...args: any[]) => any,
  onRemove?: (...args: any[]) => any,
  itemDetailLink?: string,
}

interface CartLineItemState {
  quantity: any,
  openModal: boolean,
}

class CartLineItem extends React.Component<CartLineItemProps, CartLineItemState> {
  static contextType = ClientContext;

  static defaultProps = {
    handleErrorMessage: () => { },
    hideRemoveButton: false,
    itemQuantity: 1,
    featuredProductAttribute: false,
    hideAddToBagButton: false,
    onConfiguratorAddToCart: () => { },
    onMoveToCart: () => { },
    onRemove: () => { },
    itemDetailLink: '',
  };

  client: cortex.IClient;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
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

  componentDidMount() {
    this.client = this.context;
  }

  componentWillReceiveProps(nextProps) {
    const { quantity } = this.state;
    if (nextProps.item.quantity !== quantity) {
      this.setState({
        quantity: nextProps.item.quantity,
      });
    }
  }

  async handleQuantityChange(event) {
    event.preventDefault();
    const { item, handleQuantityChange } = this.props;
    const { quantity } = this.state;
    if (quantity === '') {
      this.setState({ quantity: '1' });
    }
    await this.client.lineItem(item.uri).update({ quantity })
      .then(() => {
        handleQuantityChange();
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

  // Doesn't work
  async handleConfiguratorAddToCartBtnClicked() {
    const {
      item, handleQuantityChange, handleErrorMessage, itemQuantity, onConfiguratorAddToCart,
    } = this.props;
    handleQuantityChange();
    const quantity = itemQuantity || 1;
    const addToCartFormUri = item.uri;

    const itemRes = await this.client.item(addToCartFormUri).fetch({ addtocartform: {} });

    itemRes.addtocartform({ quantity }).fetch()
      .then((res) => {
        onConfiguratorAddToCart();
      })
      .catch((error) => {
        handleErrorMessage(error.message);
      });
  }

  async handleMoveToCartBtnClicked() {
    const { item, onMoveToCart } = this.props;
    const wishListRes = await this.client.wishlistLineItem(item.self.uri).fetch({ movetocartform: {} });

    wishListRes.movetocartform({ quantity: 1 }).fetch({})
      .then(() => {
        onMoveToCart();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  handleRemoveBtnClicked() {
    const {
      item, handleQuantityChange, onRemove,
    } = this.props;
    handleQuantityChange();
    this.client.availabilityForCartLineItem(item.uri).delete()
      .then(() => {
        handleQuantityChange();
        onRemove();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
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

  renderUnitPrice() {
    const { item } = this.props;
    if (item.item && (item.price || item.item.price)) {
      const itemPrice = ((item.price) ? (item.price) : (item.item.price));
      const listPrice = itemPrice.listPrice.display;
      const purchasePrice = itemPrice.purchasePrice.display;
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
    let itemTotal = ((item.total) ? (item.total.cost[0].display) : (''));
    if (!itemTotal && item.price) {
      itemTotal = item.price.purchasePrice.display;
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
    const bundleConfigs = (item.dependentlineitems && item.dependentlineitems && item.dependentlineitems.elements) ? (item.dependentlineitems.elements) : (null);
    if (bundleConfigs) {
      return bundleConfigs.map(config => (
        (config.item)
          ? (
            <li className="bundle-configuration" key={config}>
              <label htmlFor="option-name" className="option-name">
                {config.item.definition.displayName}
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
    let options = (item.item) ? (item.item.definition.options) : ('');
    if (!options && item.definition) {
      // eslint-disable-next-line prefer-destructuring
      options = item.definition.options;
    }
    if (options) {
      return (
        options.elements.map(option => (
          <li className="option" key={option.displayName}>
            <label htmlFor="option-value" className="option-name">
              {option.displayName}
              :&nbsp;
            </label>
            <span className="option-value">
              {(option.value)
                ? option.value.displayName
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
    if (item.appliedpromotions) {
      const promotions = item.appliedpromotions.elements;
      if (promotions) {
        return (
          promotions.map(promotion => (
            <li key={promotion.name}>
              {(promotion.displayName)
                ? (promotion.displayName)
                : (promotion.name)}
              &nbsp;
            </li>
          )));
      }
    }
    return null;
  }

  render() {
    const {
      item,
      hideRemoveButton,
      featuredProductAttribute,
      hideAddToBagButton,
      itemDetailLink,
      onConfiguratorAddToCart,
      onRemove,
    } = this.props;
    const { quantity, openModal } = this.state;
    const itemAvailability = ((item.availability) ? (item.availability) : (item.item.availability));
    let availability = (itemAvailability.state === 'AVAILABLE');
    let availabilityString = '';
    if (itemAvailability.state) {
      if (itemAvailability.state === 'AVAILABLE') {
        availability = true;
        availabilityString = intl.get('in-stock');
      } else if (itemAvailability.state === 'AVAILABLE_FOR_PRE_ORDER') {
        availability = true;
        availabilityString = intl.get('pre-order');
      } else if (itemAvailability.state === 'AVAILABLE_FOR_BACK_ORDER') {
        availability = true;
        availabilityString = intl.get('back-order');
      } else {
        availability = false;
        availabilityString = intl.get('out-of-stock');
      }
    }
    let itemCodeString = '';
    let itemDisplayName = '';
    if (item.item) {
      itemCodeString = item.item.code.code;
      itemDisplayName = item.item.definition.displayName;
    }
    if (item.code) {
      itemCodeString = item.code.code;
    }
    if (item.definition) {
      itemDisplayName = item.definition.displayName;
    }
    return (
      <div id={`cart_lineitem_${itemCodeString}`} className="cart-lineitem-row">
        <div className="thumbnail-col" data-el-value="lineItem.thumbnail">
          {(featuredProductAttribute)
            ? (
              <div className="featured">
                {intl.get('featured')}
              </div>
            )
            : ('')
          }
          <Link to={`${itemDetailLink}/${encodeURIComponent(itemCodeString)}`}>
            <img src={Config.skuImagesUrl.replace('%sku%', itemCodeString)} onError={(e) => { const element: any = e.target; element.src = imgPlaceholder; }} alt="Not Available" className="cart-lineitem-thumbnail" />
          </Link>
        </div>
        <div className="title-col" data-el-value="lineItem.displayName">
          <Link to={`${itemDetailLink}/${encodeURIComponent(itemCodeString)}`}>
            {itemDisplayName}
          </Link>
        </div>
        {(item.appliedpromotions && item.appliedpromotions.elements)
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
            <li className={`category-item-release-date${itemAvailability.releaseDate ? '' : ' is-hidden'}`} data-region="itemAvailabilityDescriptionRegion">
              <label htmlFor="release-date-value" className="releasedate-label">
                {intl.get('expected-release-date')}
                :&nbsp;
              </label>
              <span className="release-date-value">
                {(itemAvailability.releaseDate) ? itemAvailability.releaseDate.displayValue : ''}
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
              <button type="button" className="quantity-left-minus btn btn-number" data-type="minus" data-field="" onClick={this.handleQuantityDecrement}>
                <span className="glyphicon glyphicon-minus" />
              </button>
              <div className="quantity-col form-content form-content-quantity">
                <input className="product-display-item-quantity-select form-control form-control-quantity" type="number" step="1" min="1" max="9999" value={quantity} onChange={e => this.setState({ quantity: e.target.value })} />
              </div>
              <button type="button" className="quantity-right-plus btn btn-number" data-type="plus" data-field="" onClick={this.handleQuantityIncrement}>
                <span className="glyphicon glyphicon-plus" />
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
        {(item.addtocartform && !hideAddToBagButton) ? (
          <div className="move-to-cart-btn-col">
            <button className="ep-btn primary small btn-cart-addToCart" type="button" onClick={this.handleConfiguratorAddToCartBtnClicked}>
              <span className="btn-text">
                {intl.get('add-to-cart')}
              </span>
            </button>
          </div>
        ) : ('')
        }
        {(item.dependentoptions && item.dependentoptions && (item.dependentoptions.elements || item.dependentlineitems.elements)) ? (
          <div className="configure-btn-col">
            <button className="ep-btn primary small btn-cart-configureBundle" type="button" onClick={() => this.handleModalOpen()}>
              <span className="btn-text">
                {intl.get('configure-bundle')}
              </span>
            </button>
            <AppModalBundleConfigurationMain key={`app-modal-bundle-configuration-main_${itemCodeString}`} handleModalClose={this.handleModalClose} bundleConfigurationItems={item} openModal={openModal} itemDetailLink={itemDetailLink} onItemConfiguratorAddToCart={onConfiguratorAddToCart} onItemRemove={onRemove} />
          </div>
        ) : ('')
        }
        {(item.movetocartform) ? (
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
