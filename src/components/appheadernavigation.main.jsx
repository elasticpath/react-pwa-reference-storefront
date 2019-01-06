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
import _ from 'lodash';

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
      navigations: {},
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

  getDropDownNavigationState(navigations) {
    const dropDownNavigation = {};

    navigations.forEach((category) => {
      const displayName = category['display-name'];
      const { name } = category;
      const show = false; // HAX -- Should change this for all top categories.

      const categoryChildren = category._child;
      let children;

      if (categoryChildren) {
        children = this.getDropDownNavigationState(categoryChildren);
      }

      dropDownNavigation[displayName] = {
        show,
        name,
        ...children,
      };
    });
    return dropDownNavigation;
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
        const cortexNavigations = res._navigations[0]._element;
        const navigations = this.getDropDownNavigationState(cortexNavigations);
        this.setState({
          navigations,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  renderSubCategoriesWithChildren(subcategoryChildKeyName, nestedChildObj, path, isLeftDropDownStyling) {
    return (
      <li className={isLeftDropDownStyling ? 'left-drop-down' : 'right-drop-down'}>
        <Link className={`dropdown-item dropdown-toggle ${nestedChildObj.show ? 'show' : ''}`} to={`/category/${nestedChildObj.name}`} id="navbarDropdownMenuLink" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">
          {subcategoryChildKeyName}
        </Link>
        <ul className={`dropdown-menu ${isLeftDropDownStyling ? 'left-drop-down' : 'right-drop-down'}`} aria-labelledby="navbarDropdownMenuLink">
          {this.renderSubCategories(subcategoryChildKeyName, `${path}.${subcategoryChildKeyName}`, !isLeftDropDownStyling)}
        </ul>
      </li>
    );
  }

  static renderSubCategoriesWithNoChildren(subcategoryChildKeyName, nestedChildObj) {
    if (subcategoryChildKeyName !== 'show' && subcategoryChildKeyName !== 'name') {
      return (
        <li>
          <Link className={`dropdown-item ${nestedChildObj.show ? 'show' : ''}`} to={`/category/${nestedChildObj.name}`}>
            {subcategoryChildKeyName}
          </Link>
        </li>
      );
    }
    return null;
  }

  renderSubCategories(category, path, isLeftDropDownStyling) {
    const { navigations } = this.state;
    const childObj = _.get(navigations, path, '');
    const subCategoryChildArray = Object.keys(childObj);
    return subCategoryChildArray.map((subcategoryChildKeyName) => {
      const nestedChildObj = childObj[subcategoryChildKeyName];
      if (Object.keys(nestedChildObj).length > 2 && subcategoryChildKeyName !== 'show' && subcategoryChildKeyName !== 'name') {
        return this.renderSubCategoriesWithChildren(subcategoryChildKeyName, nestedChildObj, path, isLeftDropDownStyling);
      }
      return AppHeaderNavigationMain.renderSubCategoriesWithNoChildren(subcategoryChildKeyName, nestedChildObj);
    });
  }

  renderCategoriesWithNoChildren(categoryKey) {
    const { navigations } = this.state;
    return (
      <li className="nav-item">
        <Link className="nav-link" to={`/category/${navigations[categoryKey].name}`} id="navbarMenuLink" aria-haspopup="true" aria-expanded="false">
          {categoryKey}
        </Link>
      </li>
    );
  }

  renderCategoriesWithChildren(category, path, isLeftDropDownStyling) {
    const { navigations } = this.state;
    return (
      <li className="nav-item dropdown">
        <Link className="nav-link dropdown-toggle" to={`/category/${navigations[category].name}`} id="navbarDropdownMenuLink" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">
          {category}
        </Link>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          {this.renderSubCategories(category, path, isLeftDropDownStyling)}
        </ul>
      </li>
    );
  }

  renderCategories() {
    const { navigations } = this.state;
    const firstLevelKeys = Object.keys(navigations);

    return firstLevelKeys.map((category) => {
      const categoryObj = navigations[category];
      if (Object.keys(categoryObj).length > 2) {
        const path = category;
        return this.renderCategoriesWithChildren(category, path, false);
      }
      return this.renderCategoriesWithNoChildren(category);
    });
  }

  render() {
    const { isMobileView } = this.props;

    return (
      <div className={`app-header-navigation-component ${isMobileView ? 'mobile-view' : ''}`}>
        <nav className="navbar navbar-expand btco-hover-menu">
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              {this.renderCategories()}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default withRouter(AppHeaderNavigationMain);
