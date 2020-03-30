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
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './cart.create.less';

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'carts',
  'carts:element',
  'carts:element:descriptor',
  'carts:element:total',
  'carts:element:additemstocartform',
  'carts:createcartform',
];

let Config: IEpConfig | any = {};

interface CartCreateProps {
  /** handle modal close */
  handleModalClose: (...args: any[]) => any,
  /** handle carts update */
  handleCartsUpdate?: (...args: any[]) => any,
  /** handle cart element select */
  handleCartElementSelect?: (...args: any[]) => any,
  /** is open modal */
  openModal: boolean,
  /** update cart modal */
  updateCartModal: boolean,
}

interface CartCreateState {
  cartElements: any,
  cartName: string,
  showAddNewCartForm: boolean,
  showLoader: boolean,
  selectedElement: number,
  createCartForm: any,
  indexDefaultCart: number,
  cartsData: any,
}

class CartCreate extends Component<CartCreateProps, CartCreateState> {
  static defaultProps = {
    handleCartsUpdate: () => {},
    handleCartElementSelect: () => {},
    updateCartModal: false,
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      cartElements: [],
      cartName: '',
      showAddNewCartForm: false,
      showLoader: false,
      selectedElement: -1,
      createCartForm: [],
      indexDefaultCart: 0,
      cartsData: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddNewCart = this.handleAddNewCart.bind(this);
    this.clearCartNameField = this.clearCartNameField.bind(this);
    this.handleShowCartForm = this.handleShowCartForm.bind(this);
    this.handleHideCartForm = this.handleHideCartForm.bind(this);
    this.handleEditCart = this.handleEditCart.bind(this);
    this.handleDeleteCart = this.handleDeleteCart.bind(this);
    this.handleCancelEditCart = this.handleCancelEditCart.bind(this);
    this.handleCartFieldChange = this.handleCartFieldChange.bind(this);
    this.clearCartNameFieldItem = this.clearCartNameFieldItem.bind(this);
    this.handleCartRename = this.handleCartRename.bind(this);
    this.handleCartSelect = this.handleCartSelect.bind(this);
    this.modalConfirmation = this.modalConfirmation.bind(this);
    this.handleHideLoader = this.handleHideLoader.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    this.fetchCartData(-1);
  }

  componentWillReceiveProps() {
    const { updateCartModal } = this.props;
    if (updateCartModal) this.fetchCartData(-1);
  }

