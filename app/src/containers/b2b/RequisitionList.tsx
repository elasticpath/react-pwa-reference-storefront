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
import ReactRouterPropTypes from 'react-router-prop-types';
import Modal from 'react-responsive-modal';
import intl from 'react-intl-universal';

import './RequisitionList.less';
import { Link } from 'react-router-dom';
import { ReactComponent as AddToCartIcon } from '../../images/icons/ic_add_to_cart.svg';
import { ReactComponent as RecycleBinIcon } from '../../images/icons/ic_trash.svg';

interface CartCreateProps {
  history: any
}
interface CartCreateState {
  requisitionElements: any,
  multiCartData: any,
  openModal: boolean,
  listName: string,
}

class RequisitionList extends Component<CartCreateProps, CartCreateState> {
  static defaultProps = {
    history: ReactRouterPropTypes.history.isRequired,
    handleCartsUpdate: () => {},
    handleCartElementSelect: () => {},
    updateCartModal: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      requisitionElements: [
        {
          name: 'HQ',
          'product-count': 16,
        },
        {
          name: 'Chicago',
          'product-count': 27,
        },
        {
          name: 'New York',
          'product-count': 56,
        },
        {
          name: 'San Francisco',
          'product-count': 89,
        },
        {
          name: 'Toronto',
          'product-count': 14,
        },
      ],
      multiCartData: [
        {
          name: 'Default',
        },
        {
          name: 'Office',
        },
        {
          name: 'Showroom',
        },
        {
          name: 'Kitchen',
        },
        {
          name: 'Garage',
        },
      ],
      openModal: false,
      listName: '',
    };
    this.handleEditRequisition = this.handleEditRequisition.bind(this);
    this.handleDeleteRequisition = this.handleDeleteRequisition.bind(this);
    this.handleCancelEditRequisition = this.handleCancelEditRequisition.bind(this);
    this.modalConfirmation = this.modalConfirmation.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearListNameField = this.clearListNameField.bind(this);
  }

  componentDidMount() {
  }

  handleDeleteRequisition(element, index) {
    const { requisitionElements } = this.state;
    // eslint-disable-next-line no-console
    console.log('Delete', element, index);
  }

  handleModalOpen() {
    this.setState({ openModal: true });
  }

  handleModalClose() {
    this.setState({ openModal: false, listName: '' });
  }

  handleEditRequisition(event, index) {
    event.stopPropagation();
    const { requisitionElements } = this.state;
    const elements = [...requisitionElements];
    elements[index] = { ...elements[index] };
    elements[index].deleteMode = true;
    this.setState({ requisitionElements: elements });
  }

  handleCancelEditRequisition(index) {
    const { requisitionElements } = this.state;
    const elements = [...requisitionElements];
    elements[index] = { ...elements[index] };
    elements[index].deleteMode = false;
    this.setState({ requisitionElements: elements });
  }

  handleChange(event) {
    this.setState({ listName: event.target.value });
  }

  clearListNameField() {
    this.setState({ listName: '' });
  }

  modalConfirmation(index, element) {
    return (
      <div className="edit-mode delete-mode" role="presentation" onClick={(event) => { event.stopPropagation(); }}>
        <p className="">
          {intl.get('you-are-about-delete')}
          {' '}
          <b>{element.name}</b>
          {'.'}
          <br />
          {intl.get('continue')}
        </p>
        <div className="btn-wrap">
          <button type="button" className="ep-btn cancel-btn" onClick={() => this.handleCancelEditRequisition(index)}>{intl.get('cancel')}</button>
          <button type="button" className="ep-btn ok-btn" onClick={event => this.handleDeleteRequisition(element, index)}>
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

  dropdownCartSelection() {
    const { multiCartData } = this.state;
    return (
      <div className="cart-selection-menu">
        <h6 className="dropdown-header">
          {intl.get('add-to-cart')}
        </h6>
        <div className="cart-selection-menu-wrap">
          {multiCartData.map(cart => (
            <div className="dropdown-item cart-selection-menu-item" key={cart.name}>
              {cart.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderRequisitionItems() {
    const { requisitionElements } = this.state;
    if (requisitionElements.length) {
      return requisitionElements.map((el, index) => (
        <li className={`requisition-list-item ${el.deleteMode ? 'edit-mode-state' : ''}`} key={`requisitionItem_${el.name ? el.name.trim() : 'default'}`} role="presentation">
          <Link className="requisition-info" to="/b2b/requisition-list-item">{el.name}</Link>
          <p className="requisition-info product-count">
            {el['product-count']}
          </p>
          <div className="requisition-info action-btn">
            <div className="requisition-editing-btn">
              <div className="cart-selection-dropdown">
                <button className="ep-btn dropdown-toggle" type="button" data-toggle="dropdown">
                  <AddToCartIcon className="add-to-cart-icon" />
                </button>
                <div className="dropdown-menu cart-selection-list">
                  {this.dropdownCartSelection()}
                </div>
              </div>
              <button className="ep-btn delete-btn" type="button" onClick={event => this.handleEditRequisition(event, index)}>
                <RecycleBinIcon className="delete-icon" />
              </button>
            </div>
            {el.deleteMode && this.modalConfirmation(index, el)}
          </div>
        </li>));
    }
    return (<div className="miniLoader" />);
  }

  render() {
    const { listName, openModal } = this.state;

    return (
      <div>
        <div className="create-requisition-list">
          <p>{intl.get('requisition-lists-description')}</p>
          <button type="button" className="ep-btn primary create-list-btn" onClick={this.handleModalOpen}>{intl.get('create-list')}</button>
          <Modal open={openModal} onClose={this.handleModalClose}>
            <div className="modal-lg create-list-modal">
              <div className="dialog-header">
                <h2 className="modal-title">
                  {intl.get('create-list')}
                </h2>
              </div>
              <div className="dialog-content">
                <div className="create-list-form">
                  <div className="create-list-form-wrap">
                    <label htmlFor="list_name">{intl.get('name')}</label>
                    <input type="text" className="list-name" id="list_name" value={listName} onChange={this.handleChange} />
                    {listName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={this.clearListNameField} />)}
                  </div>
                </div>
              </div>
              <div className="dialog-footer">
                <button className="cancel" type="button" onClick={this.handleModalClose}>{intl.get('cancel')}</button>
                <button className="upload" type="button">
                  {intl.get('save')}
                </button>
              </div>
            </div>
          </Modal>
        </div>
        <div className="requisition-list-wrap">
          <ul className="requisition-list">
            <li className="requisition-list-item requisition-list-header">
              <h4 className="requisition-info">{intl.get('name')}</h4>
              <h4 className="requisition-info">{intl.get('product-count')}</h4>
              <h4 className="requisition-info">{intl.get('actions')}</h4>
            </li>
            {this.renderRequisitionItems()}
          </ul>
        </div>
      </div>
    );
  }
}

export default RequisitionList;
