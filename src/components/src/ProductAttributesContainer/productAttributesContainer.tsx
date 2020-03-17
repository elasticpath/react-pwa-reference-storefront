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
import React, { useState } from 'react';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './productAttributesContainer.less';

let Config: IEpConfig | any = {};

function ProductAttributesContainer(props: { detailsProductData: any }) {
  Config = getConfig().config;
  const { intl } = Config;
  const { detailsProductData } = props;
  const [productDetailsState, setProductDetailsState] = useState(detailsProductData);

  const handleDetailAttribute = (index) => {
    const updatedProductDetailsState = productDetailsState
      .map((detail, i) => (
        i === index
          ? { ...detail, isOpen: !detail.isOpen }
          : detail
      ));
    setProductDetailsState(updatedProductDetailsState);
  };

  return (
    <div className="itemdetail-tabs-wrap">
      {(Config.PowerReviews.enable) ? (
        <ul className="nav nav-tabs itemdetail-tabs" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="summary-tab"
              data-toggle="tab"
              href="#summary"
              role="tab"
              aria-selected="true"
            >
              {intl.get('summary')}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="reviews-tab" data-toggle="tab" href="#reviews" role="tab" aria-selected="false">
              {intl.get('reviews')}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="questions-tab"
              data-toggle="tab"
              href="#questions"
              role="tab"
              aria-selected="false"
            >
              {intl.get('questions')}
            </a>
          </li>
        </ul>
      ) : ('')
      }
      <div className="tab-content">
        <div className="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
          <ul className="item-detail-attributes" data-region="itemDetailAttributeRegion">
            { productDetailsState
              ? productDetailsState.map((attribute, index) => (
                <li key={attribute.name} className="detail-list-item">
                  <div className="item-detail-attribute-label-col">
                    {attribute['display-name']}
                    <span className={`item-arrow-btn ${attribute.isOpen ? 'up' : ''}`} role="presentation" onClick={() => handleDetailAttribute(index)} />
                  </div>
                  <div className={`item-detail-attribute-value-col ${attribute.isOpen ? '' : 'hide'}`}>
                    {attribute['display-value']}
                  </div>
                </li>
              ))
              : ''
            }
          </ul>
        </div>
        <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
          <div id="pr-reviewdisplay" />
        </div>
        <div className="tab-pane fade" id="questions" role="tabpanel" aria-labelledby="questions-tab">
          <div id="pr-questiondisplay" />
        </div>
      </div>
    </div>
  );
}

export default ProductAttributesContainer;
