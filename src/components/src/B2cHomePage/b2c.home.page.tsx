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
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import Carousel from '../Carousel/carousel.homepage';
import IndiRecommendationsDisplayMain from '../IndiRecommendations/indirecommendations.main';
import ImageContainer from '../ImageContainer/image.container';

import './b2c.home.page.less';

import heroImagePourCoffee from '../../../images/site-images/hero_image_pour_coffee.png';
import heroImageBlender from '../../../images/site-images/hero_image_blender.png';
import iceCreamImage from '../../../images/site-images/ice_cream.png';
import heroImageShipping from '../../../images/site-images/hero_image_shipping.png';
import heroBanner from '../../../images/site-images/hero_image_coffee.png';

let Config: IEpConfig | any = {};
let intl = { get: str => str };
const heroBannerFileName = 'hero_image_coffee.png';

const heroImagePourCoffeeFileName = 'hero_image_pour_coffee.png';
const heroImageBlenderFileName = 'hero_image_blender.png';
const iceCreamImageFileName = 'ice_cream.png';
const shippingImageFileName = '/hero_image_shipping.png';

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
            <h2 className="goods-heading">{intl.get('main-banner-heading')}</h2>
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
              <div className="main-goods-wrap">
                <div className="goods-info">
                  <h5 className="goods-title-small">Espresso Machines</h5>
                  <h3 className="goods-title">Be your own Barista with your very own Espresso machine</h3>
                  <div className="btn-wrap">
                    <button type="button" className="ep-btn primary learn-more-btn">{intl.get('learn-more')}</button>
                  </div>
                </div>
                <ImageContainer className="main-goods-image banner-1" fileName={heroImagePourCoffeeFileName} imgUrl={heroImagePourCoffee} />
              </div>
            </li>
            <li className="main-goods__cell">
              <div className="main-goods-wrap">
                <div className="goods-info">
                  <h5 className="goods-title-small">Healthy</h5>
                  <h3 className="goods-title">More flavours, more variety, more fun.</h3>
                  <p className="goods-description">Make the most of your fresh ingredients with the 3X Bluicer Pro. This high performance blender juicer features our Kinetix®</p>
                  <button type="button" className="ep-btn primary learn-more-btn">{intl.get('add-to-cart-2')}</button>
                </div>
                <ImageContainer className="main-goods-image banner-2" fileName={heroImageBlenderFileName} imgUrl={heroImageBlender} />
              </div>
            </li>
            <li className="main-goods__cell">
              <div className="main-goods-wrap">
                <div className="goods-info">
                  <h5 className="goods-title-small">Ice cream makers</h5>
                  <h3 className="goods-title">Frozen treats with fresh ingredients.</h3>
                  <p className="goods-description">
                    The Smart Scoop™ transforms the kitchen into your favorite scoop shop. The first ice cream maker to automatically sense the hardness of the mixture based on your selection.
                  </p>
                  <button type="button" className="ep-btn primary learn-more-btn">Ice cream makers</button>
                </div>
                <ImageContainer className="main-goods-image banner-3" fileName={iceCreamImageFileName} imgUrl={iceCreamImage} />
              </div>
            </li>
            <li className="main-goods__cell">
              <div className="main-goods-wrap">
                <div className="goods-info">
                  <h5 className="goods-title-small">Serving you</h5>
                  <h3 className="goods-title">Free Shipping</h3>
                  <p className="goods-description">
                    Free shipping on all orders of $50!
                  </p>
                </div>
                <ImageContainer className="main-goods-image banner-3" fileName={shippingImageFileName} imgUrl={heroImageShipping} />
              </div>
            </li>
            <li>Test</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default B2CHomePage;
