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
  showReqListForm: boolean,
  requisitionListData: any,
  itemData: {code: string, quantity: number},
  listUrl: string,
  addToRequisitionListLoading: boolean,
}

const requisitionListsZoomArray = [
  'itemlistinfo',
  'itemlistinfo:allitemlists',
  'itemlistinfo:allitemlists:element',
  'itemlistinfo:allitemlists:element:lineitems',
  'itemlistinfo:allitemlists:element:paginatedlineitems',
  'itemlistinfo:allitemlists:element:additemstoitemlistform',
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
      showReqListForm: false,
      requisitionListData: undefined,
      itemData: {
        code: '', quantity: 0,
      },
      listUrl: '',
      addToRequisitionListLoading: false,
    };

    this.handleConfiguratorAddToCart = this.handleConfiguratorAddToCart.bind(this);
    this.handleMoveToCart = this.handleMoveToCart.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.openReqListModal = this.openReqListModal.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleShowReqListForm = this.handleShowReqListForm.bind(this);
    this.fetchRequisitionListsData = this.fetchRequisitionListsData.bind(this);
    this.handleSelectList = this.handleSelectList.bind(this);
    this.handleAddToList = this.handleAddToList.bind(this);
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
      addToRequisitionListLoading: false, openModal: false, itemData: { code: '', quantity: 0 }, listUrl: '',
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

  handleShowReqListForm() {
    this.setState({
      showReqListForm: true,
    });
  }

  handleRemove() {
    const { onItemRemove } = this.props;
    onItemRemove();
  }

  render() {
    const {
      empty, cartData, handleQuantityChange, itemDetailLink,
    } = this.props;
    const {
      openModal, listUrl, showReqListForm, requisitionListData, addToRequisitionListLoading,
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
              <button type="button" className="ep-btn create-req-list-btn" onClick={this.handleShowReqListForm}>{intl.get('create-new-requisition-list')}</button>
              <form className="create-list-form-wrap">
                <span className="your-list-title">{intl.get('your-lists')}</span>
                {(requisitionListData && requisitionListData.length > 0) && (
                  requisitionListData.map(list => (
                    <div key={list.name} className="list-item">
                      <input id={list.name} name={list.name} type="radio" checked={listUrl === list._additemstoitemlistform[0].self.uri} className="style-checkbox" onClick={() => this.handleSelectList(list)} />
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
