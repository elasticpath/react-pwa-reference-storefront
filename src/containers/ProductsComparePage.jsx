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
import { login } from '../utils/AuthService';
import { cortexFetchBatchItemLookupForm, batchLookup } from '../utils/CortexLookup';
import CartCompareItems from '../components/cartcompareitems';

import './ProductsComparePage.less';

class ProductsComparePage extends React.Component {
  static propTypes = {
    match: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      productData: undefined,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const params = match.params.products;
    const productCodes = decodeURIComponent(params).split(',');
    login().then(() => {
      cortexFetchBatchItemLookupForm()
        .then(() => batchLookup(productCodes)
          .then((res) => {
            this.setState({
              productData: res,
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          }));
    });
  }

  render() {
    const { productData } = this.state;
    return (
      <div className="main-compare container-3">
        { productData && productData._element && (
          productData._element.map(product => (
            <div key={product._code[0].code} className="compare-product">
              <CartCompareItems key={product._code[0].code} productId={product._code[0].code} productData={product} />
            </div>
          ))
        )}
      </div>
    );
  }
}

export default ProductsComparePage;
