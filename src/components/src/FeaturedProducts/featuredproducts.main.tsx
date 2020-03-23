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
import Slider from 'react-slick';
import ProductListItemMain from '../ProductListItem/productlistitem.main';

import './featuredproducts.main.less';

interface FeaturedProductsProps {
  /** product data */
  productData: { [key: string]: any },
  /** item detail link */
  itemDetailLink?: string,
}
interface FeaturedProductsState {
  categoryModel: { [key: string]: any },
}

class FeaturedProducts extends Component<FeaturedProductsProps, FeaturedProductsState> {
  static defaultProps = {
    itemDetailLink: '',
  }

  constructor(props) {
    super(props);

    const { productData } = this.props;
    this.state = {
      categoryModel: productData,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { productData } = nextProps;
    this.setState({ categoryModel: productData });
  }

  renderFeaturedProducts() {
    const { categoryModel } = this.state;
    const { itemDetailLink } = this.props;
    return categoryModel._element.map((product) => {
      if (product.self.type === 'offers.offer') {
        return (
          <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
            <ProductListItemMain offerData={product} featuredProductAttribute itemDetailLink={itemDetailLink} />
          </li>
        );
      }
      if (product._code) {
        return (
          <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
            <ProductListItemMain productElement={product} featuredProductAttribute itemDetailLink={itemDetailLink} />
          </li>
        );
      }
      return null;
    });
  }

  render() {
    const { categoryModel } = this.state;
    const settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1091,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            arrows: false,
            dots: true,
          },
        },
      ],
    };
    if (categoryModel._element && categoryModel._element.length > 0) {
      return (
        <div>
          <div className="product-featured">
            <span className="product-title">
              {intl.get('featured')}
            </span>
          </div>
          <div className="featured-products-container" data-region="categoryBrowseRegion">
            <div className="featured-product-carousel">
              <Slider {...settings}>
                {this.renderFeaturedProducts()}
              </Slider>
            </div>
          </div>
        </div>
      );
    }

    return ('');
  }
}

export default FeaturedProducts;
