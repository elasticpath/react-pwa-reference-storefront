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
import ImageContainer from '../ImageContainer/image.container';
import Config from '../../../ep.config.json';

import './b2c.home.page.scss';

import bannerImage1 from '../../../images/site-images/optimized/b2c-banner-1.jpg';
import bannerImage2 from '../../../images/site-images/b2c-banner-2.png';
import bannerImage3 from '../../../images/site-images/b2c-banner-3.png';
import productImage1 from '../../../images/site-images/b2c-product-1.png';
import productImage2 from '../../../images/site-images/b2c-product-2.png';
import productImage3 from '../../../images/site-images/b2c-product-3.png';
import productImage4 from '../../../images/site-images/b2c-product-4.png';
import productImage5 from '../../../images/site-images/b2c-product-5.png';
import productImage6 from '../../../images/site-images/b2c-product-6.png';
import productImage7 from '../../../images/site-images/b2c-product-7.png';


const bannerFileName1 = 'b2c-banner-1.jpg';
const bannerFileName2 = 'b2c-banner-2.png';
const bannerFileName3 = 'b2c-banner-3.png';
const productFileName1 = 'b2c-product-1.png';
const productFileName2 = 'b2c-product-2.png';
const productFileName3 = 'b2c-product-3.png';
const productFileName4 = 'b2c-product-4.png';
const productFileName5 = 'b2c-product-5.png';
const productFileName6 = 'b2c-product-6.png';
const productFileName7 = 'b2c-product-7.png';

const B2CHomePage: React.FunctionComponent = () => {
  // Set the language-specific configuration for indi integration
  Config.indi.brandAmbassador.title = intl.get('indi-brand-ambassador-title');
  Config.indi.brandAmbassador.description = intl.get('indi-brand-ambassador-description');
  Config.indi.brandAmbassador.submit_button_text = intl.get('indi-brand-ambassador-submit-button-text');

  return (
    <div className="home-page-b2c">
      <section className="main-banner">
        <img className="main-banner-image" src={bannerImage1} alt="" />
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
                  <img className="main-goods-image" src={productImage1} alt="" />
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
                  <img className="main-goods-image" src={productImage2} alt="" />
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
                  <img className="main-goods-image" src={productImage3} alt="" />
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
                  <img className="main-goods-image" src={productImage4} alt="" />
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
                  <img className="main-goods-image" src={productImage5} alt="" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="main-banner banner-section-2">
        <img className="main-banner-image" src={bannerImage2} alt="" />
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
                  <img className="main-goods-image" src={productImage6} alt="" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <h5 className="goods-title-small">{intl.get('b2c-product7-label')}</h5>
                    <h3 className="goods-title">{intl.get('b2c-product7-heading')}</h3>
                    <p className="goods-description">{intl.get('b2c-product7-description')}</p>
                  </div>
                  <img className="main-goods-image" src={productImage7} alt="" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="main-banner banner-section-3">
        <img className="main-banner-image" src={bannerImage3} alt="" />
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
