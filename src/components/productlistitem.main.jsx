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
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { login } from '../utils/AuthService';
import imgPlaceholder from '../images/img-placeholder.png';
import cortexFetch from '../utils/Cortex';

import './productlistitem.main.less';

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
      cortexFetch(`${productUrl}?zoom=${zoomArray.sort().join()}`,
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
          console.error(error.message);
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
        <div className="category-item-inner">
          <div className="category-item-thumbnail-container">
            <Link to={`/itemdetail/${encodeURIComponent(productData.self.uri)}`}>
              <img src={Config.skuImagesUrl.replace('%sku%', productData._code[0].code)} onError={(e) => { e.target.src = imgPlaceholder; }} alt="default" className="category-item-thumbnail img-responsive" title="" />
            </Link>
          </div>
          <div className="category-item-title" id={`category_item_title_link_${productData._code[0].code}`} style={{ minHeight: '43px' }}>
            <Link to={`/itemdetail/${encodeURIComponent(productData.self.uri)}`}>
              {productData._definition[0]['display-name']}
            </Link>
          </div>
          <div data-region="priceRegion">
            <div data-region="itemPriceRegion">
              <ul className="category-item-price-container">
                <li className="category-item-list-price category-item-purchase-price" data-region="itemListPriceRegion">
                  {
                    listPrice !== itemPrice
                      ? (
                        <span className="item-meta category-item-list-price-value" id={`category_item_list_price_${productData._code[0].code}`}>
                          {listPrice}
                        </span>
                      )
                      : ('')
                  }
                  <span className="item-meta category-item-purchase-price-value" id={`category_item_price_${productData._code[0].code}`}>
                    {itemPrice}
                  </span>
                </li>
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
                      <span className="icon glyphicon glyphicon-ok" />
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
