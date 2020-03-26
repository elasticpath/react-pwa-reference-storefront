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
import { Link, RouteComponentProps } from 'react-router-dom';
import intl from 'react-intl-universal';
import Modal from 'react-responsive-modal';
import { B2bAddProductsModal, CartLineItem } from '../../components/src/index';


import { ReactComponent as AngleLeftIcon } from '../../images/icons/outline-chevron_left-24px.svg';
import { ReactComponent as RecycleBinIcon } from '../../images/icons/ic_trash.svg';
import { ReactComponent as AddToListIcon } from '../../images/icons/ic_add_list.svg';
import { ReactComponent as CloseIcon } from '../../images/icons/ic_close.svg';
import { login } from '../../utils/AuthService';
import { cortexFetch } from '../../utils/Cortex';
import * as Config from '../../ep.config.json';

import './RequisitionPageMain.less';
import Pagination from '../../components/src/Pagination/pagination';
import DropdownCartSelection from '../../components/src/DropdownCartSelection/dropdown.cart.selection.main';

const listsZoomArray = [
  'additemlisttocartforms',
  'additemlisttocartforms:element',
  'additemlisttocartforms:element:target',
  'additemlisttocartforms:element:target:descriptor',
  'additemlisttocartforms:element:target:additemstocartform',
  'additemlisttocartforms:element:additemlisttocartaction',
  'additemstoitemlistform',
  'removelineitemsform',
  'itemlists',
  'paginatedlineitems',
  'paginatedlineitems:element',
  'paginatedlineitems:element:item',
  'paginatedlineitems:element:item:availability',
  'paginatedlineitems:element:item:addtocartforms',
  'paginatedlineitems:element:item:addtocartform',
  'paginatedlineitems:element:item:cartmemberships',
  'paginatedlineitems:element:item:definition',
  'paginatedlineitems:element:item:definition:options',
  'paginatedlineitems:element:item:definition:options:element',
  'paginatedlineitems:element:item:definition:options:element:value',
  'paginatedlineitems:element:item:addtoitemlistforms',
  'paginatedlineitems:element:item:code',
  'paginatedlineitems:element:item:offer',
  'paginatedlineitems:element:item:price',
  'paginatedlineitems:element:item:appliedpromotions',
  'paginatedlineitems:element:item:recommendations',
  'paginatedlineitems:element:item:addtowishlistform',
  'paginatedlineitems:element:item:wishlistmemberships',
  'paginatedlineitems:next',
  'paginatedlineitems:previous',
  'paginatedlineitems:paginator',
];

const elementZoomArray = [
  'element',
  'element:item',
  'element:item:availability',
  'element:item:addtocartforms',
  'element:item:addtocartform',
  'element:item:cartmemberships',
  'element:item:definition',
  'element:item:addtoitemlistforms',
  'element:item:code',
  'element:item:offer',
  'element:item:price',
  'element:item:appliedpromotions',
  'element:item:recommendations',
  'element:item:addtowishlistform',
  'element:item:wishlistmemberships',
  'next',
  'previous',
];

interface RequisitionPageMainProps {
  uri: string;
}

interface RequisitionPageMainState {
  isLoading: boolean,
  isTableLoading: boolean,
  listName: string,
  currentlyListName: string,
  addProductModalOpened: boolean,
  multiSelectMode: boolean,
  editListNameModalOpened: boolean,
  listNameErrorMessages: string,
  productsData: any,
  multiCartData: any,
  selectedProducts: any,
  addItemsToItemListUri: string,
  removeLineItemsUri: string,
  paginatorUri: string,
  showCreateListLoader: boolean,
  addToCartLoader: boolean,
  listItemCount: number,
  showSelectAllPopup: boolean,
  selectAllLoader: boolean,
}

