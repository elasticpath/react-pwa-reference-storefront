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
import Slider from 'react-slick';
import intl from 'react-intl-universal';
import ProductListItemMain from './productlistitem.main';

import './featuredproducts.main.less';

class FeaturedProducts extends React.Component {
  static propTypes = {
    productData: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    const { productData } = this.props;
    this.state = {
      categoryModel: productData,
      slidesOnPage: 4,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const { productData } = nextProps;
    this.setState({ categoryModel: productData });
  }

  updateDimensions() {
    if (window.innerWidth <= 1091 && window.innerWidth > 767) {
      this.setState({ slidesOnPage: 3 });
    } else if (window.innerWidth <= 767) {
      this.setState({ slidesOnPage: 2 });
    } else {
      this.setState({ slidesOnPage: 4 });
    }
  }

  renderFeaturedProducts() {
    const { categoryModel } = this.state;
    return categoryModel._element.map((product) => {
      if (product.self.type === 'offers.offer') {
        return (
          <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
            <ProductListItemMain offerData={product} featuredProductAttribute />
          </li>
        );
      }
      if (product._code) {
        return (
          <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
            <ProductListItemMain productElement={product} featuredProductAttribute />
          </li>
        );
      }
      return null;
    });
  }

  render() {
    const {
      categoryModel, slidesOnPage,
    } = this.state;
    const settings = {
      dots: true,
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
          },
        },
      ],
    };
    if (categoryModel._element && categoryModel._element.length > 0) {
      const additionalSlides = categoryModel._element.length > slidesOnPage ? (slidesOnPage - (categoryModel._element.length % slidesOnPage)) : 0;
      const additionalSlidesArr = [];
      for (let i = 1; i <= additionalSlides; i++) {
        additionalSlidesArr.push(i);
      }
      return (
        <div>
          <div className="featured-products-title">
            {intl.get('viewing')}
            {' '}
            {(categoryModel._element.length > 4) && (
              <span className="featured-products-on-page-l">
                4
                {' '}
                {intl.get('of')}
              </span>
            )}
            {(categoryModel._element.length > 3) && (
              <span className="featured-products-on-page-m">
                3
                {' '}
                {intl.get('of')}
              </span>
            )}
            {(categoryModel._element.length > 2) && (
              <span className="featured-products-on-page-s">
                2
                {' '}
                {intl.get('of')}
              </span>
            )}
            {' '}
            {categoryModel._element.length}
            {' '}
            {intl.get('featured-products')}
          </div>
          <div className="featured-products-container" data-region="categoryBrowseRegion">
            <div className="product-image-carousel">
              <Slider {...settings}>
                {this.renderFeaturedProducts()}
                {additionalSlidesArr.map(el => <li key={el} />)}
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
