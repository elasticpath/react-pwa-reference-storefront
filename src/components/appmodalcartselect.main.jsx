/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { withRouter } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import cortexFetch from '../utils/Cortex';
import './appmodalcartselect.main.less';

const zoomArray = [
  'authorizationcontexts',
  'authorizationcontexts:element',
  'authorizationcontexts:element:element',
  'authorizationcontexts:element:element:accesstokenform',
];

const Config = require('Config');

class AppModalCartSelectMain extends React.Component {
  static propTypes = {
    handleModalClose: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      orgEamData: undefined,
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
    cortexFetch(`/admin_eam?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenEam`),
      },
    })
      .then(res => res.json())
      .then((res) => {
        const orgEamData = res._authorizationcontexts[0]._element.find(element => element.name === /* Config.cortexApi.scope.toUpperCase() */ 'MOBEE');
        this.setState({
          orgEamData,
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
      orgEamData,
    } = this.state;
    const { handleModalClose } = this.props;

    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      const selectedCartData = orgEamData._element[selectedCart];
      localStorage.setItem(`${Config.cortexApi.scope}_b2bCart`, selectedCartData.name);
      cortexFetch(`${selectedCartData._accesstokenform[0].self.uri}/admin_eam?followlocation`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenEam`),
        },
        body: JSON.stringify({}),
      })
        .then(res => res.json())
        .then((data) => {
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${data.token}`);
          handleModalClose();
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
    const { selectedCart, orgEamData } = this.state;

    if (orgEamData) {
      return orgEamData._element.map((division, index) => {
        if (division) {
          return (
            <div className="radio">
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
    return null;
  }

  render() {
    const { selectedCart, orgEamData } = this.state;
    const { handleModalClose, openModal } = this.props;
    const selectedCartName = orgEamData ? orgEamData._element[selectedCart].name : '';

    return (
      <Modal open={openModal} onClose={handleModalClose} classNames={{ modal: 'cart-selection-modal-content' }} id="cart-select-modal">
        <div className="modal-lg">
          <div className="modal-content" id="simplemodal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {intl.get('change-carts')}
              </h2>
            </div>

            <div className="modal-body">
              <div id="cart_selection_modal_form">
                <div className="carts-selection-region">
                  {this.renderCartOption()}
                </div>
                <div className="action-row">
                  <div className="form-input btn-container">
                    <button onClick={this.continueCart} className="ep-btn primary wide" id="continue_with_cart_button" data-cmd="continue" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                      {intl.get('continue-with')}
                      {` ${selectedCartName}`}
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

export default withRouter(AppModalCartSelectMain);
