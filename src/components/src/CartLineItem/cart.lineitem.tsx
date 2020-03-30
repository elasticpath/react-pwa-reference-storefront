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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
/* eslint-disable-next-line import/no-cycle */
import AppModalBundleConfigurationMain from '../AppModalBundleConfiguration/appmodalbundleconfiguration.main';
import DropdownCartSelection from '../DropdownCartSelection/dropdown.cart.selection.main';
import { ReactComponent as AddToListIcon } from '../../../images/icons/ic_add_list.svg';

import './cart.lineitem.less';

import { ReactComponent as UpdateQuantityIcon } from '../../../images/icons/ic_update.svg';
import { ReactComponent as RecycleBinIcon } from '../../../images/icons/ic_trash.svg';
import ImageContainer from '../ImageContainer/image.container';

let Config: IEpConfig | any = {};

interface CartLineItemProps {
  /** item */
  item: { [key: string]: any },
  /** handle quantity change */
  handleQuantityChange: (...args: any[]) => any,
  /** handle error message */
  handleErrorMessage?: (...args: any[]) => any,
  /** hide remove button */
  hideRemoveButton?: boolean,
  /** hide add to cart button */
  hideAddToCartButton?: boolean,
  /** item quantity */
  itemQuantity?: number,
  /** featured product attribute */
  featuredProductAttribute?: boolean,
  /** handle configurator add to cart */
  onConfiguratorAddToCart?: (...args: any[]) => any,
  /** handle move to cart */
  onMoveToCart?: (...args: any[]) => any,
  /** handle remove */
  onRemove?: (...args: any[]) => any,
  /** handle check */
  onCheck?: (...args: any[]) => any,
  /** link for item detail */
  itemDetailLink?: string,
  /** hide availability label */
  hideAvailabilityLabel?: boolean,
  /** is table view */
  isTableView?: boolean,
  /** is chosen */
  isChosen?: boolean,
  /** multi cart data */
  multiCartData?:any,
  /** open requisition list modal */
  openReqListModal?: (...args: any[]) => any,
  /** is available requisition list */
  isAvailableReqList?: boolean,
}

interface CartLineItemState {
  quantity: any,
  openModal: boolean,
}

