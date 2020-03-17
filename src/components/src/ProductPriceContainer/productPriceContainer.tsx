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

import './productPriceContainer.less';

const ProductPriceContainer = (props: { productData: any }) => {
  const { productData } = props;

  let listPrice = 'n/a';
  if (productData._price) {
    listPrice = productData._price[0]['list-price'][0].display;
  }
  let itemPrice = 'n/a';
  if (productData._price) {
    itemPrice = productData._price[0]['purchase-price'][0].display;
  }

  return (
    <div
      className="itemdetail-price-container itemdetail-price-wrap"
      data-region="itemDetailPriceRegion"
      style={{ display: 'block' }}
    >
      <div>
        <div data-region="itemPriceRegion" style={{ display: 'block' }}>
          <ul className="itemdetail-price-container">
            {
              listPrice !== itemPrice
                ? (
                  <li className="itemdetail-purchase-price">
                    <h1
                      className="itemdetail-purchase-price-value price-sale"
                      id={`category_item_price_${productData._code[0].code}`}
                    >
                      {itemPrice}
                    </h1>
                    <span
                      className="itemdetail-list-price-value"
                      data-region="itemListPriceRegion"
                      id={`category_item_list_price_${productData._code[0].code}`}
                    >
                      {listPrice}
                    </span>
                  </li>
                )
                : (
                  <li className="itemdetail-purchase-price">
                    <h1
                      className="itemdetail-purchase-price-value"
                      id={`category_item_price_${productData._code[0].code}`}
                    >
                      {itemPrice}
                    </h1>
                  </li>
                )
            }
          </ul>
        </div>
        <div data-region="itemRateRegion" />
      </div>
    </div>
  );
};

export default ProductPriceContainer;
