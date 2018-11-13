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
import { login, logout, fetchCategories } from '../utils/AuthService';

import './appheadernavigation.main.less';

class AppHeaderNavigationMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    isOfflineCheck: PropTypes.func.isRequired,
    isMobileView: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      navigations: [],
    };
  }

  componentWillMount() {
    fetchCategories()
      .then(([res, body]) => {
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

        this.setState({
          navigations: body._navigations[0]._element,
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
