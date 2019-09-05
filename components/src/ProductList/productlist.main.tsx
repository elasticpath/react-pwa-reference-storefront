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
import { Link } from 'react-router-dom';
import ProductListItemMain from '../ProductListItem/productlistitem.main';

import './productlist.main.less';
import { getConfig } from '../utils/ConfigProvider';

let intl = { get: str => str };

interface ProductListMainProps {
    productData: {
        [key: number]: any
    },
    showCompareButton?: boolean,
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
class ProductListMain extends React.Component<ProductListMainProps, ProductListMainState> {
  static defaultProps = {
    showCompareButton: true,
    productListLinks: {
      itemDetail: '',
      productsCompare: '',
    },
  };

  constructor(props) {
    super(props);
    const { productData } = this.props;
    ({ intl } = getConfig());
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
    const isChecked = compareList.indexOf(product.code.code) !== -1;
    if (product.definition && isCompare) {
      return (
        <div className="compare-checkbox">
          <label htmlFor={product.code.code}>
            <input
              id={product.code.code}
              checked={isChecked}
              name={product.code.code}
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
    return categoryModel.elements.map((product) => {
      if (product.items) {
        return (
          <li key={`_${Math.random().toString(36).substr(2, 9)}`} className="category-item-container">
            <ProductListItemMain offerData={product} itemDetailLink={productListLinks.itemDetail} />
            {(showCompareButton) ? (
              this.checkComparison(product.items.elements[0])
            ) : ('')}
          </li>
        );
      }
      if (product.code) {
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
    if (categoryModel.elements && categoryModel.elements.length > 0) {
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
