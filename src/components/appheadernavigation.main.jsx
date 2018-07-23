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
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { login } from '../utils/AuthService';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'navigations:element',
  'navigations:element:child',
];

class AppHeaderNavigationMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      navigations: [],
    };
  }

  componentWillMount() {
    login().then(() => {
      fetch(`${Config.cortexApi.path}?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then((res) => {
          if (res.status === 504) {
            const { history } = this.props;
            history.push('/maintenance');
          }
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
          console.error(error);
          const { history } = this.props;
          history.push('/maintenance');
        });
    });
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
                  <span>
                    {subcategory['display-name']}
                  </span>
                </Link>
              ))}
            </div>
          </li>
        );
      }
      return (
        <li key={category.name} data-name={category['display-name']} data-el-container="category-nav-item-container">
          <Link to={`/category/${encodeURIComponent(category.self.uri)}`} className="nav-item" id={`header_navbar_category_button_${category.name}`} data-target=".navbar-collapse" title={category['display-name']}>
            <span>
              {category['display-name']}
            </span>
          </Link>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="main-nav-container" id="header_navbar_container" data-region="mainNavRegion" style={{ display: 'block' }}>
        <div>
          <nav className="main-nav">
            <button className="btn-main-nav-toggle btn-link-cmd" type="button" id="header_navbar_container_categories_button" style={{ display: 'none' }}>
              Categories
            </button>
            <ul className="main-nav-list nav navbar-nav" data-region="mainNavList">
              {this.renderCategories()}
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default withRouter(AppHeaderNavigationMain);
