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
import {
  cortexFetchNavigationLookupForm, cortexFetchItemLookupForm, cortexFetchPurchaseLookupForm,
} from '../utils/CortexLookup';
import cortexFetch from '../utils/Cortex';

import './appheadernavigation.main.less';
import './appheaderhovernavigation.main.less';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'navigations:element',
  'navigations:element:child',
  'navigations:element:child:child',
  'navigations:element:child:child:child',
  'navigations:element:child:child:child:child',
  'navigations:element:child:child:child:child:child',
  'navigations:element:child:child:child:child:child:child',
  'navigations:element:child:child:child:child:child:child:child',
  'navigations:element:child:child:child:child:child:child:child:child',
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
    const { isOffline, isOfflineCheck } = this.props;
    if (!navigator.onLine && !isOffline && isOffline !== undefined) {
      isOfflineCheck(true);
    } else if (navigator.onLine && isOffline) {
      isOfflineCheck(false);
    }
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

  renderSubCategories(subCategoryChildArray) {
    const { isMobileView } = this.props;
    // debugger;
    return subCategoryChildArray.map((subcategoryChild) => {
      const {
        navigations,
      } = this.state;
      // debugger;
      return (
        subcategoryChild._child
          ? (
            <li className="dropdown-submenu" key={subcategoryChild.name} data-name={subcategoryChild['display-name']} data-el-container="category-nav-item-container">
              <label className="dropdown-item" id={`${isMobileView ? 'mobile_' : ''}navbarDropdown_${subcategoryChild.name}`}>
                {subcategoryChild['display-name']}
              </label>
              <ul className="dropdown-menu sub-category-dropdown-menu" role="menu" aria-label={`navbarDropdown_${subcategoryChild.name}`}>
                {subcategoryChild._child.map(subcategory => this.renderSubCategories([subcategory]))}
              </ul>
            </li>
          )
          : (
            <li className="dropdown-item" key={subcategoryChild.name} data-name={subcategoryChild['display-name']} data-toggle="collapse" data-target=".navbar-collapse">
              <Link className="nav-link dropdown-item" to={`/category/${subcategoryChild.name}`}>
                <div
                  data-toggle="collapse"
                  data-target={isMobileView ? '.collapsable-container' : ''}
                >
                  {subcategoryChild['display-name']}
                </div>
              </Link>
            </li>
          )

      );
    });
  }

  renderCategories() {
    const { navigations } = this.state;
    const { isMobileView } = this.props;
    console.log(navigations);
    if (navigations) {
      return navigations.map((category) => {
        if (category._child) {
          return (
            <li className="nav-item dropdown" key={category.name} data-name={category['display-name']} data-toggle="collapse" data-target=".navbar-collapse">
              <label className="nav-link dropdown-toggle" id={`${isMobileView ? 'mobile_' : ''}navbarDropdown_${category.name}`} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {category['display-name']}
              </label>
              <ul className="dropdown-menu sub-category-dropdown-menu" role="menu" aria-label={`navbarDropdown_${category.name}`}>
                {this.renderSubCategories(category._child)}
              </ul>
            </li>
          );
        }
        return (
          <li className="nav-item" key={category.name} data-name={category['display-name']} data-toggle="collapse" data-target=".navbar-collapse">
            <Link className="nav-link" to={`/category/${category.name}`}>
              <div
                data-toggle="collapse"
                data-target={isMobileView ? '.collapsable-container' : ''}
              >
                {category['display-name']}
              </div>
            </Link>
          </li>
        );
      });
    }
    return null;
  }

  render() {
    const { navigations } = this.state;
    const { isMobileView } = this.props;
    return (
      <div className="app-header-navigation-component">
        <nav className="navbar navbar-expand-md btco-hover-menu">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">

              <li className="nav-item">
                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Pricing</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">test1 <span className="sr-only"></span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">test2</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">asdf</a>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="https://bootstrapthemes.co" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Dropdown link
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><a className="dropdown-item dropdown-toggle" href="#">Submenu</a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Submenu action</a></li>
                      <li><a className="dropdown-item" href="#">Another submenu action</a></li>


                      <li><a className="dropdown-item dropdown-toggle" href="#">Subsubmenu</a>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">Subsubmenu action aa</a></li>
                          <li><a className="dropdown-item" href="#">Another subsubmenu action</a></li>
                        </ul>
                      </li>
                      <li><a className="dropdown-item dropdown-toggle" href="#">Second subsubmenu</a>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">Subsubmenu action bb</a></li>
                          <li><a className="dropdown-item" href="#">Another subsubmenu action</a></li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li><a className="dropdown-item dropdown-toggle" href="#">Submenu 2</a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Submenu action 2</a></li>
                      <li><a className="dropdown-item" href="#">Another submenu action 2</a></li>


                      <li><a className="dropdown-item dropdown-toggle" href="#">Subsubmenu</a>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">Subsubmenu action 1 3</a></li>
                          <li><a className="dropdown-item" href="#">Another subsubmenu action 2 3</a></li>
                        </ul>
                      </li>
                      <li><a className="dropdown-item dropdown-toggle" href="#">Second subsubmenu 3</a>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">Subsubmenu action 3 </a></li>
                          <li><a className="dropdown-item" href="#">Another subsubmenu action 3</a></li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>

    );
    // return (
    //   <div className={`app-header-navigation-component ${isMobileView ? 'mobile-view' : ''}`}>
    //     <ul className="navbar-nav nav mr-auto mt-2 mt-lg-0">
    //       {this.renderCategories()}
    //     </ul>
    //   </div>
    // );
  }
}

export default withRouter(AppHeaderNavigationMain);
