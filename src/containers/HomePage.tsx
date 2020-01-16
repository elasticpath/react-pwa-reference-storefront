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
import { withRouter } from 'react-router';
import intl from 'react-intl-universal';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { ComplianceSupportModal, Carousel, IndiRecommendationsDisplayMain } from '../components/src/index';
import Config from '../ep.config.json';

import homeEspot2 from '../images/site-images/brake-icon.jpg';
import homeEspot3 from '../images/site-images/charging-icon.jpg';
import homeEspot4 from '../images/site-images/warranty-graphic.jpg';
import homeEspotParallax1 from '../images/site-images/car-inside.jpg';
import homeEspotParallax2 from '../images/site-images/car-dashboard.jpg';

import './HomePage.less';

const homeEspot2FileName = 'brake-icon.jpg';
const homeEspot3FileName = 'charging-icon.jpg';
const homeEspot4FileName = 'warranty-graphic.jpg';
const homeEspotParallax1FileName = 'car-inside.jpg';
const homeEspotParallax2FileName = 'car-dashboard.jpg';

const showCompliance = Config.Compliance.enable;
const isComplianceAccepted = localStorage.getItem(`${Config.cortexApi.scope}_Compliance_Accept`);
const isComplianceDeclined = localStorage.getItem(`${Config.cortexApi.scope}_Compliance_Decline`);

