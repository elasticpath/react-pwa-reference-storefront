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
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { ProductDisplayItemMainProps, ProductDisplayItemMainState } from './productdisplayitem.main.d';

const Config: IEpConfig | any = {};
const intl = { get: str => str };

interface ProductDisplayAttributes {
    /** callback for when handle attribute is clicked. */
    handleDetailAttribute: any,
    /** data structure that component renders */
    detailsProductData: any,
  }

function ProductDisplayAttributes(props: ProductDisplayAttributes) {
  const {
    handleDetailAttribute, detailsProductData,
  } = props;

  const renderAttributes = () => {
    if (detailsProductData) {
      return detailsProductData.map((attribute, index) => (
        <li key={attribute.name} className="detail-list-item">
          <div className="item-detail-attribute-label-col">
            {attribute['display-name']}
            <span className={`item-arrow-btn ${attribute.isOpened ? 'up' : ''}`} role="presentation" onClick={() => handleDetailAttribute(index)} />
          </div>
          <div className={`item-detail-attribute-value-col ${attribute.isOpened ? '' : 'hide'}`}>
            {attribute['display-value']}
          </div>
        </li>
      ));
    }
    return null;
  };

  return (
    <div className="tab-content">
      <div className="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
        <ul className="item-detail-attributes" data-region="itemDetailAttributeRegion">
          {renderAttributes()}
        </ul>
      </div>
      <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
        <div id="pr-reviewdisplay" />
      </div>
      <div className="tab-pane fade" id="questions" role="tabpanel" aria-labelledby="questions-tab">
        <div id="pr-questiondisplay" />
      </div>
    </div>
  );
}

export default ProductDisplayAttributes;
