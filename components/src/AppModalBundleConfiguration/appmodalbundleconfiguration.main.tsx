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

import React from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
/* eslint-disable-next-line import/no-cycle */
import CartLineItem from '../CartLineItem/cart.lineitem';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
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

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface AppModalBundleConfigurationMainProps {
    bundleConfigurationItems: {
        [key: string]: any
    },
    handleModalClose: (...args: any[]) => any,
    openModal: boolean
    onItemConfiguratorAddToCart?: (...args: any[]) => any,
    onItemMoveToCart?: (...args: any[]) => any,
    onItemRemove?: (...args: any[]) => any,
    itemDetailLink?: string,
}
interface AppModalBundleConfigurationMainState {
    dependantItemData: any,
    isLoading: boolean,
    registrationErrors: string,
}

class AppModalBundleConfigurationMain extends React.Component<AppModalBundleConfigurationMainProps, AppModalBundleConfigurationMainState> {
  static defaultProps = {
    onItemConfiguratorAddToCart: () => {},
    onItemMoveToCart: () => {},
    onItemRemove: () => {},
    itemDetailLink: '',
  };

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      dependantItemData: undefined,
      isLoading: false,
      registrationErrors: '',
    };
    this.handleErrorMessage = this.handleErrorMessage.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleConfiguratorAddToCart = this.handleConfiguratorAddToCart.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    const { bundleConfigurationItems } = this.props;
    this.fetchDependantItemData(bundleConfigurationItems);
  }


  componentDidUpdate(prevProps) {
    const { bundleConfigurationItems } = this.props;
    this.fetchDependantItemData(bundleConfigurationItems);
  }

  fetchDependantItemData(bundleConfigurationItems) {
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

  handleConfiguratorAddToCart() {
    const { onItemConfiguratorAddToCart } = this.props;
    onItemConfiguratorAddToCart();
  }

  handleMoveToCart() {
    const { onItemMoveToCart } = this.props;
    onItemMoveToCart();
  }

  handleRemove() {
    const { onItemRemove } = this.props;
    onItemRemove();
  }

  render() {
    const { isLoading, registrationErrors, dependantItemData } = this.state;
    const { handleModalClose, openModal, itemDetailLink } = this.props;
    if (dependantItemData && dependantItemData._dependentoptions && dependantItemData._dependentlineitems && (dependantItemData._dependentoptions[0]._element || dependantItemData._dependentlineitems[0]._element)) {
      return (
        <Modal open={openModal} onClose={handleModalClose} classNames={{ modal: 'bundle-configurator-modal-content' }}>
          <div className="modal-dialog">
            <div className="modal-content" id="simplemodal-container">
              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('configure-bundle-configurator')}
                </h2>
              </div>

              {(dependantItemData._dependentlineitems[0] && dependantItemData._dependentlineitems[0]._element) ? (
                <div className="modal-body bundle-configurator-selected-items">
                  <h2 className="modal-title">
                    {intl.get('bundle-configurator-selected-items')}
                  </h2>
                  <div className="table-responsive">
                    {dependantItemData._dependentlineitems[0]._element.map(product => (
                      <CartLineItem
                        key={product._item[0]._code[0].code}
                        item={product}
                        handleQuantityChange={() => { this.handleQuantityChange(); }}
                        hideQuantitySelector
                        handleErrorMessage={this.handleErrorMessage}
                        onRemove={this.handleRemove}
                        onConfiguratorAddToCart={this.handleConfiguratorAddToCart}
                        onMoveToCart={this.handleMoveToCart}
                        itemDetailLink={itemDetailLink}
                      />
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
                  <div className="table-responsive">
                    {dependantItemData._dependentoptions[0]._element.map(product => (
                      <CartLineItem
                        key={product._code[0].code}
                        item={product}
                        handleQuantityChange={() => { this.handleQuantityChange(); }}
                        hideRemoveButton
                        hideQuantitySelector
                        handleErrorMessage={this.handleErrorMessage}
                        onRemove={this.handleRemove}
                        onConfiguratorAddToCart={this.handleConfiguratorAddToCart}
                        onMoveToCart={this.handleMoveToCart}
                        itemDetailLink={itemDetailLink}
                      />
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
