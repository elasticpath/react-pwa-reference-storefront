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
  handleCartsUpdate?: (...args: any[]) => any,
  handleCartElementSelect?: (...args: any[]) => any,
  openModal: boolean,
}
interface CartCreateState {
  cartElements: any,
  cartName: string,
  showAddNewCartForm: boolean,
  showLoader: boolean,
  selectedElement: number,
  createCartForm: any,
}

class CartCreate extends React.Component<CartCreateProps, CartCreateState> {
  static defaultProps = {
    handleCartsUpdate: () => {},
    handleCartElementSelect: () => {},
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
      selectedElement: 0,
      createCartForm: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddNewCart = this.handleAddNewCart.bind(this);
    this.clearCartNameField = this.clearCartNameField.bind(this);
    this.handleShowCartForm = this.handleShowCartForm.bind(this);
    this.handleHideCartForm = this.handleHideCartForm.bind(this);
    this.handleEditCart = this.handleEditCart.bind(this);
    this.handleCancelEditCart = this.handleCancelEditCart.bind(this);
    this.handleCartFieldChange = this.handleCartFieldChange.bind(this);
    this.clearCartNameFieldItem = this.clearCartNameFieldItem.bind(this);
    this.handleCartRename = this.handleCartRename.bind(this);
    this.handleCartSelect = this.handleCartSelect.bind(this);
  }

  componentDidMount() {
    this.fetchCartData();
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
          this.setState({ cartElements: [...extCartElements] });
          if (res._createcartform) {
            this.setState({ createCartForm: res._createcartform });
          }
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

  handleAddNewCart() {
    const { cartName } = this.state;
    if (cartName.length > 0) {
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

  handleCartRename(index) {
    const { cartElements } = this.state;
    const { handleCartsUpdate } = this.props;
    if (cartElements[index].cartName.length > 0) {
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
    const { handleCartElementSelect, handleModalClose } = this.props;
    this.setState({ selectedElement: index });
    handleCartElementSelect(index);
    handleModalClose();
  }

  renderCartItems() {
    const { cartElements, selectedElement } = this.state;
    if (cartElements.length) {
      return cartElements.map((el, index) => (
        <li className={`carts-list-item ${selectedElement === index ? 'selected' : ''} ${el.editMode ? 'edit-mode-state' : ''}`} key={`cartItem_${el._descriptor[0].name ? el._descriptor[0].name.trim() : 'default'}`} role="presentation" onClick={() => this.handleCartSelect(el, index)}>
          <h4 className="cart-info">{el._descriptor[0].name || intl.get('default')}</h4>
          <p className="cart-info cart-quantity">
            {el['total-quantity']}
            {' '}
                  items
          </p>
          <p className="cart-info cart-price">{el._total[0].cost[0].display}</p>
          <div className="cart-info action-btn">
            {!el._descriptor[0].default ? (
              <div className="cart-editing-btn">
                <button className="ep-btn delete-btn" type="button">{intl.get('delete')}</button>
                <button className="ep-btn edit-btn" type="button" onClick={event => this.handleEditCart(event, index)}>{intl.get('edit')}</button>
              </div>
            ) : (
              ''
            )}
            {el.editMode && (
            <div className="edit-mode" role="presentation" onClick={(event) => { event.stopPropagation(); }}>
              {el.showLoader && (
              <div className="loader-wrapper">
                <div className="miniLoader" />
              </div>
              )}
              <div className="edit-mode-form">
                <div className="cart-edit-field-wrap">
                  <label htmlFor="cart_edit">Name</label>
                  <input type="text" value={el.cartName} id="cart_edit" className="cart-edit-field" onChange={event => this.handleCartFieldChange(event, index)} />
                  {el.cartName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={() => this.clearCartNameFieldItem(index)} />)}
                </div>
                <div className="btn-container">
                  <button type="button" className="ep-btn cancel-btn" onClick={() => this.handleCancelEditCart(index)}>{intl.get('cancel')}</button>
                  <button type="button" className="ep-btn primary save-btn" onClick={() => this.handleCartRename(index)}>{intl.get('save')}</button>
                </div>
              </div>
            </div>
            )}
          </div>
        </li>));
    }
    return (<div className="miniLoader" />);
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
          <h3>{intl.get('create-new-cart')}</h3>
          <div className="edit-mode-form">
            <div className="cart-edit-field-wrap">
              <label htmlFor="cart_edit">Name</label>
              <input type="text" value={cartName} id="cart_edit" className="cart-edit-field" onChange={this.handleChange} />
              {cartName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={this.clearCartNameField} />)}
            </div>
            <div className="btn-container">
              <button type="button" className="ep-btn cancel-btn" onClick={this.handleHideCartForm}>{intl.get('cancel')}</button>
              <button type="button" className="ep-btn primary save-btn" onClick={this.handleAddNewCart}>{intl.get('save')}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleShowCartForm() {
    this.setState({ showAddNewCartForm: true });
  }

  handleHideCartForm() {
    this.setState({ showAddNewCartForm: false });
  }

  handleEditCart(event, index) {
    event.stopPropagation();
    const { cartElements } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    elements[index].editMode = true;
    this.setState({ cartElements: elements });
  }

  handleCancelEditCart(index) {
    const { cartElements } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    elements[index].editMode = false;
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

  render() {
    const { cartElements, showAddNewCartForm, createCartForm } = this.state;
    const {
      handleModalClose, openModal,
    } = this.props;

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
              {createCartForm.length > 0 && (
                <div className="create-cart-btn-wrap">
                  { showAddNewCartForm ? (
                    this.renderAddNewCartForm()
                  ) : (
                    <button type="button" className="ep-btn create-cart-btn" onClick={this.handleShowCartForm}>{intl.get('create-new-cart')}</button>
                  )}
                </div>)}
              <div className="carts-list-wrap">
                <h3>
                  {intl.get('shopping-carts')}
                  {' '}
                  (
                  {cartElements.length}
                  )
                </h3>
                <ul className="carts-list">
                  {this.renderCartItems()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CartCreate;
