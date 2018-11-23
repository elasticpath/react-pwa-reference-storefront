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
/* eslint-disable-next-line import/no-cycle */
import CartLineItem from './cart.lineitem';
import './appmodalbundleconfiguration.main.less';


class AppModalBundleConfigurationMain extends React.Component {
  static propTypes = {
    bundleConfigurationItems: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      registrationErrors: '',
    };
    this.handleErrorMessage = this.handleErrorMessage.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { bundleConfigurationItems } = this.props;
    if ((nextProps.bundleConfigurationItems && bundleConfigurationItems) && (nextProps.bundleConfigurationItems._dependentlineitems[0] !== bundleConfigurationItems._dependentlineitems[0])) {
      this.setState({
        isLoading: false,
        registrationErrors: '',
      });
    } else {
      this.setState({
        registrationErrors: '',
      });
    }
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
    const { bundleConfigurationItems } = this.props;
    const { isLoading, registrationErrors } = this.state;
    if (bundleConfigurationItems && (bundleConfigurationItems._dependentoptions[0]._element || bundleConfigurationItems._dependentlineitems[0]._element)) {
      return (
        <div className="modal bundle-configurator-modal-content" id="bundle-configuration-modal">
          <div className="modal-dialog">
            <div className="modal-content" id="simplemodal-container">

              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('configure-bundle-configurator')}
                </h2>
                <button type="button" id="bundle_configurator_modal_close_button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>

              {(bundleConfigurationItems._dependentlineitems[0] && bundleConfigurationItems._dependentlineitems[0]._element) ? (
                <div className="modal-body bundle-configurator-selected-items">
                  <h2 className="modal-title">
                    {intl.get('bundle-configurator-selected-items')}
                  </h2>
                  <div className="wish-list-main-inner table-responsive">
                    {bundleConfigurationItems._dependentlineitems[0]._element.map(product => (
                      <CartLineItem key={product._item[0]._code[0].code} item={product} handleQuantityChange={() => { this.handleQuantityChange(); }} hideQuantitySelector handleErrorMessage={this.handleErrorMessage} />
                    ))}
                  </div>
                </div>
              ) : ('')
              }

              {(bundleConfigurationItems._dependentoptions[0] && bundleConfigurationItems._dependentoptions[0]._element) ? (
                <div className="modal-body bundle-configurator-available-items">
                  <h2 className="modal-title">
                    {intl.get('bundle-configurator-available-items')}
                  </h2>
                  <div className="wish-list-main-inner table-responsive">
                    {bundleConfigurationItems._dependentoptions[0]._element.map(product => (
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
        </div>
      );
    }
    return ('');
  }
}

export default withRouter(AppModalBundleConfigurationMain);
