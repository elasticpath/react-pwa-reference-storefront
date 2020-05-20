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
import ProductDisplayItemMain from '../ProductDisplayItem/productdisplayitem.main';
import { ReactComponent as CloseIcon } from '../../../images/icons/ic_close.svg';

import './quickview.main.scss';


interface QuickViewProps {
  /** handle close modal */
  handleClose?: (...args: any[]) => any,
  /** is open */
  isOpen: boolean,
  /** product data */
  productData: any,
  /** product sku */
  productSku: string
  /** handle add to cart */
  onAddToCart?: (...args: any[]) => any,
  /** handle add to wishlist */
  onAddToWishList?: (...args: any[]) => any,
  /** handle add to requisition list */
  onRequisitionPage?: (...args: any[]) => any,
}

interface QuickViewState {
  /** product id */
  productId: string
}

class QuickView extends Component<QuickViewProps, QuickViewState> {
  static defaultProps = {
    handleClose: () => {},
    isOpen: false,
    productData: {},
    productSku: '',
    onAddToCart: () => {},
    onAddToWishList: () => {},
    onRequisitionPage: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      productId: '',
    };

    this.handleChangeProductFeature = this.handleChangeProductFeature.bind(this);
  }

  handleChangeProductFeature(productId) {
    this.setState({ productId });
  }

  render() {
    const {
      isOpen, handleClose, productSku, onAddToCart, onAddToWishList, onRequisitionPage,
    } = this.props;
    const { productId } = this.state;

    return (
      <div>
        <Modal open={isOpen} onClose={handleClose} showCloseIcon={false}>
          <div className="modal-lg quick-view-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('quick-view')}
                </h2>
                <button type="button" aria-label="close" className="close-modal-btn" onClick={handleClose}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="product-item-container">
                  <ProductDisplayItemMain
                    productId={productId || productSku}
                    onChangeProductFeature={this.handleChangeProductFeature}
                    onAddToCart={onAddToCart}
                    onRequisitionPage={onRequisitionPage}
                    onAddToWishList={onAddToWishList}
                    itemDetailLink="/itemdetail"
                    isQuickView={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}


export default QuickView;
