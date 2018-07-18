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
import PropTypes from 'prop-types';
import { login } from '../utils/AuthService';
import ProductListMain from './productlist.main';
import ProductListPaginationTop from './productlistpaginationtop.main';
import ProductListPaginationBottom from './productlistpaginationbottom.main';

const Config = require('Config');

class CategoryItemsMain extends React.Component {
  static propTypes = {
    categoryUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      categoryModel: { links: [] },
      selfUri: '',
    };
  }

  componentDidMount() {
    login().then(() => {
      fetch(`${Config.cortexApi.path + this.props.categoryUrl}?zoom=items`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            categoryModel: res,
            selfUri: this.props.categoryUrl,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (Config.cortexApi.path + this.state.selfUri !== nextProps.categoryUrl) {
      login().then(() => {
        fetch(`${Config.cortexApi.path + nextProps.categoryUrl}?zoom=items`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
          })
          .then(res => res.json())
          .then((res) => {
            this.setState({
              selfUri: nextProps.categoryUrl,
              categoryModel: res,
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      });
    }
  }

  render() {
    if (this.state.categoryModel.links.length > 0 && this.state.selfUri === this.props.categoryUrl) {
      return (
        <div className="category-items-container container">
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="view-title">
                {this.state.categoryModel['display-name']}
              </h1>
            </div>
          </div>
          <ProductListPaginationTop paginationData={this.state.categoryModel._items ? this.state.categoryModel._items[0] : this.state.categoryModel} />
          <ProductListMain productData={this.state.categoryModel._items ? this.state.categoryModel._items[0] : this.state.categoryModel} />
          <ProductListPaginationBottom paginationData={this.state.categoryModel._items ? this.state.categoryModel._items[0] : this.state.categoryModel} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default CategoryItemsMain;
