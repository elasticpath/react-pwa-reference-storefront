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
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import ProductListItemMain from './productlistitem.main';

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
            Product Recommendations
          </label>
          <div className="card-deck">
            {ProductRecommendationsDisplayMain.renderProductAssocitationView(product, maxItemsInView)}
          </div>
        </div>,
      );
    }
    return (
      <div data-region="categoryBrowseRegion" key="categoryBrowseRegion">
        {data}
      </div>
    );
  }
}

export default withRouter(ProductRecommendationsDisplayMain);
