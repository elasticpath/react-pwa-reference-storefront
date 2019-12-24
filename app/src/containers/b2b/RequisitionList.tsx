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
import intl from 'react-intl-universal';

import './RequisitionList.less';
import { ReactComponent as AddToCartIcon } from '../../images/icons/ic_add_to_cart.svg';
import { ReactComponent as RecycleBinIcon } from '../../images/icons/ic_trash.svg';

interface CartCreateProps {
}
interface CartCreateState {
  requisitionElements: any,
}

class RequisitionList extends Component<CartCreateProps, CartCreateState> {
  static defaultProps = {
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
    };
    this.handleEditRequisition = this.handleEditRequisition.bind(this);
    this.handleDeleteRequisition = this.handleDeleteRequisition.bind(this);
    this.handleCancelEditRequisition = this.handleCancelEditRequisition.bind(this);
    this.modalConfirmation = this.modalConfirmation.bind(this);
  }

  componentDidMount() {
  }

  handleDeleteRequisition(element, index) {
    const { requisitionElements } = this.state;
    // eslint-disable-next-line no-console
    console.log('Delete', element, index);
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

  renderRequisitionItems() {
    const { requisitionElements } = this.state;
    if (requisitionElements.length) {
      return requisitionElements.map((el, index) => (
        <li className={`requisition-list-item ${el.deleteMode ? 'edit-mode-state' : ''}`} key={`requisitionItem_${el.name ? el.name.trim() : 'default'}`} role="presentation">
          <h4 className="requisition-info">{el.name}</h4>
          <p className="requisition-info product-count">
            {el['product-count']}
          </p>
          <div className="requisition-info action-btn">
            <div className="requisition-editing-btn">
              <button className="ep-btn edit-btn" type="button">
                <AddToCartIcon className="add-to-cart-icon" />
              </button>
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
    return (
      <div>
        <div className="requisition-list-wrap">
          <ul className="requisition-list">
            <li className="requisition-list-item requisition-list-header">
              <h4 className="requisition-info">Name</h4>
              <h4 className="requisition-info">Product Count</h4>
              <h4 className="requisition-info">Actions</h4>
            </li>
            {this.renderRequisitionItems()}
          </ul>
        </div>
      </div>
    );
  }
}

export default RequisitionList;
