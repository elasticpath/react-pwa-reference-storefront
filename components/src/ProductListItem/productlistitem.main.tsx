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
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { login } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';
import imgPlaceholder from '../../../app/src/images/img_missing_horizontal@2x.png';

import './productlistitem.main.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface ProductListItemMainProps {
    productId?: string,
    offerData?: {
        [key: string]: any
    },
    productElement?: {
        [key: string]: any
    },
    featuredProductAttribute?: boolean,
    customClass?: string,
    itemDetailLink?: string,
}
interface ProductListItemMainState {
    productData: any,
    imageStatus: string,
}

class ProductListItemMain extends React.Component<ProductListItemMainProps, ProductListItemMainState> {
  static defaultProps = {
    productId: '',
    offerData: {},
    productElement: {},
    featuredProductAttribute: false,
    customClass: '',
    itemDetailLink: '',
  };

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      productData: undefined,
      imageStatus: 'loading',
    };
  }

  componentDidMount() {
    const { productId, offerData, productElement } = this.props;
    if (productId !== '') {
      login().then(() => {
        cortexFetchItemLookupForm()
          .then(() => itemLookup(productId)
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
    if (productElement._definition) {
      this.setState({
        productData: productElement,
      });
    }
    if (offerData._items) {
      this.setState({
        productData: offerData._items[0]._element[0],
      });
    }
  }

  handleImageLoaded() {
    this.setState({ imageStatus: 'loaded' });
  }

  render() {
    const { productData, imageStatus } = this.state;
    const {
      offerData, featuredProductAttribute, customClass, itemDetailLink,
    } = this.props;
    if (productData) {
      let listPrice = 'n/a';
      let itemPrice = 'n/a';
      if (offerData._pricerange) {
        if (offerData._pricerange[0]['list-price-range']['from-price'] && offerData._pricerange[0]['list-price-range']['from-price'][0].amount !== offerData._pricerange[0]['list-price-range']['to-price'][0].amount) {
          listPrice = `${offerData._pricerange[0]['list-price-range']['from-price'][0].display} - ${offerData._pricerange[0]['list-price-range']['to-price'][0].display}`;
        }
        if (offerData._pricerange[0]['purchase-price-range']['from-price'] && offerData._pricerange[0]['purchase-price-range']['from-price'][0].amount !== offerData._pricerange[0]['purchase-price-range']['to-price'][0].amount) {
          itemPrice = `${offerData._pricerange[0]['purchase-price-range']['from-price'][0].display} - ${offerData._pricerange[0]['purchase-price-range']['to-price'][0].display}`;
        } else {
          listPrice = (offerData._pricerange[0]['list-price-range']['from-price']) ? (offerData._pricerange[0]['list-price-range']['from-price'][0].display) : ('');
          itemPrice = (offerData._pricerange[0]['purchase-price-range']['to-price']) ? (offerData._pricerange[0]['purchase-price-range']['to-price'][0].display) : listPrice;
        }
      } else if (productData._price) {
        listPrice = productData._price[0]['list-price'][0].display;
        itemPrice = productData._price[0]['purchase-price'][0].display;
      }
      let availability = false;
      let availabilityString = '';
      if (productData._availability && productData._availability.length >= 0) {
        if (productData._availability[0].state === 'AVAILABLE') {
          availability = true;
          availabilityString = intl.get('in-stock');
        } else if (productData._availability[0].state === 'AVAILABLE_FOR_PRE_ORDER') {
          availability = true;
          availabilityString = intl.get('pre-order');
        } else if (productData._availability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
          availability = true;
          availabilityString = intl.get('back-order');
        } else {
          availability = false;
          availabilityString = intl.get('out-of-stock');
        }
      }
      return (
        <div className={`category-item-inner ${customClass}`}>
          <div className={`category-item-thumbnail-container ${imageStatus === 'loaded' ? 'loaded' : ''}`}>
            <Link to={`${itemDetailLink}/${encodeURIComponent(productData._code[0].code)}`}>
              <img src={Config.skuImagesUrl.replace('%sku%', productData._code[0].code)} onError={(e: any) => { e.target.src = imgPlaceholder; }} alt="default" className="category-item-thumbnail img-responsive" onLoad={this.handleImageLoaded.bind(this)} title="" />
            </Link>
          </div>
          <div className="category-item-title-container">
            <div className="category-item-title" id={`category_item_title_link_${productData._code[0].code}`}>
              <Link to={`${itemDetailLink}/${encodeURIComponent(productData._code[0].code)}`}>
                {productData._definition[0]['display-name']}
              </Link>
            </div>
            {(Config.b2b.enable) && (
              <h4 className="category-item-title-sku" id={`category_item_title_sku_${productData._code[0].code}`}>
                {productData._code[0].code}
              </h4>
            )}
          </div>
          {(featuredProductAttribute)
            ? (
              <div className="featured">
                {intl.get('featured')}
              </div>
            )
            : ('')
          }
          <div data-region="priceRegion">
            <div data-region="itemPriceRegion">
              <ul className="category-item-price-container">
                {
                  listPrice !== itemPrice
                    ? (
                      <li className="category-item-list-price category-item-purchase-price" data-region="itemListPriceRegion">
                        <span className="item-meta category-item-list-price-value" id={`category_item_list_price_${productData._code[0].code}`}>
                          {listPrice}
                        </span>
                        <span className="item-meta category-item-purchase-price-value price-sale" id={`category_item_price_${productData._code[0].code}`}>
                          {itemPrice}
                        </span>
                      </li>
                    )
                    : (
                      <li className="category-item-list-price category-item-purchase-price" data-region="itemListPriceRegion">
                        <span className="item-meta category-item-purchase-price-value" id={`category_item_price_${productData._code[0].code}`}>
                          {itemPrice}
                        </span>
                      </li>
                    )
                }
              </ul>
            </div>
            <div data-region="itemRateRegion" />
          </div>
          <div data-region="availabilityRegion">
            <ul className="category-item-availability-container">
              <li className="category-item-availability itemdetail-availability-state" data-i18n="AVAILABLE">
                <label htmlFor={`category_item_availability_${productData._code[0].code}`}>
                  {(availability) ? (
                    <div>
                      <span className="icon" />
                      {availabilityString}
                    </div>
                  ) : (
                    <div>
                      {availabilityString}
                    </div>
                  )}
                </label>
              </li>
              <li className={`category-item-release-date${productData._availability[0]['release-date'] ? '' : ' is-hidden'}`} data-region="itemAvailabilityDescriptionRegion">
                <label htmlFor={`category_item_release_date_${productData._code[0].code}_label`} className="item-meta category-item-releaseDate-label">
                  {intl.get('expected-release-date')}
                  :&nbsp;
                </label>
                <span className="item-meta category-item-releaseDate-value" id={`category_item_release_date_${productData._code[0].code}`}>
                  {productData._availability[0]['release-date'] ? productData._availability[0]['release-date']['display-value'] : ''}
                </span>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProductListItemMain;
