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
import Modal from 'react-responsive-modal';
import { Link } from 'react-router-dom';
import imgMissingHorizontal from '@elasticpath/ref-store/src/images/img_missing_horizontal@2x.png';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './cart.create.less';

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'element',
  'element:descriptor',
  'element:total',
  'element:additemstocartform',
  'createcartform',
];

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface CartCreateProps {
  handleModalClose: (...args: any[]) => any,
  addToCartAction?: (...args: any[]) => any,
  onReloadPage?: (...args: any[]) => any,
  handleCartsUpdate?: (...args: any[]) => any,
  openModal: boolean,
  productData?: any,
  itemQuantity?: number,
  itemConfiguration?: any,
}
interface CartCreateState {
  cartElements: any,
  cartName: string,
  showAddNewCartForm: boolean,
  showLoader: boolean,
  selectedCart: string,
  selectedElement: number,
}

class CartCreate extends React.Component<CartCreateProps, CartCreateState> {
  static defaultProps = {
    onAcceptDataPolicy: () => {},
    addToCartAction: () => {},
    onReloadPage: () => {},
    handleCartsUpdate: () => {},
    productData: {},
    itemQuantity: 0,
    itemConfiguration: {},
  };

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      cartElements: [],
      cartName: '',
      showAddNewCartForm: false,
      showLoader: false,
      selectedCart: '',
      selectedElement: -1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearCartNameField = this.clearCartNameField.bind(this);
    this.handleShowCartForm = this.handleShowCartForm.bind(this);
    this.addToSelectedCart = this.addToSelectedCart.bind(this);
    this.handleEditCart = this.handleEditCart.bind(this);
    this.handleCartFieldChange = this.handleCartFieldChange.bind(this);
    this.clearCartNameFieldItem = this.clearCartNameFieldItem.bind(this);
    this.handleCartItemKeyDown = this.handleCartItemKeyDown.bind(this);
    this.handleCartSelect = this.handleCartSelect.bind(this);
  }

  componentDidMount() {
    const { productData } = this.props;
    this.fetchCartData();
    if (productData._addtocartform) {
      this.setState({ selectedElement: 0 });
    }
  }

  fetchCartData() {
    login().then(() => {
      cortexFetch(`/carts/${Config.cortexApi.scope}/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const cartElements = [...res._element];
          const extCartElements = cartElements.map(obj => ({
            ...obj, editMode: false, cartName: obj._descriptor[0].name || '', showLoader: false,
          }));
          this.setState({ cartElements: [...extCartElements], selectedCart: res._element[0]._additemstocartform[0].self.uri });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleChange(event) {
    this.setState({ cartName: event.target.value });
  }

  handleKeyDown(event) {
    const { cartName } = this.state;
    if (event.key === 'Enter' && cartName.length > 0) {
      this.createNewCart();
    }
  }

  clearCartNameField() {
    this.setState({ cartName: '' });
  }

  handleCartFieldChange(event, index) {
    const { cartElements } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    elements[index].cartName = event.target.value;
    this.setState({ cartElements: elements });
  }

  clearCartNameFieldItem(index) {
    const { cartElements } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    elements[index].cartName = '';
    this.setState({ cartElements: elements });
  }

  handleCartItemKeyDown(event, index) {
    const { cartElements } = this.state;
    const { handleCartsUpdate } = this.props;
    if (event.key === 'Enter' && cartElements[index].cartName.length > 0) {
      const cartElem = [...cartElements];
      cartElem[index] = { ...cartElem[index] };
      cartElem[index].showLoader = true;
      this.setState({ cartElements: cartElem });
      login().then(() => {
        cortexFetch(`/${cartElements[index]._descriptor[0].self.uri}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({ name: cartElements[index].cartName }),
        })
          .then(() => {
            this.fetchCartData();
            handleCartsUpdate();
            const elements = [...cartElements];
            elements[index] = { ...elements[index] };
            elements[index].editMode = false;
            elements[index].showLoader = false;
            this.setState({ cartElements: elements });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    }
  }

  handleCartSelect(el, index) {
    const { productData } = this.props;
    if (productData._addtocartform) {
      this.setState({ selectedCart: el._additemstocartform[0].self.uri, selectedElement: index });
    }
  }

  renderCartItems() {
    const { cartElements, selectedElement } = this.state;
    const { productData } = this.props;
    if (cartElements.length) {
      return cartElements.map((el, index) => (
        <li className={`carts-list-item ${selectedElement === index ? 'selected' : ''}`} key={`cartItem_${el._descriptor[0].name ? el._descriptor[0].name.trim() : 'default'}`} role="presentation" onClick={() => this.handleCartSelect(el, index)}>
          {el.editMode ? (
            <div className="edit-mode">
              {el.showLoader && (
                <div className="loader-wrapper">
                  <div className="miniLoader" />
                </div>
              )}
              <div className="edit-mode-form">
                <label htmlFor="cart_edit">Name</label>
                <div className="cart-edit-field-wrap">
                  <input type="text" value={el.cartName} id="cart_edit" className="cart-edit-field" onChange={event => this.handleCartFieldChange(event, index)} onKeyDown={event => this.handleCartItemKeyDown(event, index)} />
                  {el.cartName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={() => this.clearCartNameFieldItem(index)} />)}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="cart-info">
                <h4>{el._descriptor[0].name || 'Default'}</h4>
                <p className="cart-quantity">
                  {el['total-quantity']}
                  {' '}
                  items
                </p>
                <p className="cart-price">{el._total[0].cost[0].display}</p>
              </div>
              {!productData._addtocartform && (
                <div className="action-btn">
                  {el._descriptor[0].default ? (
                    <span className="default-label">Default</span>
                  ) : (
                    <div>
                      <button className="ep-btn delete-btn" type="button">{intl.get('delete')}</button>
                      <button className="ep-btn edit-btn" type="button" onClick={() => this.handleEditCart(index)}>{intl.get('edit')}</button>
                    </div>
                  )}
                </div>)}
            </div>
          )}
        </li>));
    }

    return '';
  }

  renderAddNewCartForm() {
    const { cartName, showLoader } = this.state;
    return (
      <div className="carts-list-item">
        {showLoader && (
          <div className="loader-wrapper">
            <div className="miniLoader" />
          </div>
        )}
        <div className="edit-mode">
          <div className="edit-mode-form">
            <label htmlFor="cart_edit">Name</label>
            <div className="cart-edit-field-wrap">
              <input type="text" value={cartName} id="cart_edit" className="cart-edit-field" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
              {cartName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={this.clearCartNameField} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleShowCartForm() {
    this.setState({ showAddNewCartForm: true });
  }

  handleEditCart(index) {
    const { cartElements } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    elements[index].editMode = true;
    this.setState({ cartElements: elements });
  }

  createNewCart() {
    const { cartName } = this.state;
    const { handleCartsUpdate } = this.props;
    this.setState({ showLoader: true });
    login().then(() => {
      cortexFetch(`/carts/${Config.cortexApi.scope}/form?followlocation&format=standardlinks,zoom.nodatalinks`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({ name: cartName }),
      })
        .then(res => res.json())
        .then((res) => {
          this.fetchCartData();
          handleCartsUpdate();
          this.setState({
            cartName: '',
            showAddNewCartForm: false,
            showLoader: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  addToSelectedCart(event) {
    const { selectedCart } = this.state;
    const {
      handleModalClose, itemQuantity, productData, onReloadPage,
    } = this.props;

    login().then(() => {
      const body: { [key: string]: any } = {};
      body.items = { code: productData._code[0].code, quantity: itemQuantity };
      cortexFetch(selectedCart,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify(body),
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            onReloadPage();
            handleModalClose();
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
    event.preventDefault();
  }

  renderOptions() {
    const { productData } = this.props;
    const productOptions = productData && productData._definition._options && productData._definition[0]._options[0];
    return (
      <div className="product-options">
        <h3>{productData._definition[0]['display-name']}</h3>
        <ul className="option-list">
          {productOptions && productOptions._element.map(option => (
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
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const { cartElements, showAddNewCartForm } = this.state;
    const {
      handleModalClose, openModal, productData,
    } = this.props;
    const itemCodeString = productData._code && productData._code[0].code;
    return (
      <Modal open={openModal} onClose={handleModalClose}>
        <div className="modal-lg cart-create-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {intl.get('manage-carts')}
              </h2>
            </div>
            <div className="modal-body">
              { productData && productData._definition ? (
                <div className="product-data">
                  <div className="thumbnail-col" data-el-value="lineItem.thumbnail">
                    <Link to={`itemdetail/${encodeURIComponent(itemCodeString)}`}>
                      <img
                        src={Config.skuImagesUrl.replace('%sku%', itemCodeString)}
                        onError={(e) => {
                          const element: any = e.target;
                          element.src = imgMissingHorizontal;
                        }}
                        alt={intl.get('none-available')}
                        className="cart-lineitem-thumbnail"
                      />
                    </Link>
                  </div>
                  {this.renderOptions()}
                </div>
              ) : (
                <div className="create-cart-btn-wrap">
                  <button type="button" className="ep-btn create-cart-btn" onClick={this.handleShowCartForm}>{intl.get('create-new-cart')}</button>
                </div>
              )}
              <div className="carts-list-wrap">
                <h3>
                  {intl.get('shopping-carts')}
                  {' '}
                  (
                  {cartElements.length}
                  )
                </h3>
                {showAddNewCartForm && this.renderAddNewCartForm()}
                <ul className="carts-list">
                  {this.renderCartItems()}
                </ul>
              </div>
              <div className="action-row">
                <div className="btn-container">
                  <button type="button" className="ep-btn cancel-btn" onClick={handleModalClose}>{intl.get('cancel')}</button>
                  {productData._addtocartform ? (
                    <button type="button" className="ep-btn primary save-btn" onClick={event => this.addToSelectedCart(event)}>{intl.get('add-to-cart')}</button>
                  ) : (
                    <button type="button" className="ep-btn primary save-btn" onClick={handleModalClose}>{intl.get('save')}</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CartCreate;
