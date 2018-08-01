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
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { login } from '../utils/AuthService';
import imgPlaceholder from '../images/img-placeholder.png';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'availability',
  'addtocartform',
  'price',
  'rate',
  'definition',
  'definition:assets:element',
  'definition:options:element',
  'definition:options:element:value',
  'definition:options:element:selector:choice',
  'definition:options:element:selector:chosen',
  'definition:options:element:selector:choice:description',
  'definition:options:element:selector:chosen:description',
  'definition:options:element:selector:choice:selector',
  'definition:options:element:selector:chosen:selector',
  'definition:options:element:selector:choice:selectaction',
  'definition:options:element:selector:chosen:selectaction',
  'recommendations',
  'recommendations:crosssell',
  'recommendations:recommendation',
  'recommendations:replacement',
  'recommendations:upsell',
  'recommendations:warranty',
  'code',
];

class ProductListItemMain extends React.Component {
  static propTypes = {
    productUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      productData: undefined,
    };
  }

  componentDidMount() {
    const { productUrl } = this.props;
    login().then(() => {
      cortexFetch(`${Config.cortexApi.path + productUrl}?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            productData: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  render() {
    const { productData } = this.state;
    if (productData) {
      let listPrice = 'n/a';
      if (productData._price) {
        listPrice = productData._price[0]['list-price'][0].display;
      }
      let itemPrice = 'n/a';
      if (productData._price) {
        itemPrice = productData._price[0]['purchase-price'][0].display;
      }
      let availability = false;
      let availabilityString = '';
      if (productData._availability.length >= 0) {
        if (productData._availability[0].state === 'AVAILABLE') {
          availability = true;
          availabilityString = 'In Stock';
        } else if (productData._availability[0].state === 'AVAILABLE_FOR_PRE_ORDER') {
          availability = true;
          availabilityString = 'Pre-order';
        } else if (productData._availability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
          availability = true;
          availabilityString = 'Back-order';
        } else {
          availability = false;
          availabilityString = 'Out of Stock';
        }
      }
      return (
        <div className="category-item-inner">
          <div className="category-item-thumbnail-container">
            <img src={Config.skuImagesS3Url.replace('%sku%', productData._code[0].code)} onError={(e) => { e.target.src = imgPlaceholder; }} alt="default" className="category-item-thumbnail img-responsive" title="" />
          </div>
          <div className="category-item-title" id={`category_item_title_link_${productData._code[0].code}`} style={{ minHeight: '59px' }}>
            <Link to={`/itemdetail/${encodeURIComponent(productData.self.uri)}`}>
              {productData._definition[0]['display-name']}
            </Link>
          </div>
          <div data-region="priceRegion" style={{ display: 'block' }}>
            <div>
              <div data-region="itemPriceRegion" style={{ display: 'block' }}>
                <ul className="category-item-price-container" style={{ minHeight: '33px' }}>
                  {
                    listPrice !== itemPrice
                      ? (
                        <li className="category-item-list-price" data-region="itemListPriceRegion">
                          <label htmlFor={`category_item_list_price_${productData._code[0].code}_label`} className="item-meta category-item-list-price-label">
                            Original Price
                          </label>
                          <span className="item-meta category-item-list-price-value" id={`category_item_list_price_${productData._code[0].code}`}>
                            {listPrice}
                          </span>
                        </li>
                      )
                      : ('')
                  }
                  <li className="category-item-purchase-price">
                    <label htmlFor={`category_item_price_${productData._code[0].code}_label`} className="item-meta category-item-purchase-price-label">
                      Price
                    </label>
                    <span className="item-meta category-item-purchase-price-value" id={`category_item_price_${productData._code[0].code}`}>
                      {itemPrice}
                    </span>
                  </li>
                </ul>
              </div>
              <div data-region="itemRateRegion" />
            </div>
          </div>
          <div data-region="availabilityRegion" style={{ display: 'block' }}>
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
                  Expected Release Date:&nbsp;
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
