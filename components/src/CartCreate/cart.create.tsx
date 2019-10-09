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
  'createcartform',
];

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface CartCreateProps {
  handleModalClose: (...args: any[]) => any,
  openModal: boolean
}
interface CartCreateState {
  cartData: any,
  editMode: boolean,
  cartName: string,
  showAddNewCartForm: boolean,
  showLoader: boolean,
}

class CartCreate extends React.Component<CartCreateProps, CartCreateState> {
  static defaultProps = {
    onAcceptDataPolicy: () => {},
  };

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      cartData: undefined,
      editMode: false,
      cartName: '',
      showAddNewCartForm: false,
      showLoader: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearCartNameField = this.clearCartNameField.bind(this);
    this.handleShowCartForm = this.handleShowCartForm.bind(this);
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
          this.setState({ cartData: res });
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
    if (event.key === 'Enter') {
      this.createNewCart();
    }
  }

  clearCartNameField() {
    this.setState({ cartName: '' });
  }

  renderCartItems() {
    const { cartData, editMode, cartName } = this.state;

    if (cartData && cartData._element) {
      return cartData._element.map(el => (
        <li className="carts-list-item">
          {editMode ? (
            <div className="edit-mode">
              <div className="edit-mode-form">
                <label htmlFor="cart_edit">Name</label>
                <div className="cart-edit-field-wrap">
                  <input type="text" value={cartName} id="cart_edit" className="cart-edit-field" onChange={this.handleChange} />
                  {cartName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={this.clearCartNameField} />)}
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
              <div className="action-btn">
                {el._descriptor[0].default ? (
                  <span className="default-label">Default</span>
                ) : (
                  <div>
                    <button className="ep-btn delete-btn" type="button">{intl.get('delete')}</button>
                    <button className="ep-btn edit-btn" type="button">{intl.get('edit')}</button>
                  </div>
                )}
              </div>
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

  createNewCart() {
    const { cartName } = this.state;
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
    const {
      cartData, editMode, cartName, showAddNewCartForm,
    } = this.state;
    const { handleModalClose, openModal } = this.props;

    return (
      <Modal open={openModal} onClose={handleModalClose}>
        <div className="modal-lg cart-create-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                  Manage Carts
              </h2>
            </div>
            <div className="modal-body">
              <div className="create-cart-btn-wrap">
                <button type="button" className="ep-btn create-cart-btn" onClick={this.handleShowCartForm}>Create New Cart </button>
              </div>
              <div className="carts-list-wrap">
                <h3>Your carts (2)</h3>
                {showAddNewCartForm && this.renderAddNewCartForm()}
                <ul className="carts-list">
                  {this.renderCartItems()}
                </ul>
              </div>
              <div className="action-row">
                <div className="btn-container">
                  <button type="button" className="ep-btn cancel-btn" onClick={handleModalClose}>{intl.get('cancel')}</button>
                  <button type="button" className="ep-btn primary save-btn">{intl.get('save')}</button>
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
