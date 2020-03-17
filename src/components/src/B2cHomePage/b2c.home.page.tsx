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
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import IndiRecommendationsDisplayMain from '../IndiRecommendations/indirecommendations.main';
import ImageContainer from '../ImageContainer/image.container';

import './b2c.home.page.less';

import heroImagePourCoffee from '../../../images/site-images/hero_image_pour_coffee.png';
import heroImageBlender from '../../../images/site-images/hero_image_blender.png';
import iceCreamImage from '../../../images/site-images/ice_cream.png';
import heroImageShipping from '../../../images/site-images/hero_image_shipping.png';
import heroBanner from '../../../images/site-images/hero_image_coffee.png';
import ARImage from '../../../images/site-images/hero_image_AR.png';
import heroImageToasterImage from '../../../images/site-images/hero_image_toaster.png';

let Config: IEpConfig | any = {};
let intl = { get: str => str };
const heroBannerFileName = 'hero_image_coffee.png';

const heroImagePourCoffeeFileName = 'hero_image_pour_coffee.png';
const heroImageBlenderFileName = 'hero_image_blender.png';
const iceCreamImageFileName = 'ice_cream.png';
const shippingImageFileName = 'hero_image_shipping.png';
const ARImageFileName = 'hero_image_AR.png';
const heroImageToasterFileName = 'hero_image_toaster.png';

const B2CHomePage: React.FunctionComponent = () => {
  const epConfig = getConfig();
  Config = epConfig.config;
  ({ intl } = epConfig);

  // Set the language-specific configuration for indi integration
  Config.indi.brandAmbassador.title = intl.get('indi-brand-ambassador-title');
  Config.indi.brandAmbassador.description = intl.get('indi-brand-ambassador-description');
  Config.indi.brandAmbassador.submit_button_text = intl.get('indi-brand-ambassador-submit-button-text');

  return (
    <div className="home-page-b2c">
      <section className="main-banner">
        <ImageContainer className="main-banner-image" fileName={heroBannerFileName} imgUrl={heroBanner} />
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

      <div className="container">
        <div className="main-goods">
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
                <ImageContainer className="main-goods-image" fileName={heroImagePourCoffeeFileName} imgUrl={heroImagePourCoffee} />
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
                <ImageContainer className="main-goods-image" fileName={heroImageBlenderFileName} imgUrl={heroImageBlender} />
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
                <ImageContainer className="main-goods-image" fileName={iceCreamImageFileName} imgUrl={iceCreamImage} />
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
                <ImageContainer className="main-goods-image" fileName={shippingImageFileName} imgUrl={heroImageShipping} />
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
                <ImageContainer className="main-goods-image" fileName={ARImageFileName} imgUrl={ARImage} />
              </div>
            </li>
          </ul>
        </div>
      </div>

      <section className="main-banner">
        <ImageContainer className="main-banner-image" fileName={heroImageToasterFileName} imgUrl={heroImageToasterImage} />
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
    </div>
  );
};

export default B2CHomePage;
