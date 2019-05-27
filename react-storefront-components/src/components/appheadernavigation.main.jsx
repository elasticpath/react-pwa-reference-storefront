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
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { login, logout } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig } from '../utils/ConfigProvider';

import './appheadernavigation.main.less';

let Config = {};

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
    isOfflineCheck: PropTypes.func.isRequired,
    isOffline: PropTypes.bool,
    checkedLocation: PropTypes.bool,
    isMobileView: PropTypes.bool.isRequired,
    onFetchNavigationError: PropTypes.func,
    appHeaderNavigationLinks: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  static defaultProps = {
    isOffline: undefined,
    onFetchNavigationError: () => {},
    checkedLocation: false,
  }

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    this.state = {
      navigations: {},
      /* eslint-disable react/no-unused-state */
      originalMinimizedNav: {},
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
    const { isOffline, isOfflineCheck, checkedLocation } = this.props;
    const { navigations } = this.state;
    if (!navigator.onLine && !isOffline && isOffline !== undefined) {
      isOfflineCheck(true);
    } else if (navigator.onLine && isOffline) {
      isOfflineCheck(false);
    }
    if (navigations.length === 0 && checkedLocation) {
      this.fetchNavigationData();
    }
  }

  getDropDownNavigationState(navigations) {
    const dropDownNavigation = {};

    navigations.forEach((category) => {
      const displayName = category['display-name'];
      const { name } = category;
      const show = false;

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

  static getListOfPathsToAlterShow(path) {
    const loPathsToChange = [];
    let currentPathToAddToArray = path;

    do {
      const indexOfLastDot = currentPathToAddToArray.lastIndexOf('.');
      currentPathToAddToArray = currentPathToAddToArray.substring(0, indexOfLastDot);

      loPathsToChange.push(currentPathToAddToArray);
    } while (currentPathToAddToArray.indexOf('.') > -1);

    return loPathsToChange;
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
              const { onFetchNavigationError } = this.props;
              onFetchNavigationError();
            });
          });
        }
        return res;
      })
      .then(res => res.json())
      .then((res) => {
        if (res && res._navigations) {
          const cortexNavigations = res._navigations[0]._element;
          const navigations = this.getDropDownNavigationState(cortexNavigations);
          this.setState({
            navigations,
            /* eslint-disable react/no-unused-state */
            originalMinimizedNav: JSON.parse(JSON.stringify(navigations)),
          });
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  toggleShowForCategory(category, path) {
    const { isMobileView } = this.props;

    if (isMobileView) {
      this.setState((state) => {
        const {
          navigations,
          originalMinimizedNav,
        } = state;

        const returnNav = JSON.parse(JSON.stringify(originalMinimizedNav));

        const loPathsToChange = AppHeaderNavigationMain.getListOfPathsToAlterShow(path);

        loPathsToChange.forEach((pathToChange) => {
          _.set(returnNav, `${pathToChange}.show`, true);
        });

        const lowestCategoryInPathVal = !_.get(navigations, `${path}.show`, '');
        _.set(returnNav, `${path}.show`, lowestCategoryInPathVal);

        return { navigations: returnNav };
      });
    }
  }

  renderSubCategoriesWithChildren(subcategoryChildKeyName, nestedChildObj, path, isLeftDropDownStyling, categoryLevel) {
    const { navigations } = this.state;
    const currentCategoryLevel = categoryLevel + 1;
    return (
      <li className={isLeftDropDownStyling ? 'left-drop-down' : 'right-drop-down'} key={`${path}`}>
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        {/* eslint-disable jsx-a11y/click-events-have-key-events */}
        <div className={`dropdown-item dropdown-toggle ${_.get(navigations, `${path}.show`, '') ? 'rotateCaret' : ''}`} to={`/category/${nestedChildObj.name}`} id="navbarDropdownMenuLink" onClick={() => this.toggleShowForCategory(subcategoryChildKeyName, `${path}`)} aria-haspopup="true" aria-expanded="false">
          {subcategoryChildKeyName}
        </div>
        <ul className={`dropdown-menu sub-category-dropdown-menu ${nestedChildObj.show ? 'show' : ''} nestedCategory${currentCategoryLevel}`} aria-labelledby="navbarDropdownMenuLink">
          {this.renderSubCategories(subcategoryChildKeyName, path, !isLeftDropDownStyling, currentCategoryLevel)}
        </ul>
      </li>
    );
  }

  renderSubCategoriesWithNoChildren(subcategoryChildKeyName, nestedChildObj, path) {
    const { appHeaderNavigationLinks } = this.props;

    if (subcategoryChildKeyName !== 'show' && subcategoryChildKeyName !== 'name') {
      return (
        <li key={`${path}`}>
          <Link className={`dropdown-item ${nestedChildObj.show ? 'show' : ''}`} id={`header_navbar_sub_category_button_${nestedChildObj.name}`} title={subcategoryChildKeyName} to={appHeaderNavigationLinks.categories + nestedChildObj.name}>
            <div data-toggle="collapse" data-target=".collapsable-container" className="" aria-expanded="true">{subcategoryChildKeyName}</div>
          </Link>
        </li>
      );
    }
    return null;
  }

  renderSubCategories(category, path, isLeftDropDownStyling, categoryLevel) {
    const { navigations } = this.state;
    const childObj = _.get(navigations, path, '');
    const subCategoryChildArray = Object.keys(childObj);

    return subCategoryChildArray.map((subcategoryChildKeyName) => {
      const nestedChildObj = childObj[subcategoryChildKeyName];
      const currentPath = `${path}.${subcategoryChildKeyName}`;
      if (subcategoryChildKeyName !== 'show' && subcategoryChildKeyName !== 'name') {
        if (Object.keys(nestedChildObj).length > 2) {
          return this.renderSubCategoriesWithChildren(subcategoryChildKeyName, nestedChildObj, currentPath, isLeftDropDownStyling, categoryLevel);
        }
        return this.renderSubCategoriesWithNoChildren(subcategoryChildKeyName, nestedChildObj, currentPath);
      }
      return null;
    });
  }

  renderCategoriesWithNoChildren(categoryKey, path) {
    const { navigations } = this.state;
    const { appHeaderNavigationLinks } = this.props;

    return (
      <li className="nav-item" key={`${path}`} data-name={categoryKey} data-el-container="category-nav-item-container">
        <Link className="nav-link" to={appHeaderNavigationLinks.categories + navigations[categoryKey].name} id="navbarMenuLink" aria-haspopup="true" aria-expanded="false" data-target="#">
          <div data-toggle="collapse" data-target=".collapsable-container" className="" aria-expanded="true">{categoryKey}</div>
        </Link>
      </li>
    );
  }

  renderCategoriesWithChildren(category, path, isLeftDropDownStyling, categoryLevel) {
    const { navigations } = this.state;
    return (
      <li className="nav-item" key={`${path}`} data-name={category} data-el-container="category-nav-item-container">
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        {/* eslint-disable jsx-a11y/click-events-have-key-events */}
        <div className={`nav-link dropdown-toggle ${_.get(navigations, `${path}.show`, '') ? 'rotateCaret' : ''}`} to={`/category/${navigations[category].name}`} onClick={() => this.toggleShowForCategory(category, path)} id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {category}
        </div>
        <ul className={`dropdown-menu sub-category-dropdown-menu ${_.get(navigations, `${path}.show`, '') ? 'show' : ''} nestedCategory${categoryLevel}`} aria-labelledby="navbarDropdownMenuLink">
          {this.renderSubCategories(category, path, isLeftDropDownStyling, categoryLevel)}
        </ul>
      </li>
    );
  }

  renderCategories() {
    const { navigations } = this.state;
    const firstLevelKeys = Object.keys(navigations);

    return firstLevelKeys.map((category) => {
      const categoryObj = navigations[category];
      const path = category;
      if (Object.keys(categoryObj).length > 2) {
        const categoryLevel = 0;
        return this.renderCategoriesWithChildren(category, path, true, categoryLevel);
      }
      return this.renderCategoriesWithNoChildren(category, path);
    });
  }

  render() {
    const { isMobileView } = this.props;

    return (
      <div className={`app-header-navigation-component ${isMobileView ? 'mobile-view' : ''}`}>
        <nav className="navbar navbar-expand hover-menu">
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
