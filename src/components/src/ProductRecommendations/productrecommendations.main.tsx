/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import ProductListItemMain from '../ProductListItem/productlistitem.main';

import './productrecommendations.main.less';

interface ProductRecommendationsDisplayMainProps {
  /** product data */
  productData: {
    [key: string]: any
  },
  /** item detail link */
  itemDetailLink?: string
}

interface ProductRecommendationsDisplayMainState {
  maxItemsInView: number
}

class ProductRecommendationsDisplayMain extends Component<ProductRecommendationsDisplayMainProps, ProductRecommendationsDisplayMainState> {
  static defaultProps = {
    itemDetailLink: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      maxItemsInView: 4,
    };

    this.renderProductAssociationView = this.renderProductAssociationView.bind(this);
  }

  renderProductAssociationView(product, maxItemsInView) {
    const data = [];
    const { itemDetailLink } = this.props;
    product.forEach((element, index) => {
      if (index < maxItemsInView && element._code) {
        data.push(
          <div className="category-item-container card" key={`_${Math.random().toString(36).substr(2, 9)}`}>
            <ProductListItemMain productElement={element} itemDetailLink={itemDetailLink} />
          </div>,
        );
      }
    });
    return data;
  }

  render() {
    const data = [];
    const { productData } = this.props;
    const { maxItemsInView } = this.state;
    const product = productData._recommendations[0]._crosssell[0]._element;
    if (product && product.length > 0) {
      const htmlFor = 'Recommendations';
      data.push(
        <div className="display" key={htmlFor}>
          <label className="control-label" htmlFor={htmlFor}>
            {intl.get('product-recommendations')}
          </label>
          <div className="card-deck">
            {this.renderProductAssociationView(product, maxItemsInView)}
          </div>
        </div>,
      );
    }
    return (
      <div className="product-recomentations-component" data-region="categoryBrowseRegion" key="categoryBrowseRegion">
        {data.length > 0 ? <hr /> : ''}
        {data}
      </div>
    );
  }
}

export default ProductRecommendationsDisplayMain;
