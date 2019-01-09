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
/* eslint-disable-next-line import/no-cycle */
import CartLineItem from './cart.lineitem';
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';
import './appmodalbundleconfiguration.main.less';

const zoomArray = [
  'dependentoptions',
  'dependentoptions:element',
  'dependentoptions:element:price',
  'dependentoptions:element:addtocartform',
  'dependentoptions:element:availability',
  'dependentoptions:element:definition',
  'dependentoptions:element:definition:options:element',
  'dependentoptions:element:definition:options:element:value',
  'dependentoptions:element:code',
  'dependentlineitems',
  'dependentlineitems:element',
  'dependentlineitems:element:item:price',
  'dependentlineitems:element:item:availability',
  'dependentlineitems:element:item:definition',
  'dependentlineitems:element:item:definition:options:element',
  'dependentlineitems:element:item:definition:options:element:value',
  'dependentlineitems:element:item:code',
  'dependentlineitems:element:dependentoptions',
  'dependentlineitems:element:dependentoptions:element',
  'dependentlineitems:element:dependentlineitems',
  'dependentlineitems:element:dependentlineitems:element:item:definition',
];

const Config = require('Config');

class AppModalBundleConfigurationMain extends React.Component {
  static propTypes = {
    bundleConfigurationItems: PropTypes.objectOf(PropTypes.any).isRequired,
    handleModalClose: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      dependantItemData: undefined,
      isLoading: false,
      registrationErrors: '',
    };
    this.handleErrorMessage = this.handleErrorMessage.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  componentDidMount() {
    this.fetchDependantItemData();
  }

  // TODO: Add some kind of check to prevent extra network calls
  componentWillReceiveProps() {
    this.fetchDependantItemData();
  }

  fetchDependantItemData() {
    const { bundleConfigurationItems } = this.props;
    login().then(() => {
      cortexFetch(`${bundleConfigurationItems.self.uri}/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            dependantItemData: res,
            isLoading: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleQuantityChange() {
    this.setState({
      isLoading: true,
      registrationErrors: '',
    });
  }

  handleErrorMessage(errorResponse) {
    this.setState({
      registrationErrors: errorResponse.messages[0]['debug-message'],
      isLoading: false,
    });
  }

  render() {
    const { isLoading, registrationErrors, dependantItemData } = this.state;
    const { bundleConfigurationItems, handleModalClose, openModal } = this.props;
    let itemCodeString = '';
    if (dependantItemData && dependantItemData._dependentoptions && dependantItemData._dependentlineitems && (dependantItemData._dependentoptions[0]._element || dependantItemData._dependentlineitems[0]._element)) {
      if (bundleConfigurationItems._item && bundleConfigurationItems._item[0]._code[0]) {
        itemCodeString = bundleConfigurationItems._item[0]._code[0].code;
      }
      return (
        <Modal open={openModal} onClose={handleModalClose} className="modal bundle-configurator-modal-content" id={`bundle-configuration-modal-${itemCodeString}`}>
          <div className="modal-dialog">
            <div className="modal-content" id="simplemodal-container">
              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('configure-bundle-configurator')}
                </h2>
                {/* <button type="button" onClick={() => handleModalClose()} className="close bundle_configurator_modal_close_button" data-dismiss="modal">
                  &times;
                </button> */}
              </div>

              {(dependantItemData._dependentlineitems[0] && dependantItemData._dependentlineitems[0]._element) ? (
                <div className="modal-body bundle-configurator-selected-items">
                  <h2 className="modal-title">
                    {intl.get('bundle-configurator-selected-items')}
                  </h2>
                  <div className="wish-list-main-inner table-responsive">
                    {dependantItemData._dependentlineitems[0]._element.map(product => (
                      <CartLineItem key={product._item[0]._code[0].code} item={product} handleQuantityChange={() => { this.handleQuantityChange(); }} hideQuantitySelector handleErrorMessage={this.handleErrorMessage} />
                    ))}
                  </div>
                </div>
              ) : ('')
              }

              {(dependantItemData._dependentoptions[0] && dependantItemData._dependentoptions[0]._element) ? (
                <div className="modal-body bundle-configurator-available-items">
                  <h2 className="modal-title">
                    {intl.get('bundle-configurator-available-items')}
                  </h2>
                  <div className="wish-list-main-inner table-responsive">
                    {dependantItemData._dependentoptions[0]._element.map(product => (
                      <CartLineItem key={product._code[0].code} item={product} handleQuantityChange={() => { this.handleQuantityChange(); }} hideRemoveButton hideQuantitySelector handleErrorMessage={this.handleErrorMessage} />
                    ))}
                  </div>
                </div>
              ) : ('')
              }

              {
                (isLoading) ? <div className="miniLoader" /> : ('')
              }
              <div className="feedback-label" id="bundle_configurator_feedback_container">
                {(registrationErrors !== '') ? (registrationErrors) : ('')}
              </div>
            </div>
          </div>
        </Modal>
      );
    }
    return ('');
  }
}

export default withRouter(AppModalBundleConfigurationMain);