  fetchCartData(itemIndex) {
    const { cartElements, selectedElement } = this.state;
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const cartElem = [...res._carts[0]._element];
          const extCartElements = cartElem.map((obj, index) => ({
            ...obj, editMode: cartElements[index] && index !== itemIndex ? cartElements[index].editMode : false, cartName: obj._descriptor[0].name || '', showLoader: false, removeCartLoading: false, disabledField: true,
          }));
          const index = res._carts[0]._element.findIndex(el => el._descriptor[0].default === 'true');
          this.setState({
            cartsData: [...extCartElements],
            cartElements: [...extCartElements],
            indexDefaultCart: index,
            showAddNewCartForm: false,
            showLoader: false,
            cartName: '',
          });
          if (selectedElement === -1) {
            this.setState({ selectedElement: index });
          }
          if (res._carts[0]._createcartform) {
            this.setState({ createCartForm: res._carts[0]._createcartform });
          }
          if (itemIndex >= 0) {
            this.handleHideLoader(extCartElements, index);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleHideLoader(carts, index) {
    const elements = [...carts];
    elements[index] = { ...elements[index] };
    elements[index].editMode = false;
    elements[index].showLoader = false;
    this.setState({ cartElements: elements });
  }

  createNewCart() {
    const { cartName } = this.state;
    const { handleCartsUpdate } = this.props;
    this.setState({ showLoader: true });
    login().then(() => {
      cortexFetch(`/carts/${Config.cortexApi.scope}/form?followlocation`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({ descriptor: { name: cartName } }),
      })
        .then(res => res.json())
        .then((res) => {
          this.fetchCartData(-1);
          handleCartsUpdate();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
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
            this.fetchCartData(index);
            handleCartsUpdate();
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    }
  }

  handleDeleteCart(element, index) {
    const { cartElements } = this.state;
    const cartElem = [...cartElements];
    cartElem[index] = { ...cartElem[index] };
    cartElem[index].removeCartLoading = true;
    this.setState({ cartElements: cartElem });
    const { selectedElement, indexDefaultCart } = this.state;
    const { handleCartsUpdate, handleCartElementSelect } = this.props;
    login().then(() => {
      cortexFetch(`${element.self.uri}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(() => {
          if (index === selectedElement) {
            handleCartElementSelect(indexDefaultCart);
            this.setState({ selectedElement: indexDefaultCart });
          }
          handleCartsUpdate();
          this.fetchCartData(index);
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
    const { cartElements, cartsData } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    elements[index].disabledField = false;
    elements[index].cartName = event.target.value;
    if (cartsData[index].cartName === event.target.value || event.target.value.length === 0) {
      elements[index].disabledField = true;
    }
    this.setState({ cartElements: elements });
  }

  clearCartNameFieldItem(index) {
    const { cartElements } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    elements[index].cartName = '';
    elements[index].disabledField = true;
    this.setState({ cartElements: elements });
  }

  handleShowCartForm() {
    this.setState({ showAddNewCartForm: true });
  }

  handleHideCartForm() {
    this.setState({ showAddNewCartForm: false });
  }

  handleEditCart(event, index, isEdit) {
    event.stopPropagation();
    const { cartElements } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    if (isEdit) {
      elements[index].editMode = true;
      elements[index].disabledField = true;
    } else {
      elements[index].deleteMode = true;
    }
    this.setState({ cartElements: elements });
  }

  handleCancelEditCart(index, isEdit) {
    const { cartElements } = this.state;
    const elements = [...cartElements];
    elements[index] = { ...elements[index] };
    if (isEdit) {
      elements[index].editMode = false;
      elements[index].cartName = elements[index]._descriptor[0].name;
    } else {
      elements[index].deleteMode = false;
    }
    this.setState({ cartElements: elements });
  }

  handleCartSelect(el, index) {
    const { handleCartElementSelect, handleModalClose } = this.props;
    this.setState({ selectedElement: index });
    handleCartElementSelect(index);
    handleModalClose();
  }

  handleCloseModal() {
    const { cartElements } = this.state;
    const { handleModalClose } = this.props;
    this.handleHideCartForm();
    const elements = [...cartElements];
    for (let i = 0; i < elements.length; i++) {
      elements[i].editMode = false;
      elements[i].deleteMode = false;
    }
    handleModalClose();
  }

  modalConfirmation(index, element) {
    return (
      <div className="edit-mode delete-mode" role="presentation" onClick={(event) => { event.stopPropagation(); }}>
        <p className="">
          {intl.get('you-are-about-delete')}
          {' '}
          <b>{element._descriptor[0].name}</b>
          {'.'}
          <br />
          {intl.get('the-cart-deleted')}
        </p>
        <div className="btn-wrap">
          <button type="button" className="ep-btn cancel-btn" onClick={() => this.handleCancelEditCart(index, 0)}>{intl.get('cancel')}</button>
          <button type="button" className="ep-btn ok-btn" onClick={event => this.handleDeleteCart(element, index)}>
            {element.removeCartLoading ? (
              <div className="miniLoader" />
            ) : (
              <span>
                {intl.get('ok')}
              </span>
            )}
          </button>
        </div>
      </div>
    );
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

  renderCartItems() {
    const { cartElements, selectedElement } = this.state;
    if (cartElements.length) {
      return cartElements.map((el, index) => (
        <li className={`carts-list-item ${selectedElement === index ? 'selected' : ''} ${el.editMode || el.deleteMode ? 'edit-mode-state' : ''}`} key={`cartItem_${el._descriptor[0].name ? el._descriptor[0].name.trim() : 'default'}`} role="presentation" onClick={() => this.handleCartSelect(el, index)}>
          <h4 className="cart-info">{el._descriptor[0].name || intl.get('default')}</h4>
          <p className="cart-info cart-quantity">
            {el['total-quantity']}
            {' '}
            {intl.get('items')}
          </p>
          <p className="cart-info cart-price">{el._total[0].cost[0].display}</p>
          <div className="cart-info action-btn">
            {!el._descriptor[0].default ? (
              <div className="cart-editing-btn">
                <button className="ep-btn delete-btn" type="button" onClick={event => this.handleEditCart(event, index, 0)}>{intl.get('delete')}</button>
                <button className="ep-btn edit-btn" type="button" onClick={event => this.handleEditCart(event, index, true)}>{intl.get('rename')}</button>
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
                    <button type="button" className="ep-btn cancel-btn" onClick={() => this.handleCancelEditCart(index, true)}>{intl.get('cancel')}</button>
                    <button type="button" className="ep-btn primary save-btn" disabled={cartElements[index].disabledField} onClick={() => this.handleCartRename(index)}>{intl.get('save')}</button>
                  </div>
                </div>
              </div>
            )}
            {el.deleteMode && this.modalConfirmation(index, el)}
          </div>
        </li>));
    }
    return (<div className="miniLoader" />);
  }

  render() {
    const { cartElements, showAddNewCartForm, createCartForm } = this.state;
    const { openModal } = this.props;

    return (
      <Modal open={openModal} onClose={this.handleCloseModal}>
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
