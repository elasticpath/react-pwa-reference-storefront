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
    const { categoryUrl } = this.props;
    login().then(() => {
      fetch(`${Config.cortexApi.path + categoryUrl}?zoom=items`,
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
            selfUri: categoryUrl,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selfUri } = this.state;
    if (Config.cortexApi.path + selfUri !== nextProps.categoryUrl) {
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
    const { categoryModel, selfUri } = this.state;
    const { categoryUrl } = this.props;
    if (categoryModel.links.length > 0 && selfUri === categoryUrl) {
      return (
        <div className="category-items-container container">
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="view-title">
                {categoryModel['display-name']}
              </h1>
            </div>
          </div>
          <ProductListPaginationTop paginationDataProps={categoryModel._items ? categoryModel._items[0] : categoryModel} />
          <ProductListMain productData={categoryModel._items ? categoryModel._items[0] : categoryModel} />
          <ProductListPaginationBottom paginationDataProps={categoryModel._items ? categoryModel._items[0] : categoryModel} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default CategoryItemsMain;
