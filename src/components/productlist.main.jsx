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
import ProductListItemMain from './productlistitem.main';

class ProductListMain extends React.Component {
  static propTypes = {
    productData: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    const { productData } = this.props;
    this.state = {
      categoryModel: productData,
    };
  }

  renderProducts() {
    const { categoryModel } = this.state;
    return categoryModel.links.map((product) => {
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
    const { categoryModel } = this.state;
    if (categoryModel.links.length > 0) {
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
