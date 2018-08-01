/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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

  render() {
    const { hideHeaderNavigation } = this.props;
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
                <AppHeaderNavigationMain />
              </div>
            )}
          </div>
        </header>
        <AppModalLoginMain />
      </div>
    );
  }
}

export default AppHeaderMain;
