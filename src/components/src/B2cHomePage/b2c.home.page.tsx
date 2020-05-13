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

import bannerImage1 from '../../../images/site-images/b2c-banner-1.png';
import bannerImage2 from '../../../images/site-images/b2c-banner-2.png';
import bannerImage3 from '../../../images/site-images/b2c-banner-3.png';
import productImage1 from '../../../images/site-images/b2c-product-1.png';
import productImage2 from '../../../images/site-images/b2c-product-2.png';
import productImage3 from '../../../images/site-images/b2c-product-3.png';
import productImage4 from '../../../images/site-images/b2c-product-4.png';
import productImage5 from '../../../images/site-images/b2c-product-5.png';
import productImage6 from '../../../images/site-images/b2c-product-6.png';
import productImage7 from '../../../images/site-images/b2c-product-7.png';


const bannerFileName1 = 'b2c-banner-1';
const bannerFileName2 = 'b2c-banner-2';
const bannerFileName3 = 'b2c-banner-3';
const productFileName1 = 'b2c-product-1';
const productFileName2 = 'b2c-product-2';
const productFileName3 = 'b2c-product-3';
const productFileName4 = 'b2c-product-4';
const productFileName5 = 'b2c-product-5';
const productFileName6 = 'b2c-product-6';
const productFileName7 = 'b2c-product-7';

const B2CHomePage: React.FunctionComponent = () => {
  // Set the language-specific configuration for indi integration
  Config.indi.brandAmbassador.title = intl.get('indi-brand-ambassador-title');
  Config.indi.brandAmbassador.description = intl.get('indi-brand-ambassador-description');
  Config.indi.brandAmbassador.submit_button_text = intl.get('indi-brand-ambassador-submit-button-text');

  return (
    <div className="home-page-b2c">
      <section className="main-banner">
        <ImageContainer imgClassName="main-banner-image" pictureClassName="main-banner-image" fileName={bannerFileName1} imgUrl={bannerImage1} />
        <div className="main-banner-title-wrap">
          <div className="container">
            <h1 className="goods-heading">{intl.get('b2c-main-banner-heading')}</h1>
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
                    <p className="goods-title-small">{intl.get('b2c-product1-label')}</p>
                    <p className="goods-title">{intl.get('b2c-product1-heading')}</p>
                    <div className="btn-wrap">
                      <button type="button" className="ep-btn primary learn-more-btn">{intl.get('learn-more')}</button>
                    </div>
                  </div>
                  <ImageContainer imgClassName="main-goods-image" pictureClassName="main-goods-picture" fileName={productFileName1} imgUrl={productImage1} />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{intl.get('b2c-product2-label')}</p>
                    <p className="goods-title">{intl.get('b2c-product2-heading')}</p>
                    <p className="goods-description">{intl.get('b2c-product2-description')}</p>
                    <button type="button" className="ep-btn primary learn-more-btn">{intl.get('add-to-cart-2')}</button>
                  </div>
                  <ImageContainer imgClassName="main-goods-image" pictureClassName="main-goods-picture" fileName={productFileName2} imgUrl={productImage2} />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{intl.get('b2c-product3-label')}</p>
                    <p className="goods-title">{intl.get('b2c-product3-heading')}</p>
                    <p className="goods-description">
                      {intl.get('b2c-product3-description')}
                    </p>
                    <button type="button" className="ep-btn primary learn-more-btn">{intl.get('b2c-product3-label')}</button>
                  </div>
                  <ImageContainer pictureClassName="main-goods-picture" imgClassName="main-goods-image" fileName={productFileName3} imgUrl={productImage3} />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{intl.get('b2c-product4-label')}</p>
                    <p className="goods-title">{intl.get('b2c-product4-heading')}</p>
                    <p className="goods-description">
                      {intl.get('b2c-product4-description')}
                    </p>
                  </div>
                  <ImageContainer imgClassName="main-goods-image" pictureClassName="main-goods-picture" fileName={productFileName4} imgUrl={productImage4} />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{intl.get('b2c-product5-label')}</p>
                    <p className="goods-title">
                      {intl.get('b2c-product5-heading')}
                    </p>
                  </div>
                  <ImageContainer imgClassName="main-goods-image" pictureClassName="main-goods-picture" fileName={productFileName5} imgUrl={productImage5} />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="main-banner banner-section-2">
        <ImageContainer imgClassName="main-banner-image" pictureClassName="main-banner-image" fileName={bannerFileName2} imgUrl={bannerImage2} />
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
                    <p className="goods-title-small">{intl.get('b2c-product6-label')}</p>
                    <p className="goods-title">{intl.get('b2c-product6-heading')}</p>
                    <p className="goods-description">{intl.get('b2c-product6-description')}</p>
                  </div>
                  <ImageContainer imgClassName="main-goods-image" pictureClassName="main-goods-picture" fileName={productFileName6} imgUrl={productImage6} />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{intl.get('b2c-product7-label')}</p>
                    <p className="goods-title">{intl.get('b2c-product7-heading')}</p>
                    <p className="goods-description">{intl.get('b2c-product7-description')}</p>
                  </div>
                  <ImageContainer imgClassName="main-goods-image" pictureClassName="main-goods-picture" fileName={productFileName7} imgUrl={productImage7} />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="main-banner banner-section-3">
        <ImageContainer imgClassName="main-banner-image" pictureClassName="main-banner-image" fileName={bannerFileName3} imgUrl={bannerImage3} />
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
                    <p className="goods-title-small">{intl.get('customers')}</p>
                    <p className="goods-title">{intl.get('company-commitment')}</p>
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
                    <p className="goods-title-small">{intl.get('company')}</p>
                    <p className="goods-title">{intl.get('company-name')}</p>
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
