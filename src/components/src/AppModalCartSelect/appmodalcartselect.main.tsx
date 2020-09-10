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
import { ReactComponent as CloseIcon } from '../../../images/icons/ic_close.svg';
import { cortexFetch } from '../utils/Cortex';
import Config from '../../../ep.config.json';

import './appmodalcartselect.main.scss';

const zoomArray = [
  'element',
  'element:attributes',
  'element:identifier',
];

interface AppModalCartSelectMainProps {
  /** handle modal close */
  handleModalClose: (...args: any[]) => any,
  /** open modal */
  openModal: boolean,
  /** handle continue cart */
  onContinueCart?: (...args: any[]) => any,
}

interface AppModalCartSelectMainState {
  orgAuthServiceData: any,
  selectedCart: string,
  selectedCartName: string,
}

class AppModalCartSelectMain extends Component<AppModalCartSelectMainProps, AppModalCartSelectMainState> {
  static defaultProps = {
    onContinueCart: () => { },
  };

  constructor(props) {
    super(props);

    this.state = {
      orgAuthServiceData: undefined,
      selectedCart: '0',
      selectedCartName: '',
    };

    this.continueCart = this.continueCart.bind(this);
    this.fetchOrganizationData = this.fetchOrganizationData.bind(this);
    this.handleCartChange = this.handleCartChange.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  componentDidMount() {
    // this.continueCart();
    this.fetchOrganizationData();
  }

  fetchOrganizationData() {
    cortexFetch(`/accounts/${Config.cortexApi.scope}/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          orgAuthServiceData: res,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  async continueCart() {
    const {
      selectedCart,
      orgAuthServiceData,
    } = this.state;
    const { handleModalClose, onContinueCart } = this.props;

    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      const selectedCartData = orgAuthServiceData._element[selectedCart];
      localStorage.setItem(`${Config.cortexApi.scope}_b2bCart`, selectedCartData['account-business-name']);
      localStorage.setItem(`${Config.cortexApi.scope}_b2bSharedId`, orgAuthServiceData._element[selectedCart]._identifier[0]['shared-id']);
      await handleModalClose();
      onContinueCart();
    }
  }

  handleCartChange(event, cartName) {
    this.setState({
      selectedCart: event.target.value,
      selectedCartName: cartName,
    });
  }

  onModalClose() {
    const { handleModalClose } = this.props;
    this.setState({
      selectedCartName: '',
    });
    handleModalClose();
  }

  renderCartOption() {
    const { selectedCart, orgAuthServiceData, selectedCartName } = this.state;
    const checkedCartName = localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`);
    const isCheckedCartName = localStorage.getItem(`${Config.cortexApi.scope}_b2bCart`) === null;
    if (orgAuthServiceData && orgAuthServiceData._element) {
      return orgAuthServiceData._element.map((division, index) => {
        if (division) {
          return (
            <div className="radio" key={division['account-business-name']}>
              <label htmlFor={`cart-selection-option${index}`} className="custom-radio-button">
                <input id={`cart-selection-option${index}`} type="radio" value={index} checked={(selectedCartName.length === 0 && !isCheckedCartName) ? checkedCartName === division['account-business-name'] : selectedCart === `${index}`} onChange={event => this.handleCartChange(event, division['account-business-name'])} />
                <span className="helping-el" />
                <span className="label-text">{division['account-business-name']}</span>
              </label>
            </div>
          );
        }
        return null;
      });
    }
    return (
      <div className="radio division-message">
        <label htmlFor="cart-selection-option">
          <span className="label-text">{intl.get('no-divisions-found')}</span>
        </label>
      </div>
    );
  }

  render() {
    const { selectedCart, orgAuthServiceData } = this.state;
    const { handleModalClose, openModal } = this.props;
    const selectedCartName = orgAuthServiceData && orgAuthServiceData._element ? orgAuthServiceData._element[selectedCart]['account-business-name'] : '';

    return (
      <Modal open={openModal} onClose={this.onModalClose} classNames={{ modal: 'cart-selection-modal-content' }} showCloseIcon={false}>
        <div className="modal-lg">
          <div className="modal-content" id="simplemodal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {(orgAuthServiceData && !orgAuthServiceData._element)
                  ? (intl.get('shop-for-permission-denied'))
                  : (intl.get('shop-for'))
                }
              </h2>
              <button type="button" aria-label="close" className="close-modal-btn" onClick={this.onModalClose}>
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div id="cart_selection_modal_form">
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                <div className="carts-selection-region" role="presentation" tabIndex={0}>
                  {this.renderCartOption()}
                </div>
                <div className="action-row">
                  <div className="form-input btn-container">
                    <button onClick={(orgAuthServiceData && !orgAuthServiceData._element) || !orgAuthServiceData ? handleModalClose : this.continueCart} className="ep-btn primary wide" id="continue_with_cart_button" data-cmd="continue" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                      {((orgAuthServiceData && !orgAuthServiceData._element) || !orgAuthServiceData)
                        ? (intl.get('shop-for-ok'))
                        : (`${intl.get('continue-with')} ${selectedCartName}`)
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AppModalCartSelectMain;
