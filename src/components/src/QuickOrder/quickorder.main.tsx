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
import Modal from 'react-responsive-modal';
import CartLineItem from '../CartLineItem/cart.lineitem';
import { login } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';
import './quickorder.main.less';

interface QuickOrderMainProps {
  /** buy it again */
  isBuyItAgain?: boolean,
  /** product data */
  productData?: {
    [key: string]: any
  },
  /** item detail link */
  itemDetailLink?: string,
  /** handle move to cart */
  onMoveToCart?: (...args: any[]) => any,
  /** handle configurator add to cart */
  onConfiguratorAddToCart?: (...args: any[]) => any
}

interface QuickOrderMainState {
  isLoading: boolean,
  productId: string,
  itemQuantity: number,
  openModal: boolean,
  productItemInfo: {
    [key: string]: any
  },
  showFailedMessage: boolean,
  failedSubmit: boolean,
  productDataInfo: {
    [key: string]: any
  },
  addToCartFailedMessage: string
}

class QuickOrderMain extends Component<QuickOrderMainProps, QuickOrderMainState> {
  static defaultProps = {
    isBuyItAgain: false,
    productData: {},
    itemDetailLink: '',
    onMoveToCart: () => {},
    onConfiguratorAddToCart: () => {},
  };

  constructor(props) {
    super(props);

    const { productData } = this.props;

    this.state = {
      failedSubmit: false,
      productId: '',
      productDataInfo: {},
      itemQuantity: 1,
      addToCartFailedMessage: '',
      isLoading: false,
      openModal: false,
      productItemInfo: productData !== {} ? productData : {},
      showFailedMessage: false,
    };

    this.addToCart = this.addToCart.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  handleQuantityChange() {
    const { isBuyItAgain } = this.props;
    if (isBuyItAgain) {
      this.setState({
        isLoading: true,
      });
    } else {
      this.setState({
        productId: '',
        itemQuantity: 1,
        openModal: false,
      });
    }
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

  addToCart(event) {
    const {
      productId,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetchItemLookupForm()
        .then(() => itemLookup(productId, false)
          .then((res) => {
            this.setState({
              productItemInfo: res,
              isLoading: false,
              openModal: true,
              showFailedMessage: false,
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
            this.setState({
              isLoading: false,
              showFailedMessage: true,
            });
          }));
    });
    event.preventDefault();
  }

  render() {
    const {
      failedSubmit,
      isLoading,
      addToCartFailedMessage,
      productId,
      itemQuantity,
      openModal,
      productDataInfo,
      productItemInfo,
      showFailedMessage,
    } = this.state;
    const {
      isBuyItAgain, itemDetailLink, onMoveToCart, onConfiguratorAddToCart,
    } = this.props;
    const orderModal = data => (
      <Modal open={openModal || false} onClose={this.handleModalClose} classNames={{ modal: 'buy-it-again-modal-content' }}>
        <div id="buy-it-again-modal">
          <div className="modal-content" id="simplemodal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {intl.get('buy-it-again')}
              </h2>
            </div>
            <CartLineItem
              key={Math.floor(Math.random() * 1000000001)}
              item={productItemInfo}
              itemQuantity={itemQuantity}
              handleQuantityChange={() => { this.handleQuantityChange(); }}
              hideRemoveButton
              itemDetailLink={itemDetailLink}
              onMoveToCart={onMoveToCart}
              onConfiguratorAddToCart={onConfiguratorAddToCart}
            />
          </div>
        </div>
      </Modal>
    );

    if (isBuyItAgain) {
      return (
        <div>
          <div className="buy-it-again-btn-wrap">
            <button className="ep-btn small buy-it-again-btn" type="button" onClick={() => this.handleModalOpen()}>
              {intl.get('buy-it-again')}
            </button>
          </div>
          {orderModal(productDataInfo)}
          <div className="auth-feedback-container" id="product_display_item_add_to_cart_feedback_container" data-i18n="">
            {addToCartFailedMessage}
          </div>
          {
            (isLoading) ? (<div className="miniLoader" />) : ''
          }
        </div>
      );
    }
    return (
      <div className="quick-order-container">
        <div>
          <h2 className="quick-order-title">
            {intl.get('quick-order-title')}
          </h2>
          <form className="form-horizontal" onSubmit={this.addToCart}>
            <div data-region="componentQuickOrderFormRegion">
              <div className="quick-order-form-container">
                <div className="feedback-label quick-order-form-feedback-container" data-region="componentQuickOrderFeedbackRegion">
                  {failedSubmit ? intl.get('failed-to-save-message') : ''}
                </div>
                <div className="form-group quick-order-forms">
                  <div className="quick-order-form-inxt">
                    <input id="quick_order_form_sku" className="form-control" type="text" placeholder={intl.get('quick-order-sku-title')} value={productId || ''} onChange={e => this.setState({ productId: e.target.value, showFailedMessage: false })} />
                  </div>
                  <div className="quantity-col">
                    <input id="quick_order_form_quantity" className="quantity-select form-control" type="number" step="1" min="1" max="9999" placeholder="1" value={itemQuantity || 1} onChange={e => this.setState({ itemQuantity: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group quick-order-btn-container quick-order-btn-container">
              <button className="ep-btn primary wide quick-order-add-to-cart" disabled={!productId} data-el-label="quickOrderForm.save" type="submit">
                {intl.get('search')}
              </button>
            </div>
          </form>
          {productItemInfo && orderModal(productItemInfo)}
          <div className="auth-feedback-container failed-message" id="product_display_item_add_to_cart_feedback_container" data-i18n="">
            {showFailedMessage && intl.get('incorrect-sku')}
          </div>
          {
            (isLoading) ? (<div className="miniLoader" />) : ''
          }
        </div>
      </div>
    );
  }
}

export default QuickOrderMain;
