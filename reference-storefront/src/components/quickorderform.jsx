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


import './quickorderform.less';
import { withRouter } from 'react-router';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import imgPlaceholder from '../images/img_missing_horizontal@2x.png';
import { login } from '../utils/AuthService';
import { cortexFetchItemLookupForm, itemLookup } from '../utils/CortexLookup';

const Config = require('Config');

class QuickOrderForm extends React.Component {
  static propTypes = {
    item: PropTypes.objectOf(PropTypes.any).isRequired,
    onItemSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      quantity: 1,
      product: {},
      isLoading: false,
      skuErrorMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRemoveSku = this.handleRemoveSku.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.getProductInfo = this.getProductInfo.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { code } = this.state;
    const { item } = nextProps;
    if (item.code !== code) {
      this.handleRemoveSku();
      this.setState({
        code: item.code,
        product: item.product,
        quantity: item.quantity,
      });
    }
  }

  getProductInfo(productId) {
    const { code, quantity } = this.state;
    const { onItemSubmit } = this.props;
    return login().then(() => {
      cortexFetchItemLookupForm()
        .then(() => itemLookup(productId, false)
          .then((res) => {
            if (res._definition[0]._options) {
              this.setState({
                product: res,
                isLoading: false,
                skuErrorMessage: intl.get('configurable-product-message', { SKUCode: productId }),
              });
              onItemSubmit({
                code, quantity, product: {}, isValidField: false,
              });
            } else {
              onItemSubmit({
                code,
                quantity,
                product: res,
                isValidField: true,
              });
              this.setState({
                skuErrorMessage: '',
                product: res,
                isLoading: false,
              });
            }
            if (res._availability[0].state !== 'AVAILABLE') {
              this.setState({
                product: res,
                isLoading: false,
                skuErrorMessage: `${intl.get('not-available-message')}`,
              });
              onItemSubmit({
                code, quantity, product: {}, isValidField: false,
              });
            }
            if (!res._price) {
              this.setState({
                skuErrorMessage: `${intl.get('product-message-without-price', { SKUCode: productId })}`,
              });
              onItemSubmit({
                code, quantity, product: {}, isValidField: false,
              });
            }
          })
          .catch((error) => {
            onItemSubmit({
              code, quantity, product: {}, isValidField: false,
            });
            this.setState({
              skuErrorMessage: `${productId} ${intl.get('sku-invalid-message')}`,
              isLoading: false,
            });
            // eslint-disable-next-line no-console
            console.error(error.message);
          }));
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      code, quantity, product,
    } = this.state;
    if (code === '') return;
    const { onItemSubmit } = this.props;
    onItemSubmit({ code, quantity, product });
    this.setState({
      product: {},
      isLoading: true,
    });
    this.getProductInfo(code);
  }

  handleChange(event) {
    if (event.target.value === '') {
      this.handleRemoveSku();
    }
    this.setState({ code: event.target.value });
  }

  handleRemoveSku() {
    const { onItemSubmit } = this.props;
    this.setState({
      skuErrorMessage: '', code: '', product: {}, quantity: 1,
    });
    onItemSubmit({
      code: '', quantity: 1, product: {}, isValidField: false, isDuplicated: false,
    });
  }

  handleQuantityDecrement() {
    const { code, quantity } = this.state;
    const { onItemSubmit } = this.props;
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;
      this.setState({ quantity: updatedQuantity });
      onItemSubmit({ code, quantity: updatedQuantity });
    }
  }

  handleQuantityIncrement() {
    const { quantity, code } = this.state;
    const { onItemSubmit } = this.props;
    const updatedQuantity = quantity + 1;
    this.setState({ quantity: updatedQuantity });
    onItemSubmit({ code, quantity: updatedQuantity });
  }

  handleQtyChange(event) {
    const { code, product } = this.state;
    const { onItemSubmit } = this.props;
    const updatedQuantity = Number(event.target.value);
    this.setState({ quantity: updatedQuantity });
    onItemSubmit({ code, product, quantity: updatedQuantity });
  }

  render() {
    const { item } = this.props;
    const {
      code, product, isLoading, skuErrorMessage, quantity,
    } = this.state;

    return (
      <div key={item.code} className="bulk-item-wrap">
        <div className="bulk-item">
          <div className="bulk-item-col quick-order-sku-wrap">
            <label htmlFor="item_sku_label" className="control-label">
              {intl.get('quick-order-sku-title')}
            </label>
            <div className="sku-field-wrap">
              <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <input className={`sku-input ${skuErrorMessage ? 'input-code-error' : ''}`} type="text" value={code} name="code" onChange={this.handleChange} onBlur={this.handleSubmit} />
                <span role="presentation" className={`clear-field-btn ${code === '' ? 'hide' : ''} ${(skuErrorMessage !== '') ? 'input-error-icon' : ''}`} onClick={this.handleRemoveSku} />
              </form>
            </div>
          </div>
          <div className="bulk-item-col product-quantity-wrap">
            <label htmlFor="product_display_item_quantity_label" className="control-label control-quantity-label">
              {intl.get('quantity-abbr')}
            </label>
            <div className="input-group-btn">
              <button
                type="button"
                className="quantity-left-minus btn btn-number"
                data-type="minus"
                data-field=""
                onClick={() => {
                  this.handleQuantityDecrement();
                }}
              >
                <span className="glyphicon glyphicon-minus" />
              </button>
              <div className="quantity-col form-content form-content-quantity">
                <input className="product-display-item-quantity-select form-control form-control-quantity" type="number" step="1" min="0" max="9999" value={(item.code !== '') ? quantity : 0} onChange={this.handleQtyChange} />
              </div>
              <button
                type="button"
                className="quantity-right-plus btn btn-number"
                data-type="plus"
                data-field=""
                onClick={() => {
                  this.handleQuantityIncrement();
                }}
              >
                <span className="glyphicon glyphicon-plus" />
              </button>
            </div>
          </div>
          <div className="total-price-item">
            {(product && product._price) ? (
              <p>{`${product._price[0]['purchase-price'][0].display}`}</p>
            ) : <p>$0.00</p>
              }
          </div>
        </div>
        {(code && product._definition) ? (
          <div className="show-product">
            <div className="product-image">
              <img
                src={Config.skuImagesUrl.replace('%sku%', product._code[0].code)}
                onError={(e) => {
                  e.target.src = imgPlaceholder;
                }}
                alt="Not Available"
                className="cart-lineitem-thumbnail"
              />
            </div>
            <div className="title-col" data-el-value="lineItem.displayName">
              <p>
                {product._definition[0]['display-name']}
              </p>
            </div>
          </div>
        ) : ('')}
        {
          (isLoading) ? (<div className="miniLoader" />) : ''
        }
        {
          (skuErrorMessage !== '') ? (<div className="container-error-message"><p className="content-error-message">{skuErrorMessage}</p></div>) : ''
        }
        {
         (skuErrorMessage === '' && item.isDuplicated) ? (<div className="container-error-message"><p className="content-error-message">{intl.get('quick-duplicated-error-message')}</p></div>) : ''
        }
      </div>
    );
  }
}

export default withRouter(QuickOrderForm);