class CartLineItem extends Component<CartLineItemProps, CartLineItemState> {
  static defaultProps = {
    handleErrorMessage: () => { },
    hideRemoveButton: false,
    itemQuantity: '1',
    featuredProductAttribute: false,
    hideAddToCartButton: false,
    onConfiguratorAddToCart: () => { },
    onMoveToCart: () => { },
    onRemove: () => { },
    onCheck: () => { },
    itemDetailLink: '',
    hideAvailabilityLabel: false,
    isTableView: false,
    isChosen: false,
    multiCartData: [],
    openReqListModal: () => { },
    isAvailableReqList: false,
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
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
    this.handleCheck = this.handleCheck.bind(this);
    this.addToSelectedCart = this.addToSelectedCart.bind(this);
    this.handleReqListModal = this.handleReqListModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { quantity } = this.state;
    if (nextProps.item.quantity !== quantity) {
      this.setState({
        quantity: nextProps.item.quantity,
      });
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
      item, handleQuantityChange, handleErrorMessage, itemQuantity, onConfiguratorAddToCart,
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
            quantity: itemQuantity || 1,
          }),
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            onConfiguratorAddToCart();
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
    const { item, onMoveToCart } = this.props;
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
            onMoveToCart();
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
      item, handleQuantityChange, onRemove,
    } = this.props;
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
          handleQuantityChange();
          onRemove();
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

  handleReqListModal(itemCodeString, quantity) {
    const { openReqListModal } = this.props;
    openReqListModal(itemCodeString, quantity);
  }

  handleModalClose() {
    this.setState({
      openModal: false,
    });
  }

  handleCheck() {
    const { onCheck } = this.props;
    onCheck();
  }

  addToSelectedCart(cart, onCountChange) {
    const { item, itemQuantity } = this.props;
    const cartUrl = cart._target[0]._additemstocartform[0].self.uri;
    let itemCodeString = '';
    if (item._item) {
      itemCodeString = item._item[0]._code[0].code;
    }
    if (item._code) {
      itemCodeString = item._code[0].code;
    }
    cortexFetch(cartUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        items: [{
          code: itemCodeString,
          quantity: itemQuantity,
        }],
      }),
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const cartName = cart._target[0]._descriptor[0].name ? cart._target[0]._descriptor[0].name : intl.get('default');
          onCountChange(cartName, itemQuantity);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
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
            <li className="bundle-configuration" key={config._item[0]._definition[0]['display-name']}>
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
    if (options && options[0]._element) {
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
    const {
      item,
      hideRemoveButton,
      featuredProductAttribute,
      hideAddToCartButton,
      itemDetailLink,
      onConfiguratorAddToCart,
      onRemove,
      hideAvailabilityLabel,
      isTableView,
      isChosen,
      multiCartData,
      isAvailableReqList,
    } = this.props;
    const { quantity, openModal } = this.state;
    const itemAvailability = ((item._availability) ? (item._availability) : (item._item[0]._availability));
    let availability = (itemAvailability[0].state === 'AVAILABLE');
    let availabilityString = '';
    const isActiveQuantityUpdate = item.quantity !== quantity;
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
    return (
      <div id={`cart_lineitem_${itemCodeString}`} className="cart-lineitem-row">
        {isTableView && (
          <div className="checkbox-col">
            <div className="checkbox-wrap">
              <input type="checkbox" id={`cart_lineitem_checkbox_${itemCodeString}`} className="style-checkbox" onChange={this.handleCheck} checked={isChosen} />
              <label htmlFor={`cart_lineitem_checkbox_${itemCodeString}`} />
            </div>
          </div>
        )}
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
            <ImageContainer className="cart-lineitem-thumbnail" isSkuImage fileName={itemCodeString} imgUrl={Config.skuImagesUrl.replace('%sku%', itemCodeString)} />
          </Link>
        </div>
        <div className="title-options-col">
          <div className="title-col" data-el-value="lineItem.displayName">
            <Link to={`${itemDetailLink}/${encodeURIComponent(itemCodeString)}`}>
              {itemDisplayName}
            </Link>
          </div>
          {!isTableView && (
            <div className="options-col">
              <ul className="options-container">
                {this.renderOptions()}
                {this.renderConfiguration()}
                {this.renderBundleConfiguration()}
              </ul>
            </div>
          )}
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
        {!hideAvailabilityLabel && (
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
        )}
        {isTableView && (
          <div className="sku-col">
            <p>{itemCodeString}</p>
          </div>
        )}
        {!isTableView && (
          <div className="unit-total-price-col">
            <div className="unit-price-col" data-region="cartLineitemUnitPriceRegion">
              <div>
                <div data-region="itemUnitPriceRegion">
                  {this.renderUnitPrice()}
                </div>
              </div>
            </div>
            <div className="total-price-col" data-region="cartLineitemTotalPriceRegion">
              <div>
                <div data-region="itemTotalPriceRegion">
                  {this.renderTotalPrice()}
                </div>
                <div data-region="itemTotalRateRegion" />
              </div>
            </div>
          </div>
        )}
        <form className="quantity-col form-content" onSubmit={this.handleQuantityChange}>
          {(quantity !== undefined) ? [
            <span className="input-group-btn" key="quantity-buttons">
              <button type="button" key="quantity-button-minus" className="quantity-left-minus btn btn-number" data-type="minus" data-field="" onClick={this.handleQuantityDecrement}>
                <span>–</span>
              </button>
              <div className="quantity-col form-content form-content-quantity">
                <input className="product-display-item-quantity-select form-control form-control-quantity" type="number" step="1" min="1" value={quantity} onChange={e => this.setState({ quantity: e.target.value })} />
              </div>
              <button type="button" key="quantity-button-plus" className="quantity-right-plus btn btn-number" data-type="plus" data-field="" onClick={this.handleQuantityIncrement}>
                <span>+</span>
              </button>
            </span>,
            <button type="submit" className={`item-quantity-update-icon ${isActiveQuantityUpdate ? 'active-icon' : ''}`}>
              <UpdateQuantityIcon />
            </button>,
            <input key="product-display-item-quantity-update-button" className="product-display-item-quantity-update-button" type="submit" value={intl.get('update-quantity')} />,
          ] : ('')
          }
        </form>
        {(Config.b2b.enable && isAvailableReqList) ? (
          <div className="icon-container">
            <AddToListIcon className="list-icon" onClick={() => { this.handleReqListModal(itemCodeString, quantity); }} />
          </div>
        ) : ''}
        {isTableView && (
          <div className="options-col">
            <ul className="options-container">
              {this.renderOptions()}
            </ul>
          </div>
        )}
        {isTableView && (
          <div className="total-price-col" data-region="cartLineitemTotalPriceRegion">
            <div>
              <div data-region="itemTotalPriceRegion">
                {item._item[0]._price && item._item[0]._price[0]['purchase-price'][0].display}
              </div>
              <div data-region="itemTotalRateRegion" />
            </div>
          </div>
        )}
        {(!hideRemoveButton) ? (
          <div className="remove-btn-col">
            {isTableView && (
              <DropdownCartSelection multiCartData={multiCartData} addToSelectedCart={this.addToSelectedCart} showDropdownHeader showCartIcon />
            )}
            <button className="ep-btn small btn-cart-removelineitem" type="button" onClick={this.handleRemoveBtnClicked}>
              <RecycleBinIcon className="recycle-bin-icon" />
              <span className="btn-text">
                {intl.get('remove')}
              </span>
            </button>
          </div>
        ) : ('')
        }
        {(item._addtocartform && !hideAddToCartButton) ? (
          <div className="move-to-cart-btn-col">
            <button className="ep-btn primary small btn-cart-addToCart" type="button" onClick={this.handleConfiguratorAddToCartBtnClicked}>
              <span className="btn-text">
                {intl.get('add-to-cart')}
              </span>
            </button>
          </div>
        ) : ('')
        }
        {((item._dependentoptions && item._dependentoptions[0] && item._dependentoptions[0]._element) || (item._dependentlineitems && item._dependentlineitems[0] && item._dependentlineitems[0]._element)) ? (
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

export default CartLineItem;
