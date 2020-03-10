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
import Modal from 'react-responsive-modal';
import CartLineItem from '../CartLineItem/cart.lineitem';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import './cart.main.less';
import { cortexFetch } from '../../../utils/Cortex';
import { login } from '../../../utils/AuthService';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface CartMainProps {
  /** is empty */
  empty: boolean,
  /** cart data */
  cartData: {
    [key: string]: any
  },
  /** handle quantity change */
  handleQuantityChange: (...args: any[]) => any,
  /** handle item configurator add to cart */
  onItemConfiguratorAddToCart?: (...args: any[]) => any,
  /** handle item move to cart */
  onItemMoveToCart?: (...args: any[]) => any,
  /** handle item remove */
  onItemRemove?: (...args: any[]) => any,
  /** item detail link */
  itemDetailLink?: string,
}

interface CartMainState {
  openModal: boolean,
  requisitionListData: any,
  itemData: {code: string, quantity: number},
  listUrl: string,
  addToRequisitionListLoading: boolean,
  listName: string,
  showReqListForm: boolean,
  showReqListLoader: boolean,
  createRequisitionForm: any,
}

const requisitionListsZoomArray = [
  'itemlistinfo',
  'itemlistinfo:allitemlists',
  'itemlistinfo:allitemlists:element',
  'itemlistinfo:allitemlists:element:lineitems',
  'itemlistinfo:allitemlists:element:paginatedlineitems',
  'itemlistinfo:allitemlists:element:additemstoitemlistform',
  'itemlistinfo:itemlisttypes',
  'itemlistinfo:itemlisttypes:element',
  'itemlistinfo:itemlisttypes:element:createitemlistform',
];