class RequisitionPageMain extends Component<RouteComponentProps<RequisitionPageMainProps>, RequisitionPageMainState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      isTableLoading: false,
      listName: '',
      currentlyListName: '',
      addProductModalOpened: false,
      multiSelectMode: false,
      editListNameModalOpened: false,
      listNameErrorMessages: '',
      multiCartData: [],
      productsData: undefined,
      selectedProducts: [],
      addItemsToItemListUri: '',
      removeLineItemsUri: '',
      paginatorUri: '',
      showCreateListLoader: false,
      addToCartLoader: false,
      listItemCount: 0,
      showSelectAllPopup: false,
      selectAllLoader: false,
    };
    this.handleAddProductsModalClose = this.handleAddProductsModalClose.bind(this);
    this.handleAddProductsModalOpen = this.handleAddProductsModalOpen.bind(this);
    this.handleAddProductsModalUpdate = this.handleAddProductsModalUpdate.bind(this);
    this.handleEditListName = this.handleEditListName.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleEditListNameModalOpen = this.handleEditListNameModalOpen.bind(this);
    this.handleChangeListName = this.handleChangeListName.bind(this);
    this.clearListNameField = this.clearListNameField.bind(this);
    this.handleBulkEdit = this.handleBulkEdit.bind(this);
    this.handleBulkDelete = this.handleBulkDelete.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleAddToSelectedCart = this.handleAddToSelectedCart.bind(this);
    this.loadRequisitionListData = this.loadRequisitionListData.bind(this);
    this.handleUpdateSelectedItem = this.handleUpdateSelectedItem.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleSelectAllItems = this.handleSelectAllItems.bind(this);
    this.handleCloseSelectAllPopup = this.handleCloseSelectAllPopup.bind(this);
    this.handleCloseMultiSelectMode = this.handleCloseMultiSelectMode.bind(this);
  }

  componentDidMount() {
    const { listName, currentlyListName } = this.state;
    this.loadRequisitionListData();
    if (currentlyListName.length === 0) {
      this.setState({ currentlyListName: listName });
    }
  }

  loadRequisitionListData(withoutLoader = false) {
    const { match } = this.props;
    const { productsData } = this.state;
    const listUri = match.params.uri;
    const scope = localStorage.getItem(`${Config.cortexApi.scope}_oAuthScope`);

    if (productsData && !productsData._element) {
      this.setState({ isLoading: true });
    } else if (!withoutLoader) {
      this.setState({ isLoading: true });
    } else {
      this.setState({ isTableLoading: true });
    }

    login()
      .then(() => {
        cortexFetch(`/itemlists/${scope}/${listUri}?zoom=${listsZoomArray.sort().join()}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
          .then(res => res.json())
          .then((res) => {
            if (res && res._additemlisttocartforms) {
              this.setState({
                listName: res.name,
                listItemCount: res._paginatedlineitems[0].pagination.results,
                addItemsToItemListUri: res._additemstoitemlistform[0].self.uri,
                removeLineItemsUri: res._removelineitemsform[0].self.uri,
                multiCartData: res._additemlisttocartforms[0]._element,
                currentlyListName: res.name,
                productsData: res._paginatedlineitems[0],
                paginatorUri: res._paginatedlineitems[0]._paginator[0].self.uri,
              });
              this.handleUpdateSelectedItem();
            }
            this.setState({ isLoading: false, isTableLoading: false });
          });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        this.setState({ isLoading: false, isTableLoading: false });
      });
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

  handleAddProductsModalUpdate() {
    this.loadRequisitionListData();
    this.setState({ addProductModalOpened: false });
  }

  handleCheckAll(isChecked) {
    const { productsData, selectedProducts } = this.state;
    let products = selectedProducts;
    if (isChecked) {
      products = selectedProducts.filter(product => !(productsData._element.find(element => element.self.uri === product.self.uri)));
    } else {
      productsData._element.forEach((product) => {
        const found = selectedProducts.find(element => element.self.uri === product.self.uri);
        if (!found) products.push(product);
      });
    }
    this.setState({ selectedProducts: products });

    if (!isChecked && (productsData._next || productsData._previous) && products.length !== productsData.pagination.results) {
      this.setState({ showSelectAllPopup: true });
    } else {
      this.setState({ showSelectAllPopup: false });
    }
  }

  handleCheck(product) {
    const { selectedProducts, productsData } = this.state;
    const foundProduct = selectedProducts.find(item => item.self.uri === product.self.uri);
    if (foundProduct) {
      const filteredProduct = selectedProducts.filter(item => item.self.uri !== product.self.uri);
      this.setState({ selectedProducts: filteredProduct });
      if (productsData._element.length > filteredProduct.length) {
        this.setState({ showSelectAllPopup: false });
      }
    } else {
      this.setState({ selectedProducts: [...selectedProducts, product] });
    }
  }

  handleUpdateSelectedItem() {
    const { selectedProducts, productsData } = this.state;
    const updatedItems = selectedProducts.map(element => productsData._element.find(item => item.self.uri === element.self.uri));
    this.setState({ selectedProducts: updatedItems });
  }

  handleBulkEdit() {
    this.setState({ multiSelectMode: true });
  }

  handleBulkDelete() {
    const { selectedProducts, removeLineItemsUri } = this.state;
    const lineitems = selectedProducts.map(el => ({ guid: el.guid }));
    this.setState({ isTableLoading: true });

    login().then(() => {
      cortexFetch(`${removeLineItemsUri}?followlocation`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({ lineitems }),
        })
        .then((res) => {
          this.setState({
            multiSelectMode: false,
            selectedProducts: [],
            isTableLoading: false,
            showSelectAllPopup: false,
          });
          this.loadRequisitionListData(true);
        })
        .catch((error) => {
          this.setState({ isTableLoading: false });
          // eslint-disable-next-line no-console
          console.error('error.message:', error.message);
        });
    });
  }

  handleEditListNameModalOpen() {
    this.setState({
      editListNameModalOpened: true,
    });
  }

  handleEditListName() {
    const { listName } = this.state;
    const { match } = this.props;
    const listUri = match.params.uri;
    const scope = localStorage.getItem(`${Config.cortexApi.scope}_oAuthScope`);

    if (listName.length === 0) {
      this.setState({ listNameErrorMessages: intl.get('name-is-required') });
    } else {
      this.setState({ showCreateListLoader: true });
      login().then(() => {
        cortexFetch(`/itemlists/${scope}/${listUri}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({ name: listName }),
        })
          .then(() => {
            this.setState({
              listNameErrorMessages: '', currentlyListName: listName, editListNameModalOpened: false, showCreateListLoader: false,
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
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

  renderDropdownMenu(isDisabled = false) {
    const { multiCartData, addToCartLoader } = this.state;
    return (
      <div className="dropdown-add-to-cart-field">
        <DropdownCartSelection multiCartData={multiCartData} addToSelectedCart={this.handleAddToSelectedCart} isDisabled={isDisabled} showLoader={addToCartLoader} btnTxt={intl.get('add-to-cart-2')} showCartIcon />
      </div>
    );
  }

  handlePagination(request) {
    this.setState({ isTableLoading: true });
    request
      .then(res => res.json())
      .then((res) => {
        if (res && res._element) {
          this.setState({ productsData: res });
        }
        this.setState({ isTableLoading: false });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        this.setState({ isTableLoading: false });
      });
  }

  handleAddToSelectedCart(cart, onCountChange: any = () => {}) {
    const { selectedProducts, productsData, listItemCount } = this.state;
    if (productsData && productsData._element) {
      this.setState({ addToCartLoader: true });
      const products = productsData && productsData._element ? productsData._element : [];

      let cartUrl = cart._additemlisttocartaction[0].self.uri;
      const body: { items?: any[] } = {};

      let itemQuantity = listItemCount;
      const cartName = cart._target[0]._descriptor[0].name ? cart._target[0]._descriptor[0].name : intl.get('default');

      if (selectedProducts && selectedProducts.length) {
        cartUrl = cart._target[0]._additemstocartform[0].self.uri;
        body.items = [];
        const arrayItems = (selectedProducts.length > 0 ? selectedProducts : products)
          .filter(item => item.code !== '')
          .map(item => ({ code: item._item[0]._code[0].code, quantity: item.quantity }));
        body.items = arrayItems;
        itemQuantity = arrayItems.reduce((value, item) => value + item.quantity, 0);
      }

      cortexFetch(cartUrl,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: body.items ? JSON.stringify(body) : '{}',
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            this.setState({
              selectedProducts: [],
              multiSelectMode: false,
              addToCartLoader: false,
              showSelectAllPopup: false,
            });
            onCountChange(cartName, itemQuantity);
          } else {
            this.setState({ addToCartLoader: false });
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false, addToCartLoader: false });
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    }
  }

  handleSelectAllItems() {
    const { productsData, paginatorUri } = this.state;
    const size = productsData.pagination.results;
    this.setState({ selectAllLoader: true });

    login().then(() => {
      cortexFetch(`${paginatorUri}?zoom=${elementZoomArray.sort().join()}&followlocation`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({ size }),
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            showSelectAllPopup: false,
            selectedProducts: res._element,
            selectAllLoader: false,
          });
        })
        .catch((error) => {
          this.setState({ selectAllLoader: false });
          // eslint-disable-next-line no-console
          console.error('error.message:', error.message);
        });
    });
  }

  handleCloseSelectAllPopup() {
    this.setState({ showSelectAllPopup: false });
  }

  handleCloseMultiSelectMode() {
    this.setState({ multiSelectMode: false });
  }

  render() {
    const {
      isLoading,
      addProductModalOpened,
      editListNameModalOpened,
      listName,
      multiSelectMode,
      listNameErrorMessages,
      currentlyListName,
      productsData,
      multiCartData,
      isTableLoading,
      selectedProducts,
      addItemsToItemListUri,
      showCreateListLoader,
      showSelectAllPopup,
      selectAllLoader,
    } = this.state;

    const products = productsData && productsData._element ? productsData._element : [];
    const pagination = productsData ? productsData.pagination : { pages: 0, current: 0 };
    const isProductChecked = product => selectedProducts.find(item => item.self.uri === product.self.uri);
    const CartDropdown = (props: any) => (<div className="add-to-cart-dropdown">{this.renderDropdownMenu(props.isDisabled)}</div>);
    const paginationResults = pagination.results;
    const isChecked = selectedProducts.filter(product => products.find(element => element.self.uri === product.self.uri)).length === products.length;

    const selectAllItemsBtn = (
      <button type="button" className="select-all-btn" onClick={this.handleSelectAllItems}>
        {intl.get('select-all-items', { paginationResults })}
      </button>
    );

    const selectedItem = selectedProducts.length;

    const msg = intl.get('select-all-items-txt').split(/[{}]/g);
    const obj = { selectAllItemsBtn, selectedItem };

    return (
      <div className="requisition-component">
        {showSelectAllPopup && (
        <div className="select-all-items-block">
          <div className={`select-all-items ${selectAllLoader ? 'loading' : ''}`}>
            {selectAllLoader ? (<span className="miniLoader" />) : ''}
            <p>
              {msg.map((str) => {
                const i = Object.keys(obj).indexOf(str);
                return i === -1 ? str : obj[str];
              })}
            </p>
            <button type="button" className="ep-btn small close-btn" onClick={this.handleCloseSelectAllPopup}>
              {intl.get('close')}
            </button>
          </div>
        </div>
        )}
        {isLoading ? (
          <div className="loader" />
        ) : (
          <div className={`requisition-component-wrap ${multiSelectMode ? 'multi-select-mode' : ''}`}>
            <div className="requisition-header">
              <div className="back-link-wrap">
                <Link className="back-link" to="/account/requisition-lists">
                  <AngleLeftIcon />
                  {intl.get('back-to-lists')}
                </Link>
              </div>
              <div className="name-container">
                <h2 className="name">
                  {currentlyListName}
                </h2>
                <button type="button" className="rename-name" onClick={this.handleEditListNameModalOpen}>
                  {intl.get('rename')}
                </button>
              </div>
            </div>
            <div className="add-to-cart-dropdown-wrap">
              <button type="button" className="ep-btn primary add-to-list-button" onClick={this.handleAddProductsModalOpen}>
                <span className="btn-txt">{intl.get('add-products-to-list')}</span>
                <AddToListIcon className="list-icon" />
              </button>
              {!multiSelectMode && (<CartDropdown isDisabled={!(productsData && productsData._element && productsData._element.length)} />)}
            </div>
            { products.length
              ? (
                <div>
                  <div className={`pagination-wrap ${multiSelectMode ? 'multi-select-mode' : ''}`}>
                    {!multiSelectMode ? (
                      <button type="button" className="bulk-edit-btn" onClick={this.handleBulkEdit}>{intl.get('bulk-edit')}</button>
                    ) : (
                      <div className="action-elements">
                        <div className="checkbox-wrap">
                          <input type="checkbox" id="select_all_product" className="style-checkbox" onChange={() => { this.handleCheckAll(isChecked); }} checked={isChecked} />
                          <label htmlFor="select_all_product" />
                          <label htmlFor="select_all_product">
                            {intl.get('select-all')}
                          </label>
                          <p className="selected-element">
                            <span className="selected-element-counter">
                              {selectedProducts.length}
                            </span>
                            {' '}
                            {intl.get('item-selected')}
                          </p>
                        </div>
                        <button type="button" className="ep-btn small delete-btn" disabled={!(selectedProducts && selectedProducts.length)} onClick={this.handleBulkDelete}>
                          <RecycleBinIcon className="recycle-bin-icon" />
                          <span className="btn-txt">
                            {intl.get('delete')}
                          </span>
                        </button>
                        <CartDropdown isDisabled={!(selectedProducts && selectedProducts.length)} />
                        <button type="button" className="close-btn" onClick={this.handleCloseMultiSelectMode}>
                          <CloseIcon />
                        </button>
                      </div>
                    )}
                    {productsData && (<Pagination pagination={pagination} onPageChange={this.handlePagination} next={productsData._next} previous={productsData._previous} showItemsCount={!multiSelectMode} zoom={elementZoomArray} />)}
                  </div>
                  <div className={`product-table ${multiSelectMode ? 'multi-select-mode' : ''} ${isTableLoading ? 'loading' : ''}`}>
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
                    {isTableLoading && <div className="textLoader">{intl.get('loading')}</div>}
                    {products.map(product => (
                      product._item
                        ? (
                          <CartLineItem
                            itemQuantity={product.quantity}
                            handleQuantityChange={() => this.loadRequisitionListData(true)}
                            item={product}
                            hideAvailabilityLabel
                            isTableView
                            key={product._item[0]._code[0].code}
                            onCheck={() => { this.handleCheck(product); }}
                            isChosen={isProductChecked(product)}
                            itemDetailLink="/itemdetail"
                            multiCartData={multiCartData}
                          />
                        )
                        : ''
                    ))}
                  </div>
                  <div className="pagination-wrap right">
                    {productsData && pagination.pages > 1 && (<Pagination pagination={pagination} onPageChange={this.handlePagination} next={productsData._next} previous={productsData._previous} zoom={elementZoomArray} />)}
                  </div>
                </div>
              )
              : (<div className="requisition-empty">{intl.get('requisition-lists-description')}</div>)
            }
          </div>
        )}
        {addProductModalOpened ? (
          <B2bAddProductsModal
            isBulkModalOpened={addProductModalOpened}
            handleClose={this.handleAddProductsModalClose}
            addItemsToItemListUri={addItemsToItemListUri}
            onAddItem={this.handleAddProductsModalUpdate}
          />
        ) : ''}
        <Modal open={editListNameModalOpened} onClose={this.handleModalClose}>
          <div className="modal-lg create-list-modal">
            {showCreateListLoader && (
              <div className="loader-wrapper">
                <div className="miniLoader" />
              </div>
            )}
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
