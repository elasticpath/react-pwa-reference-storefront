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
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import Modal from 'react-responsive-modal';
import { B2bAddProductsModal, CartLineItem } from '../../components/src/index';


import { ReactComponent as AngleLeftIcon } from '../../images/icons/outline-chevron_left-24px.svg';
import { ReactComponent as ArrowLeft } from '../../images/icons/arrow_left.svg';
import cartData from './cart_main_data_response.json';
import './RequisitionPageMain.less';

interface RequisitionPageMainProps {
}
interface RequisitionPageMainState {
  isLoading: boolean,
  listName: string,
  currentlyListName: string,
  addProductModalOpened: boolean,
  isChecked: boolean,
  selectedElement: number,
  multiSelectMode: boolean,
  productElements: any,
  editListNameModalOpened: boolean,
  listNameErrorMessages: string,
}

class RequisitionPageMain extends Component<RequisitionPageMainProps, RequisitionPageMainState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      listName: 'Vancouver',
      currentlyListName: '',
      addProductModalOpened: false,
      isChecked: false,
      selectedElement: 0,
      multiSelectMode: false,
      editListNameModalOpened: false,
      listNameErrorMessages: '',
      productElements: {
        list: [
          { name: 'January 2020' }, { name: 'February 2020' }, { name: 'March 2020' }, { name: 'April 2020' }, { name: 'May 2020' }, { name: 'June 2020' }, { name: 'July 2020' }, { name: 'August 2020' }, { name: 'September 2020' }, { name: 'October 2020' }, { name: 'November 2020' }, { name: 'December 2020' },
        ],
      },
    };
    this.handleAddProductsModalClose = this.handleAddProductsModalClose.bind(this);
    this.handleAddProductsModalOpen = this.handleAddProductsModalOpen.bind(this);
    this.handleEditListName = this.handleEditListName.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleEditListNameModalOpen = this.handleEditListNameModalOpen.bind(this);
    this.handleChangeListName = this.handleChangeListName.bind(this);
    this.clearListNameField = this.clearListNameField.bind(this);
    this.handleBulkeEdit = this.handleBulkeEdit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    const { listName, currentlyListName } = this.state;
    if (currentlyListName.length === 0) {
      this.setState({ currentlyListName: listName });
    }
  }

  handleAddProductsModalClose() {
    this.setState({
      addProductModalOpened: false,
    });
  }

  handleAddProductsModalOpen() {
    const { addProductModalOpened } = this.state;
    this.setState({
      addProductModalOpened: !addProductModalOpened,
    });
  }

  handleCheck() {
    const { isChecked } = this.state;
    this.setState({ isChecked: !isChecked });
  }

  handleBulkeEdit() {
    this.setState({ multiSelectMode: true });
  }

  handleEditListNameModalOpen() {
    this.setState({
      editListNameModalOpened: true,
    });
  }

  handleEditListName() {
    const { listName } = this.state;
    if (listName.length === 0) {
      this.setState({ listNameErrorMessages: intl.get('name-is-required') });
    } else {
      this.setState({ listNameErrorMessages: '', currentlyListName: listName, editListNameModalOpened: false });
    }
  }

  handleModalClose() {
    const { currentlyListName } = this.state;
    this.setState({
      editListNameModalOpened: false,
      listNameErrorMessages: '',
      listName: currentlyListName,
    });
  }

  handleChangeListName(event) {
    this.setState({
      listName: event.target.value,
    });
  }

  clearListNameField(event) {
    this.setState({
      listName: '',
    });
  }

  renderDropdownMenu() {
    const { productElements } = this.state;
    return (
      <div className="add-to-cart-dropdown">
        <div className="dropdown-sort-field">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {intl.get('add-to-cart-2')}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {(productElements.list[0]) ? productElements.list.map(sortChoice => (
                <li
                  className="dropdown-item"
                  key={sortChoice.name}
                  id={`product_display_item_sku_option_${sortChoice.name}`}
                  value={sortChoice.name}
                >
                  {sortChoice.name}
                </li>
              )) : ''}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      isLoading, addProductModalOpened, editListNameModalOpened, listName, multiSelectMode, selectedElement, isChecked, listNameErrorMessages, currentlyListName,
    } = this.state;

    return (
      <div className="requisition-component">
        {isLoading ? (
          <div className="loader" />
        ) : (
          <div>
            <div className="requisition-header">
              <div className="back-link-wrap">
                <Link className="back-link" to="/b2b/requisition-lists">
                  <AngleLeftIcon />
                  {intl.get('back-to-lists')}
                </Link>
              </div>
              <div className="name-container">
                <h2 className="name">
                  {currentlyListName}
                </h2>
                <button type="button" className="edit-name" onClick={this.handleEditListNameModalOpen}>
                  {intl.get('edit')}
                </button>
              </div>
            </div>
            <div className="add-to-cart-dropdown-wrap">
              <button type="button" className="ep-btn primary add-to-list-button" onClick={this.handleAddProductsModalOpen}>
                {intl.get('add-products-to-list')}
              </button>
              {!multiSelectMode && this.renderDropdownMenu()}
            </div>
            <div className={`pagination-wrap ${multiSelectMode ? 'multi-select-mode' : ''}`}>
              {!multiSelectMode ? (
                <button type="button" className="bulk-edit-btn" onClick={this.handleBulkeEdit}>{intl.get('bulk-edit')}</button>
              ) : (
                <div className="action-elements">
                  <div className="checkbox-wrap">
                    <input type="checkbox" id="select_all_product" className="style-checkbox" onChange={this.handleCheck} defaultChecked={isChecked} />
                    <label htmlFor="select_all_product" />
                    <label htmlFor="select_all_product">
                      {intl.get('select-all')}
                    </label>
                    <p className="selected-element">
                      {selectedElement}
                      {' '}
                      {intl.get('item-selected')}
                    </p>
                  </div>
                  <button type="button" className="ep-btn small delete-btn">{intl.get('delete')}</button>
                  {this.renderDropdownMenu()}
                </div>
              )}
              <div className="product-pagination">
                <button type="button" className="pagination-btn prev-btn" disabled>
                  <ArrowLeft className="arrow-left-icon" />
                </button>
                <span className="pagination-txt">
                  Page 1 of 3
                </span>
                <button type="button" className="pagination-btn next-btn">
                  <ArrowLeft className="arrow-left-icon" />
                </button>
              </div>
            </div>
            <div className={`product-table ${multiSelectMode ? 'multi-select-mode' : ''}`}>
              <div className="product-table-heading">
                <div className="product-table-heading-item" />
                <div className="product-table-heading-item">
                  <span>{intl.get('product')}</span>
                </div>
                <div className="product-table-heading-item" />
                <div className="product-table-heading-item">
                  <span>{intl.get('quick-order-sku-title')}</span>
                </div>
                <div className="product-table-heading-item">
                  <span>{intl.get('quantity')}</span>
                </div>
                <div className="product-table-heading-item">
                  <span>{intl.get('product-options')}</span>
                </div>
                <div className="product-table-heading-item">
                  <span>{intl.get('price')}</span>
                </div>
                <div className="product-table-heading-item actions">
                  <span>{intl.get('actions')}</span>
                </div>
              </div>
              {cartData._defaultcart[0]._lineitems[0]._element.map(product => (
                <CartLineItem handleQuantityChange={() => {}} item={product} key={product._item[0]._code[0].code} hideAvailabilityLabel isTableView isChosen={isChecked} itemDetailLink="/itemdetail" />
              ))}
            </div>
          </div>
        )}
        {addProductModalOpened ? (
          <B2bAddProductsModal
            isBulkModalOpened={addProductModalOpened}
            handleClose={this.handleAddProductsModalClose}
          />
        ) : ''}
        <Modal open={editListNameModalOpened} onClose={this.handleModalClose}>
          <div className="modal-lg create-list-modal">
            <div className="dialog-header">
              <h2 className="modal-title">
                {intl.get('edit-list')}
              </h2>
            </div>
            <div className="dialog-content">
              <div className="create-list-form">
                <div className="create-list-form-wrap">
                  <label htmlFor="list_name">{intl.get('name')}</label>
                  <input defaultChecked={false} type="text" className={`list-name ${(listNameErrorMessages !== '') ? 'input-code-error' : ''}`} id="list_name" value={listName} onChange={event => this.handleChangeListName(event)} />
                  {listName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={this.clearListNameField} />)}
                  <span className={`${(listNameErrorMessages !== '') ? 'input-error-icon' : ''}`} />
                  <p className="error-message">{listNameErrorMessages}</p>
                </div>
              </div>
            </div>
            <div className="dialog-footer">
              <button className="cancel" type="button" onClick={this.handleModalClose}>{intl.get('cancel')}</button>
              <button className="upload" type="button" onClick={this.handleEditListName}>
                {intl.get('save')}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default RequisitionPageMain;