class CartMain extends Component<CartMainProps, CartMainState> {
  static defaultProps = {
    onItemConfiguratorAddToCart: () => {
    },
    onItemMoveToCart: () => {
    },
    onItemRemove: () => {
    },
    itemDetailLink: '',
  };

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = getConfig());
    this.state = {
      openModal: false,
      requisitionListData: undefined,
      itemData: {
        code: '', quantity: 0,
      },
      listUrl: '',
      addToRequisitionListLoading: false,
      listName: '',
      showReqListForm: false,
      showReqListLoader: false,
      createRequisitionForm: '',
    };

    this.handleConfiguratorAddToCart = this.handleConfiguratorAddToCart.bind(this);
    this.handleMoveToCart = this.handleMoveToCart.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.openReqListModal = this.openReqListModal.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.fetchRequisitionListsData = this.fetchRequisitionListsData.bind(this);
    this.handleSelectList = this.handleSelectList.bind(this);
    this.handleAddToList = this.handleAddToList.bind(this);
    this.handleShowListForm = this.handleShowListForm.bind(this);
    this.handleHideListForm = this.handleHideListForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearListNameField = this.clearListNameField.bind(this);
    this.handleSaveList = this.handleSaveList.bind(this);
  }

  componentDidMount() {
    this.fetchRequisitionListsData();
  }

  fetchRequisitionListsData() {
    login().then(() => {
      cortexFetch(`?zoom=${requisitionListsZoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          if (res._itemlistinfo) {
            this.setState({
              requisitionListData: res._itemlistinfo[0]._allitemlists[0]._element,
              createRequisitionForm: res._itemlistinfo[0]._itemlisttypes[0]._element[0]._createitemlistform[0],
              showReqListLoader: false,
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleConfiguratorAddToCart() {
    const { onItemConfiguratorAddToCart } = this.props;
    onItemConfiguratorAddToCart();
  }

  handleMoveToCart() {
    const { onItemMoveToCart } = this.props;
    onItemMoveToCart();
  }

  openReqListModal(code, quantity) {
    this.fetchRequisitionListsData();
    const data = { code, quantity };
    this.setState({
      openModal: true, itemData: data,
    });
  }

  handleModalClose() {
    this.setState({
      addToRequisitionListLoading: false, openModal: false, itemData: { code: '', quantity: 0 }, listUrl: '', showReqListForm: false,
    });
  }

  handleAddToList() {
    const { itemData, listUrl } = this.state;
    this.setState({ addToRequisitionListLoading: true });
    if (listUrl.length) {
      login().then(() => {
        const body: { [key: string]: any } = {};
        body.items = itemData;
        cortexFetch(listUrl,
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
              this.setState({
                openModal: false,
                addToRequisitionListLoading: false,
              });
              this.handleModalClose();
              this.fetchRequisitionListsData();
            } else {
              this.handleModalClose();
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    } else {
      this.setState({
        openModal: false, addToRequisitionListLoading: false,
      });
    }
  }

  handleSelectList(list) {
    const listUrl = list._additemstoitemlistform ? list._additemstoitemlistform[0].self.uri : '';
    this.setState({
      listUrl,
    });
  }

  handleRemove() {
    const { onItemRemove } = this.props;
    onItemRemove();
  }

  handleSaveList() {
    const { listName, createRequisitionForm } = this.state;
    if (listName.length !== 0) {
      this.setState({ showReqListLoader: true });
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
            this.fetchRequisitionListsData();
            this.setState({ listName: '' });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    }
  }

  handleShowListForm() {
    this.setState({ showReqListForm: true });
  }

  handleHideListForm() {
    this.setState({ showReqListForm: false });
  }

  handleChange(event) {
    this.setState({ listName: event.target.value });
  }

  clearListNameField() {
    this.setState({ listName: '' });
  }

  renderAddNewListForm() {
    const { listName, showReqListLoader } = this.state;
    return (
      <div className="create-list-form">
        {showReqListLoader && (
          <div className="loader-wrapper">
            <div className="miniLoader" />
          </div>
        )}
        <div className="edit-mode">
          <h3>{intl.get('create-new-list')}</h3>
          <div className="edit-mode-form">
            <div className="list-edit-field-wrap">
              <label htmlFor="list_edit">Name</label>
              <input type="text" value={listName} id="list_edit" className="list-edit-field" onChange={this.handleChange} />
              {listName.length > 0 && (<span role="presentation" className="clear-field-btn" onClick={this.clearListNameField} />)}
            </div>
            <div className="btn-container">
              <button type="button" className="ep-btn cancel-btn" onClick={this.handleHideListForm}>{intl.get('cancel')}</button>
              <button type="button" className="ep-btn primary save-btn" onClick={this.handleSaveList}>{intl.get('save')}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      empty, cartData, handleQuantityChange, itemDetailLink,
    } = this.props;
    const {
      openModal, listUrl, requisitionListData, addToRequisitionListLoading, showReqListForm,
    } = this.state;

    if (empty) {
      return (
        <div className="cart-empty-container">
          <span className="cart-empty-message">
            {intl.get('shopping-cart-empty-message')}
          </span>
        </div>
      );
    }
    return (
      <div className="cart-main-inner table-responsive">
        {cartData._lineitems[0]._element.map(product => (
          <CartLineItem
            key={product._item[0]._code[0].code}
            item={product}
            handleQuantityChange={() => {
              handleQuantityChange();
            }}
            onRemove={this.handleRemove}
            onConfiguratorAddToCart={this.handleConfiguratorAddToCart}
            onMoveToCart={this.handleMoveToCart}
            itemDetailLink={itemDetailLink}
            openReqListModal={(code, quantity) => { this.openReqListModal(code, quantity); }}
          />
        ))}
        <Modal open={openModal} onClose={this.handleModalClose}>
          <div className="modal-lg add-to-list-modal">
            <div className="dialog-header">
              <h2 className="modal-title">
                {intl.get('add-to-requisition-list')}
              </h2>
            </div>
            <div className="dialog-content">
              { showReqListForm ? (
                this.renderAddNewListForm()
              ) : (
                <button type="button" className="ep-btn create-req-list-btn" onClick={this.handleShowListForm}>{intl.get('create-new-requisition-list')}</button>
              )}
              <form className="create-list-form-wrap">
                <span className="your-list-title">{intl.get('your-lists')}</span>
                {(requisitionListData && requisitionListData.length > 0) && (
                  requisitionListData.map(list => (
                    <div key={list.name} className="list-item">
                      <input id={list.name} name={list.name} type="radio" checked={listUrl === list._additemstoitemlistform[0].self.uri} className="style-checkbox" onChange={() => this.handleSelectList(list)} />
                      <label htmlFor={list.name}>
                        {list.name}
                      </label>
                      <span className="count-items">
                        {list._paginatedlineitems[0].pagination.results}
                        <span className="item-text">
                          {intl.get('items')}
                        </span>
                      </span>
                    </div>
                  )))}
              </form>
            </div>
            <div className="dialog-footer">
              <button className="cancel" type="button" onClick={this.handleModalClose}>{intl.get('cancel')}</button>
              <button className="upload" type="button" onClick={this.handleAddToList}>
                {addToRequisitionListLoading ? (
                  <div className="miniLoader" />
                ) : (
                  <span>
                    {intl.get('add-to-list')}
                  </span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CartMain;
