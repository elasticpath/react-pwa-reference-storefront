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
import ProductListItemMain from '../ProductListItem/productlistitem.main';
import { bloomreachMtlSearch } from '../utils/Bloomreach/BloomreachSearchService';
import { BloomreachMltResponse } from '../utils/Bloomreach/types/BloomreachSearchService';
import '../ProductRecommendations/productrecommendations.main.less';

export interface BloomreachProductRecommendationsDisplayMainProps {
    cortexProductData: any,
  }
  
export interface BloomreachProductRecommendationsDisplayMainState {
    maxItemsInView: number,
    productData: any
}

class BloomreachProductRecommendationsDisplayMain extends React.Component<BloomreachProductRecommendationsDisplayMainProps, BloomreachProductRecommendationsDisplayMainState> {

  constructor(props) {
    super(props);
    this.state = {
      maxItemsInView: 4,
      productData: [],
    };
  }

  componentDidMount() {
    const { productData } = this.state;

    if (productData.length === 0) {
      this.fetchBloomreachRecommendedProducts();
    }
  }

  componentWillReceiveProps() {
    const { productData } = this.state;

    if (productData.length === 0) {
      this.fetchBloomreachRecommendedProducts();
    }
  }

  async fetchBloomreachRecommendedProducts() {
    const { cortexProductData } = this.props;
    const sku = cortexProductData._code[0].code;

    const res: BloomreachMltResponse = await bloomreachMtlSearch(sku);
    
    this.setState({
      productData: res.response ? res.response.docs : [],
    });
  }

  static renderProductAssocitationView(productData, maxItemsInView) {
    const data = [];
    productData.forEach((element, index) => {
      if (index < maxItemsInView && element.pid) {
        const cortexSku = element.variants[0].sku_swatch_images[0];
        data.push(
          <div className="category-item-container card" key={`_${Math.random().toString(36).substr(2, 9)}`}>
            <ProductListItemMain productId={cortexSku} />
          </div>,
        );
      }
    });
    return data;
  }

  render() {
    const data = [];
    const { maxItemsInView, productData } = this.state;
    if (productData && productData.length > 0) {
      const htmlFor = 'Recommendations';
      data.push(
        <div className="display" key={htmlFor}>
          <label className="control-label" htmlFor={htmlFor}>
            {intl.get('product-recommendations')}
          </label>
          <div className="card-deck">
            {BloomreachProductRecommendationsDisplayMain.renderProductAssocitationView(productData, maxItemsInView)}
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

export default withRouter(BloomreachProductRecommendationsDisplayMain);
