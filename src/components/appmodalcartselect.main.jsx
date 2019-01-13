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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import { withRouter } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import './appmodalcartselect.main.less';

const Config = require('Config');

const optionCarts = [
  { optionNum: 0, optionName: 'GLOBEX EASTERN', divisions: [{ divisionNum: 0, divisionName: 'Division 1' }, { divisionNum: 1, divisionName: 'Division 2' }] },
  { optionNum: 1, optionName: 'GLOBEX Western' },
  { optionNum: 2, optionName: 'GLOBEX Team A1' },
  { optionNum: 3, optionName: 'GLOBEX Superstar' },
  { optionNum: 4, optionName: 'Hooli' },
  { optionNum: 5, optionName: 'Pied Piper' },
];

class AppModalCartSelectMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    handleModalClose: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedCart: '0',
      selectedDivision: '0',
      selectedCartName: optionCarts[0].optionName,
      selectedDivisionName: optionCarts[0].divisions[0].divisionName,
      divisionSelection: false,
    };
    this.continueCart = this.continueCart.bind(this);
    this.handleCartChange = this.handleCartChange.bind(this);
    this.handleDivisionChange = this.handleDivisionChange.bind(this);
  }

  componentDidMount() {
    // this.continueCart();
  }

  continueCart(event) {
    const {
      selectedCart, selectedCartName, selectedDivisionName, divisionSelection,
    } = this.state;
    const { history } = this.props;

    if (!divisionSelection && optionCarts && optionCarts[parseInt(selectedCart, 10)].divisions) {
      this.setState({
        divisionSelection: true,
      });
      event.preventDefault();
    } else if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED') {
      localStorage.setItem(`${Config.cortexApi.scope}_b2bCart`, selectedCartName);
      if (!optionCarts[parseInt(selectedCart, 10)].divisions) {
        localStorage.setItem(`${Config.cortexApi.scope}_b2bDivision`, '');
      } else {
        localStorage.setItem(`${Config.cortexApi.scope}_b2bDivision`, selectedDivisionName);
      }
      this.setState({
        divisionSelection: false,
      });
      history.push('/');
    }
  }

  handleCartChange(event) {
    this.setState({
      selectedCart: event.target.value,
      selectedCartName: optionCarts[event.target.value].optionName,
    });
  }

  handleDivisionChange(event) {
    const { selectedCart } = this.state;

    this.setState({
      selectedDivision: event.target.value,
      selectedDivisionName: optionCarts[parseInt(selectedCart, 10)].divisions[event.target.value].divisionName,
    });
  }


  renderCartOption() {
    const { selectedCart } = this.state;

    if (optionCarts) {
      return optionCarts.map((option) => {
        if (option) {
          return (
            <div className="radio">
              <label htmlFor={`cart-selection-option${option.optionNum}`} className="custom-radio-button">
                <input id={`cart-selection-option${option.optionNum}`} type="radio" value={option.optionNum} checked={selectedCart === `${option.optionNum}`} onChange={this.handleCartChange} />
                <span className="helping-el" />
                <span className="label-text">{option.optionName}</span>
              </label>
            </div>
          );
        }
        return null;
      });
    }
    return null;
  }

  renderDivisionOption() {
    const { selectedCart, selectedDivision } = this.state;

    if (optionCarts && optionCarts[parseInt(selectedCart, 10)].divisions) {
      return optionCarts[parseInt(selectedCart, 10)].divisions.map((division) => {
        if (division) {
          return (
            <div className="radio">
              <label htmlFor={`cart-selection-option${division.divisionNum}`} className="custom-radio-button">
                <input id={`cart-selection-option${division.divisionNum}`} type="radio" value={division.divisionNum} checked={selectedDivision === `${division.divisionNum}`} onChange={this.handleDivisionChange} />
                <span className="helping-el" />
                <span className="label-text">{division.divisionName}</span>
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
    const { selectedCartName, selectedDivisionName, divisionSelection } = this.state;
    const { handleModalClose, openModal } = this.props;

    return (
      <Modal open={openModal} onClose={handleModalClose} classNames={{ modal: 'cart-selection-modal-content' }} id="cart-select-modal">
        <div className="modal-lg">

          {(divisionSelection) ? (
            <div className="modal-content" id="simplemodal-container">
              <div className="modal-header">
                <h2 className="modal-title">
                  Change Division
                </h2>
              </div>
              <div className="modal-body">
                <form id="cart_selection_modal_form" onSubmit={this.continueCart}>
                  <div className="carts-selection-region">
                    {this.renderDivisionOption()}
                  </div>
                  <div className="action-row">
                    <div className="form-input btn-container">
                      <button className="ep-btn primary wide" id="continue_with_cart_button" data-cmd="continue" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                        {intl.get('continue-with')}
                        {` ${selectedDivisionName}`}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="modal-content" id="simplemodal-container-division">
              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('change-carts')}
                </h2>
              </div>

              <div className="modal-body">
                <form id="cart_selection_modal_form" onSubmit={this.continueCart}>
                  <div className="carts-selection-region">
                    {this.renderCartOption()}
                  </div>
                  <div className="action-row">
                    <div className="form-input btn-container">
                      <button className="ep-btn primary wide" id="continue_with_cart_button" data-cmd="continue" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                        {intl.get('continue-with')}
                        {` ${selectedCartName}`}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )
          }
        </div>
      </Modal>
    );
  }
}

export default withRouter(AppModalCartSelectMain);
