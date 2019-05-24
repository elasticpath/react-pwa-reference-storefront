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
import ReactRouterPropTypes from 'react-router-prop-types';
import { ProductDisplayItemMain } from '@elasticpath/react-storefront-components';

import './ProductsComparePage.less';

class ProductsComparePage extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    match: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  constructor(props) {
    super(props);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleAddToWishList = this.handleAddToWishList.bind(this);
  }

  handleAddToCart() {
    const { history } = this.props;
    history.push('/mybag');
  }

  handleAddToWishList() {
    const { history } = this.props;
    history.push('/wishlists');
  }

  render() {
    const { match } = this.props;
    const params = match.params.products;
    const productCodes = decodeURIComponent(params).split(',');
    return (
      <div className="main-compare container-3">
        {
          productCodes.map(code => (
            <div key={code} className="compare-product">
              <ProductDisplayItemMain productId={code} onAddToCart={this.handleAddToCart} onAddToWishList={this.handleAddToWishList} />
            </div>
          ))
        }
      </div>
    );
  }
}

export default ProductsComparePage;
