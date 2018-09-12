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
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { login, logout } from '../utils/AuthService';
import AppHeaderSearchMain from './appheadersearch.main';
import AppHeaderLoginMain from './appheaderlogin.main';
import AppHeaderLocaleMain from './appheaderlocale.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'navigations:element',
  'navigations:element:child',
];

class AppHeaderNavigationMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    isOfflineCheck: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      navigations: [],
    };
  }

  componentWillMount() {
    login()
      .then(() => cortexFetch(`/?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        }))
      .then((res) => {
        if (res.status === 504 || res.status === 503) {
          const { history } = this.props;
          history.push('/maintenance');
        }
        if (res.status === 401 || res.status === 403) {
          logout().then(() => {
            login().then(() => {
              const { history } = this.props;
              history.push('/');
              window.location.reload();
            });
          });
        }
        return res;
      })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          navigations: res._navigations[0]._element,
        });
        this.handleIsOffline(false);
      })
      .catch((error) => {
        if (error.status === 504 || error.status === 503) {
          const { history } = this.props;
          history.push('/maintenance');
        } else {
          // eslint-disable-next-line no-console
          console.error(error.message);
          this.handleIsOffline(true);
        }
      });
  }

  handleIsOffline = (isOfflineValue) => {
    const { isOfflineCheck } = this.props;
    isOfflineCheck(isOfflineValue);
  }

  renderCategories() {
    const { navigations } = this.state;
    return navigations.map((category) => {
      if (category._child) {
        return (
          <li className="nav-item dropdown" key={category.name} data-name={category['display-name']} data-el-container="category-nav-item-container">
            <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {category['display-name']}
            </a>
            <div className="dropdown-menu sub-category-dropdown-menu" aria-label="navbarDropdown">
              {category._child.map(subcategory => (
                <Link to={`/category/${encodeURIComponent(subcategory.self.uri)}`} key={subcategory.name} className="dropdown-item" id={`header_navbar_sub_category_button_${subcategory.name}`} data-target=".navbar-collapse" title={subcategory['display-name']}>
                  <div data-toggle="collapse" data-target=".navbar-collapse">
                    <span>
                      {subcategory['display-name']}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </li>
        );
      }
      return (
        <li key={category.name} data-name={category['display-name']} data-el-container="category-nav-item-container">
          <Link to={`/category/${encodeURIComponent(category.self.uri)}`} className="nav-item" id={`header_navbar_category_button_${category.name}`} title={category['display-name']}>
            <div data-toggle="collapse" data-target=".navbar-collapse">
              <span>
                {category['display-name']}
              </span>
            </div>
          </Link>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="main-nav-container" id="header_navbar_container" data-region="mainNavRegion" style={{ display: 'block' }}>
        <div>
          <AppHeaderSearchMain />
          <nav className="main-nav">
            <button className="btn-main-nav-toggle btn-link-cmd" type="button" id="header_navbar_container_categories_button" style={{ display: 'none' }}>
              {intl.get('categories')}
            </button>
            <ul className="main-nav-list nav navbar-nav" data-region="mainNavList">
              <li key="locale-nav-mobile" className="locale-nav-mobile main-locale-container">
                <AppHeaderLocaleMain />
              </li>
              <li key="shopping-cart-mobile" className="shopping-cart-mobile">
                <Link to="/mycart" className="nav-item shopping-cart-mobile-link">
                  <span>
                    {intl.get('shopping-cart')}
                  </span>
                </Link>
              </li>
              {this.renderCategories()}
              <div className="authentication-nav-mobile">
                <AppHeaderLoginMain isMobileView />
              </div>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default withRouter(AppHeaderNavigationMain);
