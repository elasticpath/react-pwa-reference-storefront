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
import { Link } from 'react-router-dom';

import { ReactComponent as AddToCartIcon } from '../../images/icons/ic_add_to_cart.svg';
import { ReactComponent as RecycleBinIcon } from '../../images/icons/ic_trash.svg';
import * as Config from '../../ep.config.json';
import { login } from '../../utils/AuthService';
import { cortexFetch } from '../../utils/Cortex';

import './RequisitionList.less';

const listsZoomArray = [
  'itemlistinfo',
  'itemlistinfo:allitemlists',
  'itemlistinfo:itemlisttypes',
  'itemlistinfo:allitemlists:createitemlistform',
  'itemlistinfo:allitemlists:element',
  'itemlistinfo:allitemlists:element:additemlisttocartforms',
  'itemlistinfo:allitemlists:element:additemlisttocartforms:element',
  'itemlistinfo:allitemlists:element:additemlisttocartforms:element:target',
  'itemlistinfo:allitemlists:element:additemlisttocartforms:element:target:descriptor',
  'itemlistinfo:allitemlists:element:additemlisttocartforms:element:additemlisttocartaction',
  'itemlistinfo:allitemlists:element:itemlists',
  'itemlistinfo:allitemlists:element:lineitems',
  'itemlistinfo:allitemlists:element:itemlisttype',
];

interface CartCreateProps {
  history: any
}
interface CartCreateState {
  createRequisitionForm: any,
  requisitionElements: any,
  openModal: boolean,
  listName: string,
  listNameErrorMessages: string,
  isLoading: boolean,
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
      createRequisitionForm: '',
      requisitionElements: [],
      openModal: false,
      listName: '',
      listNameErrorMessages: '',
      isLoading: false,
    };
    this.handleEditRequisition = this.handleEditRequisition.bind(this);
    this.handleDeleteRequisition = this.handleDeleteRequisition.bind(this);
    this.handleCancelEditRequisition = this.handleCancelEditRequisition.bind(this);
    this.modalConfirmation = this.modalConfirmation.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearListNameField = this.clearListNameField.bind(this);
    this.handleSaveList = this.handleSaveList.bind(this);
    this.addToSelectedCart = this.addToSelectedCart.bind(this);
  }

  componentDidMount() {
    this.loadRequisitionListData();
  }

  loadRequisitionListData() {
    this.setState({ isLoading: true });
    login()
      .then(() => {
        cortexFetch(`?zoom=${listsZoomArray.sort().join()}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
          .then(res => res.json())
          .then((res) => {
            if (res._itemlistinfo[0] && res._itemlistinfo[0]._allitemlists[0]) {
              this.setState({
                requisitionElements: res._itemlistinfo[0]._allitemlists[0]._element || [],
                createRequisitionForm: res._itemlistinfo[0]._allitemlists[0]._createitemlistform[0],
              });
            }
            this.setState({ isLoading: false });
          });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        this.setState({ isLoading: false });
      });
  }

  handleDeleteRequisition(element) {
    const { requisitionElements } = this.state;
    const elements = requisitionElements.map((el) => {
      if (el.self.uri === element.self.uri) {
        return { ...el, removeCartLoading: true };
      }
      return el;
    });
    this.setState({ requisitionElements: elements });
    cortexFetch(element.self.uri, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      })
      .finally(() => {
        this.loadRequisitionListData();
      });
  }

  handleModalOpen() {
    this.setState({ openModal: true });
  }

  handleModalClose() {
    this.setState({ openModal: false, listName: '', listNameErrorMessages: '' });
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

  handleSaveList() {
    const { listName, createRequisitionForm } = this.state;
    if (listName.length === 0) {
      this.setState({ listNameErrorMessages: intl.get('name-is-required') });
    } else {
      cortexFetch(createRequisitionForm.self.uri, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          name: listName,
        }),
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            this.setState({ listNameErrorMessages: '' });
            this.loadRequisitionListData();
            this.handleModalClose();
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    }
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
          <button type="button" className="ep-btn ok-btn" disabled={element.removeCartLoading} onClick={() => this.handleDeleteRequisition(element)}>
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

  addToSelectedCart(cart) {
    cortexFetch(cart.self.uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({}),
    })
      .then(() => {
        this.loadRequisitionListData();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  dropdownCartSelection(list) {
    const multiCartData = list._additemlisttocartforms[0]._element;
    return (
      <div className="cart-selection-menu">
        <h6 className="dropdown-header">
          {intl.get('add-to-cart')}
        </h6>
        <div className="cart-selection-menu-wrap">
          {multiCartData.map((cart) => {
            const name = cart._target[0]._descriptor[0].name || intl.get('default');
            return (
              <button type="button" className="dropdown-item cart-selection-menu-item" key={name} onClick={() => this.addToSelectedCart(cart)}>
                {name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  renderRequisitionItems() {
    const { requisitionElements } = this.state;
    if (requisitionElements.length) {
      return requisitionElements.map((el, index) => (
        <li className={`requisition-list-item ${el.deleteMode ? 'edit-mode-state' : ''}`} key={`requisitionItem_${el.name ? el.name.trim() : 'default'}`} role="presentation">
          <Link className="requisition-info requisition-list-name" to={`/b2b/requisition-list-item/${el.self.uri.split('/').pop()}`}>{el.name}</Link>
          <p className="requisition-info product-count">
            {el['item-count']}
          </p>
          <div className="requisition-info action-btn">
            <div className="requisition-editing-btn">
              <div className="cart-selection-dropdown">
                <button className="ep-btn dropdown-toggle" type="button" data-toggle="dropdown">
                  <AddToCartIcon className="add-to-cart-icon" />
                </button>
                <div className="dropdown-menu cart-selection-list">
                  {this.dropdownCartSelection(el)}
                </div>
              </div>
              <button className="ep-btn delete-btn" type="button" onClick={event => this.handleEditRequisition(event, index)}>
                <RecycleBinIcon className="delete-icon" />
              </button>
            </div>
            {el.deleteMode && this.modalConfirmation(index, el)}
          </div>
        </li>
      ));
    }
    return (<div>{intl.get('no-requisition-lists-message')}</div>);
  }

  render() {
    const {
      listName, openModal, listNameErrorMessages, isLoading,
    } = this.state;

    return (
      <div>
        {isLoading ? (
          <div className="loader" />
        ) : (
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
                        <input type="text" className={`list-name ${(listNameErrorMessages !== '') ? 'input-code-error' : ''}`} id="list_name" value={listName} onChange={this.handleChange} />
                        {listName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={this.clearListNameField} />)}
                        <span className={`${(listNameErrorMessages !== '') ? 'input-error-icon' : ''}`} />
                        <p className="error-message">{listNameErrorMessages}</p>
                      </div>
                    </div>
                  </div>
                  <div className="dialog-footer">
                    <button className="cancel" type="button" onClick={this.handleModalClose}>{intl.get('cancel')}</button>
                    <button className="upload" type="button" onClick={this.handleSaveList}>
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
                  <h4 className="requisition-info action-btn">{intl.get('actions')}</h4>
                </li>
                {this.renderRequisitionItems()}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RequisitionList;
