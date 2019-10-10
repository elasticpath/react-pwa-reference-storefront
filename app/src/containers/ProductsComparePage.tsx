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

import React from 'react';
import { ProductDisplayItemMain } from '@elasticpath/store-components';

import './ProductsComparePage.less';

interface ProductsComparePageProps {
  history: any,
  match: {
    [key: string]: any
  },
}

class ProductsComparePage extends React.Component<ProductsComparePageProps> {
  constructor(props) {
    super(props);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleAddToWishList = this.handleAddToWishList.bind(this);
    this.handleChangeProductFeature = this.handleChangeProductFeature.bind(this);
  }

  handleAddToCart() {
    const { history } = this.props;
    history.push('/mycart');
  }

  handleAddToWishList() {
    const { history } = this.props;
    history.push('/wishlists');
  }

  handleChangeProductFeature(path) {
    const { history } = this.props;
    history.push(`/itemdetail/${path}`);
  }

  render() {
    const { match } = this.props;
    const params = match.params.products;
    const productCodes = decodeURIComponent(params).split(',');
    const itemDetailLink = '/itemdetail';
    return (
      <div className="main-compare container-3">
        {
          productCodes.map(code => (
            <div key={code} className="compare-product">
              <ProductDisplayItemMain productId={code} onChangeProductFeature={this.handleChangeProductFeature} onAddToCart={this.handleAddToCart} onAddToWishList={this.handleAddToWishList} itemDetailLink={itemDetailLink} />
            </div>
          ))
        }
      </div>
    );
  }
}

export default ProductsComparePage;
