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
      const show = false; // HAX -- Should change this for all top categories.

      const categoryChildren = category._child;
      let children;

      if (categoryChildren) {
        children = this.getDropDownNavigationState(categoryChildren);
      }

      dropDownNavigation[displayName] = {
        show,
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

  // TODO: have to implement onClick handler here...
  // Once clicked it is going to toggle the show values...
  // We can only change the state though?
  // So how would we figure out how to change the dom? We have to use state to define it...
  renderSubCategoriesWithChildren(subcategoryChild, isLeftDropDownStyling) {
    return (
      <li className={isLeftDropDownStyling ? 'left-drop-down' : 'right-drop-down'}>
        <Link className="dropdown-item dropdown-toggle" to={`/category/${subcategoryChild.name}`} id="navbarDropdownMenuLink" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">
          {subcategoryChild['display-name']}
        </Link>
        <ul className={`dropdown-menu ${isLeftDropDownStyling ? 'left-drop-down' : 'right-drop-down'}`} aria-labelledby="navbarDropdownMenuLink">
          {this.renderSubCategories(subcategoryChild._child, !isLeftDropDownStyling)}
        </ul>
      </li>
    );
  }

  static renderSubCategoriesWithNoChildren(subcategoryChild) {
    return (
      <li>
        <Link className="dropdown-item" to={`/category/${subcategoryChild.name}`}>
          {subcategoryChild['display-name']}
        </Link>
      </li>
    );
  }

  renderSubCategories(subCategoryChildArray, isLeftDropDownStyling) {
    return subCategoryChildArray.map(subcategoryChild => (
      subcategoryChild._child
        ? (this.renderSubCategoriesWithChildren(subcategoryChild, isLeftDropDownStyling))
        : (AppHeaderNavigationMain.renderSubCategoriesWithNoChildren(subcategoryChild))));
  }

  static renderCategoriesWithNoChildren(categoryDisplayName) {
    // tODO: We need to change the display name to be the naem...
    // Should be showing up here..
    return (
      <li className="nav-item">
        <Link className="nav-link" to={`/category/${categoryDisplayName}`} id="navbarMenuLink" aria-haspopup="true" aria-expanded="false">
          {categoryDisplayName}
        </Link>
      </li>
    );
  }

  renderCategoriesWithChildren(category, isLeftDropDownStyling) {
    return (
      <li className="nav-item dropdown">
        <Link className="nav-link dropdown-toggle" to={`/category/${category.name}`} id="navbarDropdownMenuLink" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">
          {category['display-name']}
        </Link>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          {this.renderSubCategories(category._child, isLeftDropDownStyling)}
        </ul>
      </li>
    );
  }

  renderCategories() {
    // Where does navigations get set?
    const { navigations } = this.state;
    console.log('the navigations inside the renderCategories function');
    console.log(navigations);
    const firstLevelKeys = Object.keys(navigations);
    console.log(firstLevelKeys);

    return firstLevelKeys.map((category) => {
      const categoryObj = this.state.navigations[category]
      // Check if there are children
      if (Object.keys(categoryObj).length > 1) {
       // Then we start to go through this particular category and create all its subcategory dropdowns.

       // return this.renderCategoriesWithChildren(category, isLeftDropDownStyling);
        return AppHeaderNavigationMain.renderCategoriesWithNoChildren(category);
      }
      return AppHeaderNavigationMain.renderCategoriesWithNoChildren(category);
    });

    // TODO: We need to traverse through the map and all of its children...
    // return (navigations.map((category) => {
    //   if (category._child) {
    //     return this.renderCategoriesWithChildren(category, isLeftDropDownStyling);
    //   }
    //   return AppHeaderNavigationMain.renderCategoriesWithNoChildren(category, isLeftDropDownStyling);
    // }));
  }

  render() {
    // console.log("working");
    const { isMobileView } = this.props;
    const { navigations } = this.state;
    console.log(navigations);

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
