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
import { Link } from 'react-router-dom';
import ProductListItemMain from '../ProductListItem/productlistitem.main';

import './productlist.main.less';

interface ProductListMainProps {
  /** product data */
  productData: {
    [key: number]: any
  },
  /** show compare button */
  showCompareButton?: boolean,
  /** product list links */
  productListLinks?: {
    [key: string]: any
  },
}

interface ProductListMainState {
  isCompare: boolean,
  compareLink: string,
  categoryModel: any,
  compareList: any,
}

class ProductListMain extends Component<ProductListMainProps, ProductListMainState> {
  static defaultProps = {
    showCompareButton: false,
    productListLinks: {
      itemDetail: '',
      productsCompare: '',
    },
  };

  constructor(props) {
    super(props);

    const { productData } = this.props;

    this.state = {
      isCompare: false,
      compareLink: '',
      categoryModel: productData,
      compareList: [],
    };
    this.handleCompareToggle = this.handleCompareToggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { productData } = nextProps;
    this.setState({ categoryModel: productData });
  }

  handleCompare(event) {
    this.setState({
      isCompare: !event,
    });
  }

  handleCompareToggle(event) {
    const { compareList } = this.state;
    const { productListLinks } = this.props;
    const elementCode = event.target.name;
    const index = compareList.indexOf(elementCode);
    if (index === -1 && compareList.length > 2) return;
    if (index !== -1) {
      this.setState({
        compareList: compareList.slice(0, index).concat(compareList.slice(index + 1)),
        compareLink: `${productListLinks.productsCompare}/${encodeURIComponent(compareList.slice(0, index).concat(compareList.slice(index + 1)).join())}`,
      });
    } else {
      this.setState({
        compareList: [...compareList, elementCode],
        compareLink: `${productListLinks.productsCompare}/${encodeURIComponent([...compareList, elementCode].join())}`,
      });
    }
  }

  checkComparison(product) {
    const { compareList, isCompare } = this.state;
    const isChecked = compareList.indexOf(product._items[0]._element[0]._code[0].code) !== -1;
    if (product._definition && isCompare) {
      return (
        <div className="compare-checkbox">
          <label htmlFor={product._code[0].code}>
            <input
              id={product._code[0].code}
              checked={isChecked}
              name={product._items[0]._element[0]._code[0].code}
              disabled={compareList.length > 2 && !isChecked}
              type="checkbox"
              onChange={this.handleCompareToggle}
            />
            <span className="helping-el" />
            <span className="label-text">
              &nbsp;
              {intl.get('compare')}
            </span>
          </label>
        </div>
      );
    }
    return null;
  }

  renderProducts() {
    const { categoryModel } = this.state;
    const { showCompareButton, productListLinks } = this.props;
    return categoryModel._element.map((product) => {
      if (product.self.type === 'offers.offer') {
        return (
          <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
            <ProductListItemMain offerData={product} itemDetailLink={productListLinks.itemDetail} />
            {(showCompareButton) ? (
              this.checkComparison(product)
            ) : ('')}
          </li>
        );
      }
      if (product._code) {
        return (
          <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
            <ProductListItemMain productElement={product} itemDetailLink={productListLinks.itemDetail} />
            {this.checkComparison(product)}
          </li>
        );
      }
      return null;
    });
  }

  render() {
    const {
      categoryModel,
      isCompare,
      compareList,
      compareLink,
    } = this.state;
    const { showCompareButton } = this.props;
    if (categoryModel._element && categoryModel._element.length > 0) {
      return (
        <div className="product-list-container" data-region="categoryBrowseRegion">
          {showCompareButton ? (
            <div className="compare-button">
              <button type="button" className="ep-btn primary top-compare-link" onClick={(compareList.length <= 1) ? () => this.handleCompare(isCompare) : () => { }}>
                {(compareList.length > 1) ? (
                  <Link className="toggle-compare-link" to={compareLink}>{intl.get('compare-products')}</Link>
                ) : `${intl.get('compare')}`}
              </button>
            </div>
          ) : <div className="compare-button" />}
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
