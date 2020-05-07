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
import intl from 'react-intl-universal';

import './b2b.home.page.scss';

import hero_banner_0_650x217 from '../../../images/site-images/optimized/hero-banner-0@650x217.jpg';
import hero_banner_0_1300x434 from '../../../images/site-images/optimized/hero-banner-0@1300x434.jpg';


const B2BHomePage: React.FunctionComponent = () => (
  <div className="home-page-b2b">
    <section className="main-banner">
      <img
        className="main-banner-image"
        src={hero_banner_0_1300x434}
        srcSet={`
          ${hero_banner_0_650x217} 650w,
          ${hero_banner_0_1300x434} 1300w
        `}
        alt=""
      />
      <div className="main-banner-title-wrap">
        <div className="container">
          <h1 className="goods-heading">{intl.get('main-banner-heading')}</h1>
          <div className="main-banner-txt">
            <p className="goods-description">
              {intl.get('main-banner-txt')}
            </p>
            <div className="btn-wrap">
              <button type="button" className="ep-btn primary learn-more-btn">{intl.get('learn-more')}</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="container">
      <div className="main-goods">
        <ul className="main-goods__grid">
          <li className="main-goods__cell">
            <p className="goods-title-small">{intl.get('products')}</p>
            <p className="goods-title">{intl.get('product1-heading')}</p>
            <p className="goods-description">{intl.get('product1-description')}</p>
          </li>
          <li className="main-goods__cell">
            <p className="goods-title-small">{intl.get('products')}</p>
            <p className="goods-title">{intl.get('product2-heading')}</p>
            <p className="goods-description">{intl.get('product2-description')}</p>
          </li>
          <li className="main-goods__cell">
            <p className="goods-title-small">{intl.get('products')}</p>
            <p className="goods-title">{intl.get('product3-heading')}</p>
            <p className="goods-description">
              {intl.get('product3-description')}
            </p>
          </li>
        </ul>

        <div className="main-goods__cell main-goods__block">
          <p className="goods-title-small">{intl.get('services')}</p>
          <p className="goods-title">{intl.get('service-heading')}</p>
          <p className="goods-description">
            {intl.get('service-description')}
          </p>
        </div>

        <div className="main-goods__cell main-goods__block bottom-block">
          <h2 className="goods-heading">{intl.get('about-brand-heading')}</h2>
          <p className="goods-description">
            {intl.get('about-brand-description')}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default B2BHomePage;
