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
import { InlineShareButtons } from 'sharethis-reactjs';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './productSocialNetworkSharing.less';

let Config: IEpConfig | any = {};

const ProductSocialNetworkSharing = (props: { productData: any }) => {
  const { productData } = props;
  Config = getConfig().config;

  let productLink = '';
  if (productData._code) {
    productLink = `${window.location.origin}/itemdetail/${productData._code[0].code}`;
  }

  const productTitle = productData._definition[0]['display-name'];
  const productDescription = productData._definition[0].details ? (productData._definition[0].details.find(detail => detail['display-name'] === 'Summary' || detail['display-name'] === 'Description')) : '';
  const productDescriptionValue = productDescription !== undefined ? productDescription['display-value'] : '';
  const productImage = Config.skuImagesUrl.replace('%sku%', productData._code[0].code);

  return (
    <div className="social-network-sharing">
      <InlineShareButtons
        config={{
          alignment: 'center', // alignment of buttons (left, center, right)
          color: 'social', // set the color of buttons (social, white)
          enabled: true, // show/hide buttons (true, false)
          font_size: 16, // font size for the buttons
          labels: 'cta', // button labels (cta, counts, null)
          language: 'en', // which language to use (see LANGUAGES)
          networks: [ // which networks to include (see SHARING NETWORKS)
            'facebook',
            'twitter',
            'pinterest',
            'email',
          ],
          padding: 12, // padding within buttons (INTEGER)
          radius: 4, // the corner radius on each button (INTEGER)
          size: 40, // the size of each button (INTEGER)

          // OPTIONAL PARAMETERS
          url: productLink, // (defaults to current url)
          image: productImage, // (defaults to og:image or twitter:image)
          description: productDescriptionValue, // (defaults to og:description or twitter:description)
          title: productTitle, // (defaults to og:title or twitter:title)
          message: 'custom email text', // (only for email sharing)
          subject: 'custom email subject', // (only for email sharing)
          username: 'custom twitter handle', // (only for twitter sharing)
        }}
      />
    </div>
  );
};

export default ProductSocialNetworkSharing;