const HomePage: React.FunctionComponent = () => {
  function handleAcceptDataPolicy() {
    window.location.reload();
  }
  // Set the language-specific configuration for indi integration
  Config.indi.brandAmbassador.title = intl.get('indi-brand-ambassador-title');
  Config.indi.brandAmbassador.description = intl.get('indi-brand-ambassador-description');
  Config.indi.brandAmbassador.submit_button_text = intl.get('indi-brand-ambassador-submit-button-text');

  if (!Config.b2b.enable) {
    return (
      <ParallaxProvider>
        <div className="home-page-component" data-region="viewPortRegion">
          <Carousel />
          <IndiRecommendationsDisplayMain render={['carousel', 'brand']} configuration={Config.indi} />
          {/* eslint-disable-next-line no-return-assign */}
          <div className="section section-3 container">
            <div className="sub-section">
              <img className="small-image" alt="home-espot-2" src={Config.siteImagesUrl.replace('%fileName%', homeEspot2FileName)} onError={(e: any) => { e.target.src = homeEspot3; }} />
              <div className="text-block">
                <span className="line line-1">
                  {intl.get('home-sub-espot-container2-first-line')}
                </span>
                <span className="line line-2">
                  {intl.get('home-sub-espot-container2-second-line')}
                </span>
              </div>
            </div>
          </div>
          <div className="section-parallax section-parallax-1 container" data-region="homeMainContentRegion">
            <Parallax y={[-50, 10]} tagOuter="figure">
              <div className="parallax-image-container">
                <img className="parallax-image" alt="home-espot-1" src={Config.siteImagesUrl.replace('%fileName%', homeEspotParallax1FileName)} onError={(e: any) => { e.target.src = homeEspot3; }} />
              </div>
            </Parallax>
            <div className="sub-section">
              <div className="text-block">
                <span className="line line-white">
                  {intl.get('home-sub-espot-container2-second-line')}
                </span>
                <span className="line line-link">
                Learn more
                </span>
              </div>
            </div>
          </div>
          <div className="section section-4 container">
            <div className="sub-section">
              <img className="small-image image-1" alt="home-espot-3" src={Config.siteImagesUrl.replace('%fileName%', homeEspot3FileName)} onError={(e: any) => { e.target.src = homeEspot3; }} />
              <div className="text-block">
                <span className="line line-1">
                  {intl.get('home-sub-espot-container3-first-line')}
                </span>
                <span className="line line-2">
                  {intl.get('home-sub-espot-container3-second-line')}
                </span>
              </div>
              <img className="small-image image-2" alt="home-espot-3" src={Config.siteImagesUrl.replace('%fileName%', homeEspot3FileName)} onError={(e: any) => { e.target.src = homeEspot3; }} />
            </div>
          </div>
          <div className="section section-5 container">
            <div className="sub-section">
              <img className="small-image" alt="home-espot-4" src={Config.siteImagesUrl.replace('%fileName%', homeEspot4FileName)} onError={(e: any) => { e.target.src = homeEspot4; }} />
              <div className="text-block">
                <span className="line line-1">
                  {intl.get('home-sub-espot-container4-first-line')}
                </span>
                <span className="line line-2">
                  {intl.get('home-sub-espot-container4-second-line')}
                </span>
              </div>
            </div>
          </div>
          <div className="section-parallax section-parallax-2 container" data-region="homeMainContentRegion">
            <Parallax y={[10, -30]} tagOuter="figure">
              <div className="parallax-image-container">
                <img className="parallax-image" alt="home-espot-1" src={Config.siteImagesUrl.replace('%fileName%', homeEspotParallax2FileName)} onError={(e: any) => { e.target.src = homeEspotParallax2; }} />
              </div>
            </Parallax>
            <div className="sub-section">
              <div className="text-block">
                <span className="line line-white">
                  {intl.get('home-sub-espot-container2-second-line')}
                </span>
                <span className="line line-link">
                Learn more
                </span>
              </div>
            </div>
          </div>
          {showCompliance && !isComplianceAccepted && !isComplianceDeclined && <ComplianceSupportModal onAcceptDataPolicy={handleAcceptDataPolicy} />}
        </div>
      </ParallaxProvider>
    );
  }

  return (
    <div className="home-page-b2b">
      <section className="main-banner">
        <div className="main-banner-title-wrap">
          <div className="container">
            <h2 className="goods-heading">Start your day with a great cup of coffee</h2>
            <div className="main-banner-txt">
              <p className="goods-description">
                kick start your day, a cup of coffee will boost your energy and get you going for a long day ahead, whether at work or at home with the kids. To have the best cup of coffee you need to use the best coffee maker.
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
              <h5 className="goods-title-small">{intl.get('products')}</h5>
              <h3 className="goods-title">Coffee without compromise</h3>
              <p className="goods-description">When it comes to replicating third wave specialty coffee at home, there’s no cutting corners. That’s why we’ve created a range of innovative espresso machines that set out to honour tradition and the techniques that define the very fundamentals required for third wave specialty coffee.</p>
            </li>
            <li className="main-goods__cell">
              <h5 className="goods-title-small">{intl.get('products')}</h5>
              <h3 className="goods-title">Say hello to a Smart Oven</h3>
              <p className="goods-description">There’s heat, and there’s smart heat. Element iQ transfers heat intelligently across 5 quartz elements for precise and stable heat just where and when you want it for perfect results, every time. Super fast 2400W preheat gets your meals on the table more quickly.</p>
            </li>
            <li className="main-goods__cell">
              <h5 className="goods-title-small">{intl.get('products')}</h5>
              <h3 className="goods-title">Juicers</h3>
              <p className="goods-description">
                To make healthy eating as easy as possible, and help you enjoy every drop of your recommended daily servings, we’ve developed a range of innovative juicers, blenders and bluicers that will mix, squeeze, spin and deliver all the goodness your body needs to feel its best.
                The flavoursome combinations you can create using simple, fresh ingredients are only limited by your imagination.
              </p>
            </li>
          </ul>

          <div className="main-goods__cell main-goods__block">
            <h5 className="goods-title-small">{intl.get('services')}</h5>
            <h3 className="goods-title">White glove service</h3>
            <p className="goods-description">
              You will receive a call from our delivery partner within 72 hours◊◊ after your purchase to schedule a delivery date for products in stock.
              In cases where the order includes one or more special-order items, you will receive a courtesy call from Customer Service – Cooks Appliances Central within 72 hours to confirm your order. When the goods are received, our delivery partner will contact you to schedule a delivery date.
              Please provide the following info upon confirmation of your delivery:
              The number of used appliances to pick-up
              If you purchased an espresso machine please specify whether you will need help with altering the doorway, or any other special request. You will receive an automated call on the day before the scheduled delivery date to confirm the timeframe you have been given.
            </p>
          </div>

          <div className="main-goods__cell main-goods__block bottom-block">
            <h2 className="goods-heading">About Cooks</h2>
            <p className="goods-description">
              Award winning kitchen appliances designed to inspire people to produce perfect food and beverage results in their own homes with ease. From espresso machines to food processors, the innovation in each appliance delights.
              The scents, sights and sounds of cooking awaken memories and create new ones. Shared with the people in your life who matter most.  This is why we do what we do. Listen. Obsess. Innovate. Test. Refine. Design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(HomePage);
