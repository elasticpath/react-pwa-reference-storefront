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
import IndiRecommendationsDisplayMain from '../IndiRecommendations/indirecommendations.main';
import Config from '../../../ep.config.json';

import './b2c.home.page.scss';


import b2c_banner_1_700x239 from '../../../images/site-images/optimized/b2c-banner-1@700x239.jpg';
import b2c_banner_1_1400x478 from '../../../images/site-images/optimized/b2c-banner-1@1400x478.jpg';
import b2c_banner_1_2100x717 from '../../../images/site-images/optimized/b2c-banner-1@2100x717.jpg';
import b2c_banner_1_2800x956 from '../../../images/site-images/optimized/b2c-banner-1@2800x956.jpg';

import b2c_banner_2_700x280 from '../../../images/site-images/optimized/b2c-banner-2@700x280.jpg';
import b2c_banner_2_1400x560 from '../../../images/site-images/optimized/b2c-banner-2@1400x560.jpg';
import b2c_banner_2_2100x840 from '../../../images/site-images/optimized/b2c-banner-2@2100x840.jpg';
import b2c_banner_2_2800x1120 from '../../../images/site-images/optimized/b2c-banner-2@2800x1120.jpg';

import b2c_banner_3_700x280 from '../../../images/site-images/optimized/b2c-banner-3@700x280.jpg';
import b2c_banner_3_1400x559 from '../../../images/site-images/optimized/b2c-banner-3@1400x559.jpg';
import b2c_banner_3_2100x839 from '../../../images/site-images/optimized/b2c-banner-3@2100x839.jpg';
import b2c_banner_3_2800x1118 from '../../../images/site-images/optimized/b2c-banner-3@2800x1118.jpg';

import b2c_product_1_568x834 from '../../../images/site-images/optimized/b2c-product-1@568x834.jpg';
import b2c_product_1_852x1251 from '../../../images/site-images/optimized/b2c-product-1@852x1251.jpg';
import b2c_product_1_1136x1668 from '../../../images/site-images/optimized/b2c-product-1@1136x1668.jpg';

import b2c_product_2_395x397 from '../../../images/site-images/optimized/b2c-product-2@395x397.jpg';
import b2c_product_2_593x596 from '../../../images/site-images/optimized/b2c-product-2@593x596.jpg';
import b2c_product_2_790x794 from '../../../images/site-images/optimized/b2c-product-2@790x794.jpg';

import b2c_product_3_283x399 from '../../../images/site-images/optimized/b2c-product-3@283x399.jpg';
import b2c_product_3_425x599 from '../../../images/site-images/optimized/b2c-product-3@425x599.jpg';
import b2c_product_3_566x798 from '../../../images/site-images/optimized/b2c-product-3@566x798.jpg';

import b2c_product_4_284x401 from '../../../images/site-images/optimized/b2c-product-4@284x401.jpg';
import b2c_product_4_426x602 from '../../../images/site-images/optimized/b2c-product-4@426x602.jpg';
import b2c_product_4_568x802 from '../../../images/site-images/optimized/b2c-product-4@568x802.jpg';

import b2c_product_5_565x397 from '../../../images/site-images/optimized/b2c-product-5@565x397.jpg';
import b2c_product_5_848x595 from '../../../images/site-images/optimized/b2c-product-5@848x595.jpg';
import b2c_product_5_1130x793 from '../../../images/site-images/optimized/b2c-product-5@1130x793.jpg';

import b2c_product_6_284x400 from '../../../images/site-images/optimized/b2c-product-6@284x400.jpg';
import b2c_product_6_426x600 from '../../../images/site-images/optimized/b2c-product-6@426x600.jpg';
import b2c_product_6_568x800 from '../../../images/site-images/optimized/b2c-product-6@568x800.jpg';

import b2c_product_7_284x401 from '../../../images/site-images/optimized/b2c-product-7@284x401.jpg';
import b2c_product_7_426x602 from '../../../images/site-images/optimized/b2c-product-7@426x602.jpg';
import b2c_product_7_568x802 from '../../../images/site-images/optimized/b2c-product-7@568x802.jpg';

