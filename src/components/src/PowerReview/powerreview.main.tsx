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
import scriptjs from 'scriptjs';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import './powerreview.less';
import * as UserPrefs from '../utils/UserPrefs';

const powerReviewsRemoteScriptUrl = 'http://ui.powerreviews.com/stable/4.0/ui.js';

let Config: IEpConfig | any = {};

interface PowerReviewProps {
  /** product data */
  productData: {
    [key: string]: any
  },
}

class PowerReview extends Component<PowerReviewProps> {
  private POWERREVIEWS: any;

  private funcName: any;

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
  }

  componentDidMount() {
    if (Config.PowerReviews.enable) {
      scriptjs(powerReviewsRemoteScriptUrl, () => {
        this.mountPowerReview();
      });
    }
  }

  mountPowerReview() {
    const {
      productData,
    } = this.props;

    const productCode = productData._code[0].code;

    const { availability, productLink } = this.extractAvailabilityParams(productData);

    const { productImage, productDescriptionValue, productTitle } = this.extractProductDetails(productData);

    const { itemPrice } = this.extractPrice(productData);

    const mounted = document.getElementById('pr-reviewsnippet');

    if (mounted) {
      // eslint-disable-next-line no-undef
      this.POWERREVIEWS.display.render({
        api_key: Config.PowerReviews.api_key,
        locale: UserPrefs.getSelectedLocaleValue().replace('-', '_'),
        merchant_group_id: Config.PowerReviews.merchant_group_id,
        merchant_id: Config.PowerReviews.merchant_id,
        review_wrapper_url: '/write-a-review?pr=true',
        page_id: productCode,
        product: {
          name: productTitle,
          url: productLink,
          image_url: productImage,
          description: productDescriptionValue,
          category_name: 'Root Category',
          manufacturer_id: 'Zilker',
          upc: productCode,
          brand_name: 'Zilker',
          price: itemPrice,
          in_stock: availability,
        },
        components: {
          ReviewSnippet: 'pr-reviewsnippet',
          ReviewDisplay: 'pr-reviewdisplay',
          QuestionDisplay: 'pr-questiondisplay',
        },
      });
    }
  }

  extractProductDetails(productData) {
    this.funcName = 'extractProductDetails';
    const productTitle = productData._definition[0]['display-name'];
    const productDescription = productData._definition[0].details ? (productData._definition[0].details.find(detail => detail['display-name'] === 'Summary' || detail['display-name'] === 'Description')) : '';
    const productDescriptionValue = productDescription !== undefined ? productDescription['display-value'] : '';
    const productImage = Config.skuImagesUrl.replace('%sku%', productData._code[0].code);
    return {
      productImage, productDescriptionValue, productTitle,
    };
  }

  extractAvailabilityParams(productData) {
    this.funcName = 'extractAvailabilityParams';
    let availability = (productData._addtocartform[0].links.length > 0);
    let availabilityString = '';
    const productLink = window.location.href;
    if (productData._availability.length >= 0) {
      if (productData._availability[0].state === 'AVAILABLE') {
        availabilityString = intl.get('in-stock');
      } else if (productData._availability[0].state === 'AVAILABLE_FOR_PRE_ORDER') {
        availabilityString = intl.get('pre-order');
      } else if (productData._availability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
        availability = true;
        availabilityString = intl.get('back-order');
      } else {
        availabilityString = intl.get('out-of-stock');
      }
    }
    return { availability, availabilityString, productLink };
  }

  extractPrice(productData) {
    this.funcName = 'extractPrice';
    let listPrice = 'n/a';
    if (productData._price) {
      listPrice = productData._price[0]['list-price'][0].display;
    }
    let itemPrice = 'n/a';
    if (productData._price) {
      itemPrice = productData._price[0]['purchase-price'][0].display;
    }
    return { listPrice, itemPrice };
  }

  render() {
    return (<div id="pr-reviewsnippet" />);
  }
}

export default PowerReview;
