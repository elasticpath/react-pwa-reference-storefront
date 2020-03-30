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
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import { ReactComponent as EllipsisIcon } from '../../../images/icons/more_horiz-24px.svg';
import './cartclear.less';

let Config: IEpConfig | any = {};

interface CartClearProps {
  /** cart data */
  cartData: any,
  /** handle carts update */
  handleCartsUpdate: (...args: any[]) => any,
  /** handle cart modal update */
  handleCartModalUpdate: (...args: any[]) => any,
}

interface CartClearState {
  showConfirmationMsg: boolean,
  showLoader: boolean,
}

class CartClear extends Component<CartClearProps, CartClearState> {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      showConfirmationMsg: false,
      showLoader: false,
    };
    this.handleClearCart = this.handleClearCart.bind(this);
    this.handleOpenConfirmationMsg = this.handleOpenConfirmationMsg.bind(this);
    this.handleCloseConfirmationMsg = this.handleCloseConfirmationMsg.bind(this);
  }

  handleClearCart() {
    const { cartData, handleCartsUpdate, handleCartModalUpdate } = this.props;
    this.setState({ showLoader: true });
    login().then(() => {
      cortexFetch(`${cartData.self.uri}/lineitems`,
        {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(() => {
          this.setState({ showConfirmationMsg: false, showLoader: false });
          handleCartsUpdate();
          handleCartModalUpdate();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleOpenConfirmationMsg() {
    this.setState({ showConfirmationMsg: true });
  }

  handleCloseConfirmationMsg() {
    this.setState({ showConfirmationMsg: false });
  }

  render() {
    const { showConfirmationMsg, showLoader } = this.state;
    const { cartData } = this.props;
    const cartName = cartData && cartData._descriptor && cartData._descriptor[0].default !== 'true' ? cartData._descriptor[0].name : intl.get('default');
    return (
      <div className="cart-clear-wrapper">
        <div className="dropdown cart-clear-dropdown">
          <button className="btn-ellipsis" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <EllipsisIcon />
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <button type="button" className="remove-cart-btn" onClick={this.handleOpenConfirmationMsg}>{intl.get('remove-all-cart-items')}</button>
          </div>
        </div>
        {showConfirmationMsg && (
          <div className="cart-clear-confirmation">
            <div className="cart-clear-confirmation-content">
              <p>
                {intl.get('cart-clear-msg')}
                {' '}
                <b>{cartName}</b>
                {'. '}
                {intl.get('cart-clear-confirmation')}
              </p>
              <div className="btn-wrap">
                <button className="ep-btn cancel-btn" type="button" onClick={this.handleCloseConfirmationMsg}>{intl.get('cancel')}</button>
                <button className="ep-btn ok-btn" type="button" onClick={this.handleClearCart}>
                  {showLoader ? (<span className="miniLoader" />) : intl.get('ok')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CartClear;