const B2CHomePage: React.FunctionComponent = () => {
  // Set the language-specific configuration for indi integration
  Config.indi.brandAmbassador.title = intl.get('indi-brand-ambassador-title');
  Config.indi.brandAmbassador.description = intl.get('indi-brand-ambassador-description');
  Config.indi.brandAmbassador.submit_button_text = intl.get('indi-brand-ambassador-submit-button-text');

  return (
    <div className="home-page-b2c">
      <section className="main-banner">
        <img
          className="main-banner-image"
          src={b2c_banner_1_2800x956}
          srcSet={`
            ${b2c_banner_1_700x239} 700w,
            ${b2c_banner_1_1400x478} 1400w,
            ${b2c_banner_1_2100x717} 2100w,
            ${b2c_banner_1_2800x956} 2800w
          `}
          alt=""
        />
        <div className="main-banner-title-wrap">
          <div className="container">
            <h2 className="goods-heading">{intl.get('b2c-main-banner-heading')}</h2>
            <div className="main-banner-txt">
              <p className="goods-description">
                {intl.get('b2c-main-banner-txt')}
              </p>
              <div className="btn-wrap">
                <button type="button" className="ep-btn primary learn-more-btn">{intl.get('learn-more')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IndiRecommendationsDisplayMain render={['carousel', 'brand']} configuration={Config.indi} />

      <section className="goods-section-1">
        <div className="container">
          <div className="main-goods ">
            <ul className="main-goods__grid">
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('b2c-product1-label')}</h5>
                    <h3 className="goods-title">{intl.get('b2c-product1-heading')}</h3>
                    <div className="btn-wrap">
                      <button type="button" className="ep-btn primary learn-more-btn">{intl.get('learn-more')}</button>
                    </div>
                  </div>
                  <img
                    className="main-goods-image"
                    src={b2c_product_1_1136x1668}
                    srcSet={`
                      ${b2c_product_1_568x834} 568w,
                      ${b2c_product_1_852x1251} 852w,
                      ${b2c_product_1_1136x1668} 1136w
                    `}
                    alt=""
                  />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('b2c-product2-label')}</h5>
                    <h3 className="goods-title">{intl.get('b2c-product2-heading')}</h3>
                    <p className="goods-description">{intl.get('b2c-product2-description')}</p>
                    <button type="button" className="ep-btn primary learn-more-btn">{intl.get('add-to-cart-2')}</button>
                  </div>
                  <img
                    className="main-goods-image"
                    src={b2c_product_2_790x794}
                    srcSet={`
                      ${b2c_product_2_395x397} 395w,
                      ${b2c_product_2_593x596} 593w,
                      ${b2c_product_2_790x794} 790w
                    `}
                    alt=""
                  />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('b2c-product3-label')}</h5>
                    <h3 className="goods-title">{intl.get('b2c-product3-heading')}</h3>
                    <p className="goods-description">
                      {intl.get('b2c-product3-description')}
                    </p>
                    <button type="button" className="ep-btn primary learn-more-btn">{intl.get('b2c-product3-label')}</button>
                  </div>
                  <img
                    className="main-goods-image"
                    src={b2c_product_3_566x798}
                    srcSet={`
                      ${b2c_product_3_283x399} 283w,
                      ${b2c_product_3_425x599} 425w,
                      ${b2c_product_3_566x798} 566w
                    `}
                    alt=""
                  />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('b2c-product4-label')}</h5>
                    <h3 className="goods-title">{intl.get('b2c-product4-heading')}</h3>
                    <p className="goods-description">
                      {intl.get('b2c-product4-description')}
                    </p>
                  </div>
                  <img
                    className="main-goods-image"
                    src={b2c_product_4_568x802}
                    srcSet={`
                      ${b2c_product_4_284x401} 284w,
                      ${b2c_product_4_426x602} 426w,
                      ${b2c_product_4_568x802} 568w
                    `}
                    alt=""
                  />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('b2c-product5-label')}</h5>
                    <h3 className="goods-title">
                      {intl.get('b2c-product5-heading')}
                    </h3>
                  </div>
                  <img
                    className="main-goods-image"
                    src={b2c_product_5_1130x793}
                    srcSet={`
                      ${b2c_product_5_565x397} 565w,
                      ${b2c_product_5_848x595} 848w,
                      ${b2c_product_5_1130x793} 1130w
                    `}
                    alt=""
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="main-banner banner-section-2">
        <img
          className="main-banner-image"
          src={b2c_banner_2_2800x1120}
          srcSet={`
            ${b2c_banner_2_700x280} 700w,
            ${b2c_banner_2_1400x560} 1400w,
            ${b2c_banner_2_2100x840} 2100w,
            ${b2c_banner_2_2800x1120} 800w
          `}
          alt=""
        />
        <div className="main-banner-title-wrap">
          <div className="container">
            <h2 className="goods-heading">{intl.get('b2c-main-banner-heading2')}</h2>
            <div className="main-banner-txt">
              <p className="goods-description">
                {intl.get('b2c-main-banner-txt2')}
              </p>
              <div className="btn-wrap">
                <button type="button" className="ep-btn primary learn-more-btn">{intl.get('learn-more')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="goods-section-2">
        <div className="container">
          <h2 className="main-goods-title">{intl.get('b2c-main-goods-title')}</h2>
          <div className="main-goods">
            <ul className="main-goods__grid">
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('b2c-product6-label')}</h5>
                    <h3 className="goods-title">{intl.get('b2c-product6-heading')}</h3>
                    <p className="goods-description">{intl.get('b2c-product6-description')}</p>
                  </div>
                  <img
                    className="main-goods-image"
                    src={b2c_product_6_568x800}
                    srcSet={`
                      ${b2c_product_6_284x400} 284w,
                      ${b2c_product_6_426x600} 426w,
                      ${b2c_product_6_568x800} 568w
                    `}
                    alt=""
                  />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('b2c-product7-label')}</h5>
                    <h3 className="goods-title">{intl.get('b2c-product7-heading')}</h3>
                    <p className="goods-description">{intl.get('b2c-product7-description')}</p>
                  </div>
                  <img
                    className="main-goods-image"
                    src={b2c_product_7_568x802}
                    srcSet={`
                      ${b2c_product_7_284x401} 284w,
                      ${b2c_product_7_426x602} 426w,
                      ${b2c_product_7_568x802} 568w
                    `}
                    alt=""
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="main-banner banner-section-3">
        <img
          className="main-banner-image"
          src={b2c_banner_3_2800x1118}
          srcSet={`
            ${b2c_banner_3_700x280} 700w,
            ${b2c_banner_3_1400x559} 1400w,
            ${b2c_banner_3_2100x839} 2100w,
            ${b2c_banner_3_2800x1118} 2800w
          `}
          alt=""
        />
        <div className="main-banner-title-wrap">
          <div className="container">
            <h2 className="goods-heading">{intl.get('b2c-main-banner-heading3')}</h2>
            <div className="main-banner-txt">
              <p className="goods-description">
                {intl.get('b2c-main-banner-txt3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="goods-section-3">
        <div className="container">
          <div className="main-goods">
            <ul className="main-goods__grid">
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('customers')}</h5>
                    <h3 className="goods-title">{intl.get('company-commitment')}</h3>
                    <p className="goods-description">{intl.get('customers-benefits1')}</p>
                    <p className="goods-description">{intl.get('customers-benefits2')}</p>
                    <div className="btn-wrap">
                      <button type="button" className="ep-btn primary learn-more-btn">{intl.get('company-help')}</button>
                    </div>
                  </div>
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('company')}</h5>
                    <h3 className="goods-title">{intl.get('company-name')}</h3>
                    <p className="goods-description">{intl.get('company-description1')}</p>
                    <p className="goods-description">{intl.get('company-description2')}</p>
                    <div className="btn-wrap">
                      <button type="button" className="ep-btn primary learn-more-btn">{intl.get('about')}</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default B2CHomePage;
