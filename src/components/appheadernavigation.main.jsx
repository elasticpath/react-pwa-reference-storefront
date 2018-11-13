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
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { login, logout } from '../utils/AuthService';
import { cortexFetchNavigationLookupForm, cortexFetchItemLookupForm, cortexFetchPurchaseLookupForm } from '../utils/CortexLookup';
import cortexFetch from '../utils/Cortex';

import './appheadernavigation.main.less';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'navigations:element',
  'navigations:element:child',
];

class AppHeaderNavigationMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    isOfflineCheck: PropTypes.func.isRequired,
    isOffline: PropTypes.bool,
    isMobileView: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isOffline: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
      navigations: [],
    };
  }

  componentWillMount() {
    this.fetchNavigationData();
  }

  componentWillReceiveProps() {
    const { isOffline, isOfflineCheck, location } = this.props;
    const { navigations } = this.state;
    if (!navigator.onLine && !isOffline && isOffline !== undefined) {
      isOfflineCheck(true);
    } else if (navigator.onLine && isOffline) {
      isOfflineCheck(false);
    }
    if (navigations.length === 0 && location.pathname === '/maintenance') {
      this.fetchNavigationData();
    }
  }

  fetchNavigationData() {
    login()
      .then(() => cortexFetch(`/?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        }))
      .then((res) => {
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
      .then((res) => {
        cortexFetchNavigationLookupForm()
          .then(() => cortexFetchItemLookupForm())
          .then(() => cortexFetchPurchaseLookupForm());
        return res;
      })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          navigations: res._navigations[0]._element,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  render() {
    const { navigations } = this.state;
    const { isMobileView } = this.props;

    return (
      <div className={`app-header-navigation-component ${isMobileView ? 'mobile-view' : ''}`}>
        <ul className="navbar-nav nav mr-auto mt-2 mt-lg-0">
          {navigations.map(category => (
            category._child
              ? (
                <li className="nav-item dropdown" key={category.name} data-name={category['display-name']} data-el-container="category-nav-item-container">
                  <a className="nav-link dropdown-toggle" href="/" id={`${isMobileView ? 'mobile_' : ''}navbarDropdown_${category.name}`} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {category['display-name']}
                  </a>
                  <div className="dropdown-menu sub-category-dropdown-menu" aria-label={`navbarDropdown_${category.name}`}>
                    {category._child.map(subcategory => (
                      <Link to={`/category/${encodeURIComponent(subcategory.name)}`} key={subcategory.name} className="dropdown-item" id={`${isMobileView ? 'mobile_' : ''}header_navbar_sub_category_button_${subcategory.name}`} title={subcategory['display-name']}>
                        <div
                          data-toggle="collapse"
                          data-target={isMobileView ? '.collapsable-container' : ''}
                        >
                          {subcategory['display-name']}
                        </div>
                      </Link>
                    ))}
                  </div>
                </li>
              )
              : (
                <li className="nav-item" key={category.name} data-name={category['display-name']} data-toggle="collapse" data-target=".navbar-collapse">
                  <Link className="nav-link" to={`/category/${encodeURIComponent(category.name)}`}>
                    <div
                      data-toggle="collapse"
                      data-target={isMobileView ? '.collapsable-container' : ''}
                    >
                      {category['display-name']}
                    </div>
                  </Link>
                </li>
              )
          ))}
        </ul>
      </div>
    );
  }
}

export default withRouter(AppHeaderNavigationMain);
