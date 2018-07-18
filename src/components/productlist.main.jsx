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
import ProductListItemMain from './productlistitem.main';

class ProductListMain extends React.Component {
  static propTypes = {
    productData: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      categoryModel: this.props.productData,
    };
  }

  renderProducts() {
    return this.state.categoryModel.links.map((product) => {
      if (product.rel === 'element') {
        return (
          <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
            <ProductListItemMain productUrl={product.uri} />
          </li>
        );
      }
      return null;
    });
  }

  render() {
    if (this.state.categoryModel.links.length > 0) {
      return (
        <div data-region="categoryBrowseRegion" style={{ display: 'block' }}>
          <ul className="category-items-listing equalize" id="category_items_listing">
            {this.renderProducts()}
          </ul>
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProductListMain;
