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
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import AppHeaderSearchMain from './appheadersearch.main';
import AppHeaderLoginMain from './appheaderlogin.main';
import AppModalLoginMain from './appmodallogin.main';
import AppHeaderLocaleMain from './appheaderlocale.main';
import AppHeaderNavigationMain from './appheadernavigation.main';
import headerLogo from '../images/Company-Logo-v1.png';

class AppHeaderMain extends React.Component {
  static goBack() {
    window.history.back();
  }

  static propTypes = {
    hideHeaderNavigation: PropTypes.bool,
  }

  static defaultProps = {
    hideHeaderNavigation: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
    };
  }

  handleIsOffline = (isOfflineValue) => {
    this.setState({
      isOffline: isOfflineValue,
    });
  }

  render() {
    const { hideHeaderNavigation } = this.props;
    const { isOffline } = this.state;
    return (
      <div>
        <header className="app-header navbar navbar -fixed-top navbar-inverse" data-region="appHeader" style={{ display: 'block' }}>
          <div className="container appheader-container">
            <div className="back-button-container" style={{ display: 'block' }}>
              <div>
                <button type="button" id="header_mobile_back_button" aria-label="Back" className="navbar-back" data-region="backButtonRegion" data-el-label="navigation.back" onClick={AppHeaderMain.goBack}>
                  <span className="icon" />
                </button>
              </div>
            </div>
            <div className="logo-container" style={{ display: 'block' }}>
              <div>
                <a href="/" className="cmd-home-logo" id="header_home_logo_link" aria-label="Header home logo">
                  <img alt="Header logo" src={headerLogo} />
                </a>
              </div>
            </div>
            <button type="button" className="navbar-toggle" id="header_mobile_navbar_collapse_button" aria-label="Mobile nav bar collapse" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="icon" />
            </button>
            {(hideHeaderNavigation) ? '' : (
              <div className="collapse navbar-collapse">
                <ul className="global-nav-container btn-group" id="header_navbar_container_buttons">
                  <li className="global-nav-cart-nav">
                    <Link to="/mycart">
                      <button className="global-nav-link global-nav-cart" id="header_navbar_cart_button" aria-label="Cart" data-toggle="collapse" data-target=".navbar-collapse" type="button">
                        <span className="icon" />
                      </button>
                    </Link>
                  </li>
                  <AppHeaderLoginMain />
                  <AppHeaderLocaleMain />
                </ul>
                <AppHeaderSearchMain />
                <AppHeaderNavigationMain isOfflineCheck={this.handleIsOffline} />
              </div>
            )}
          </div>
        </header>
        <AppModalLoginMain />
        {(isOffline) ? (
          <div className="alert alert-primary fade in alert-dismissible">
            <strong className="text-center">
              {intl.get('network-offline')}
            </strong>
          </div>
        ) : ''}
      </div>
    );
  }
}

export default AppHeaderMain;
