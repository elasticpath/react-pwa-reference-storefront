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

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface CartCreateProps {
  handleModalClose: (...args: any[]) => any,
  openModal: boolean
}
interface CartCreateState {
  open: boolean,
  editMode: boolean,
  cartName: string,
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
      open: false,
      editMode: true,
      cartName: '',
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleOpenModal() {
    this.setState({ open: true });
  }

  handleCloseModal() {
    this.setState({ open: false });
  }

  handleChange(event) {
    this.setState({ cartName: event.target.value });
  }

  render() {
    const { open, editMode, cartName } = this.state;
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
                <button type="button" className="ep-btn create-cart-btn">Create New Cart </button>
              </div>
              <div className="carts-list-wrap">
                <h3>Your carts (2)</h3>
                <ul className="carts-list">
                  <li className="carts-list-item">
                    {editMode ? (
                      <div className="edit-mode">
                        <div className="edit-mode-form">
                          <label htmlFor="cart_edit">Name</label>
                          <input type="text" value={cartName} id="cart_edit" className="cart-edit-field" onChange={this.handleChange} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="cart-info">
                          <h4>Garage</h4>
                          <p className="cart-quantity">5 items</p>
                          <p className="cart-price">$336.00</p>
                        </div>
                        <div className="action-btn">
                          <button className="ep-btn delete-btn" type="button">{intl.get('delete')}</button>
                          <button className="ep-btn edit-btn" type="button">{intl.get('edit')}</button>
                        </div>
                      </div>
                    )}
                  </li>
                  <li className="carts-list-item">
                    <div className="cart-info">
                      <h4>Personal</h4>
                      <p className="cart-quantity">3 items</p>
                      <p className="cart-price">$156.00</p>
                    </div>
                    <div className="action-btn">
                      <span className="default-label">Default</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="action-row">
                <div className="btn-container">
                  <button type="button" className="ep-btn cancel-btn">{intl.get('cancel')}</button>
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
