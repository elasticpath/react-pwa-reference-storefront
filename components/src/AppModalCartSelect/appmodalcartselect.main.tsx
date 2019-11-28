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
import { adminFetch } from '../utils/Cortex';
import './appmodalcartselect.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

const zoomArray = [
  'authorizationcontexts',
  'authorizationcontexts:element',
  'authorizationcontexts:element:element',
  'authorizationcontexts:element:element:accesstokenform',
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
}

class AppModalCartSelectMain extends Component<AppModalCartSelectMainProps, AppModalCartSelectMainState> {
  static defaultProps = {
    onContinueCart: () => { },
  };

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = getConfig());
    this.state = {
      orgAuthServiceData: undefined,
      selectedCart: '0',
    };
    this.continueCart = this.continueCart.bind(this);
    this.fetchOrganizationData = this.fetchOrganizationData.bind(this);
    this.handleCartChange = this.handleCartChange.bind(this);
  }

  componentDidMount() {
    // this.continueCart();
    this.fetchOrganizationData();
  }

  fetchOrganizationData() {
    adminFetch(`/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
      },
    })
      .then(res => res.json())
      .then((res) => {
        const orgAuthServiceData = res._authorizationcontexts[0]._element.find(element => element.name.toUpperCase() === Config.cortexApi.scope.toUpperCase());
        this.setState({
          orgAuthServiceData,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  continueCart() {
    const {
      selectedCart,
      orgAuthServiceData,
    } = this.state;
    const { handleModalClose, onContinueCart } = this.props;

    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      const selectedCartData = orgAuthServiceData._element[selectedCart];
      localStorage.setItem(`${Config.cortexApi.scope}_b2bCart`, selectedCartData.name);
      adminFetch(`${selectedCartData._accesstokenform[0].self.uri}/?followlocation=true`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
        body: JSON.stringify({}),
      })
        .then(res => res.json())
        .then((data) => {
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${data.token}`);
          handleModalClose();
          onContinueCart();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    }
  }

  handleCartChange(event) {
    this.setState({
      selectedCart: event.target.value,
    });
  }

  renderCartOption() {
    const { selectedCart, orgAuthServiceData } = this.state;

    if (orgAuthServiceData && orgAuthServiceData._element) {
      return orgAuthServiceData._element.map((division, index) => {
        if (division) {
          return (
            <div className="radio" key={division.name}>
              <label htmlFor={`cart-selection-option${index}`} className="custom-radio-button">
                <input id={`cart-selection-option${index}`} type="radio" value={index} checked={selectedCart === `${index}`} onChange={this.handleCartChange} />
                <span className="helping-el" />
                <span className="label-text">{division.name}</span>
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
    const selectedCartName = orgAuthServiceData && orgAuthServiceData._element ? orgAuthServiceData._element[selectedCart].name : '';

    return (
      <Modal open={openModal} onClose={handleModalClose} classNames={{ modal: 'cart-selection-modal-content' }}>
        <div className="modal-lg">
          <div className="modal-content" id="simplemodal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {(orgAuthServiceData && !orgAuthServiceData._element)
                  ? (intl.get('change-carts-permission-denied'))
                  : (intl.get('change-carts'))
                }
              </h2>
            </div>

            <div className="modal-body">
              <div id="cart_selection_modal_form">
                <div className="carts-selection-region">
                  {this.renderCartOption()}
                </div>
                <div className="action-row">
                  <div className="form-input btn-container">
                    <button onClick={(orgAuthServiceData && !orgAuthServiceData._element) || !orgAuthServiceData ? handleModalClose : this.continueCart} className="ep-btn primary wide" id="continue_with_cart_button" data-cmd="continue" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                      {((orgAuthServiceData && !orgAuthServiceData._element) || !orgAuthServiceData)
                        ? (intl.get('change-carts-ok'))
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
