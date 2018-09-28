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
import { withRouter } from 'react-router';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import ProductListItemMain from './productlistitem.main';

import './productrecommendations.main.less';

class ProductRecommendationsDisplayMain extends React.Component {
  static propTypes = {
    productData: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      maxItemsInView: 4,
    };
  }

  static renderProductAssocitationView(product, maxItemsInView) {
    const data = [];
    product.forEach((element, index) => {
      if (index < maxItemsInView && element.rel === 'element') {
        data.push(
          <div className="category-item-container card" key={`_${Math.random().toString(36).substr(2, 9)}`}>
            <ProductListItemMain productUrl={element.uri} />
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
    const product = productData._recommendations[0]._crosssell[0].links;
    if (product.length > 0) {
      const htmlFor = 'Recommendations';
      data.push(
        <div className="display" key={htmlFor}>
          <label className="control-label" htmlFor={htmlFor}>
            {intl.get('product-recommendations')}
          </label>
          <div className="card-deck">
            {ProductRecommendationsDisplayMain.renderProductAssocitationView(product, maxItemsInView)}
          </div>
        </div>,
      );
    }
    return (
      <div className="product-recomentations-component" data-region="categoryBrowseRegion" key="categoryBrowseRegion">
        {data}
      </div>
    );
  }
}

export default withRouter(ProductRecommendationsDisplayMain);
