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
import { GdprSupportModal, Carousel, IndiRecommendationsDisplayMain } from '@elasticpath/store-components';
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

const showGDPR = Config.GDPR.enable;
const gdprSupportAccept = localStorage.getItem(`${Config.cortexApi.scope}_GDPR_Support_Accept`);
const gdprSupportDecline = localStorage.getItem(`${Config.cortexApi.scope}_GDPR_Support_Decline`);

const HomePage: React.FunctionComponent = () => {
  const carouselLink = '/category/VESTRI_ACCESSORIES';
  function handleAcceptDataPolicy() {
    window.location.reload();
  }
  // Set the language-specific configuration for indi integration
  Config.indi.brandAmbassador.title = intl.get('indi-brand-ambassador-title');
  Config.indi.brandAmbassador.description = intl.get('indi-brand-ambassador-description');
  Config.indi.brandAmbassador.submit_button_text = intl.get('indi-brand-ambassador-submit-button-text');

  return (
    <ParallaxProvider>
      <div className="home-page-component" data-region="viewPortRegion">
        <Carousel carouselLink={carouselLink} />
        <IndiRecommendationsDisplayMain render={['carousel', 'brand']} configuration={Config.indi} />
        {/* eslint-disable-next-line no-return-assign */}
        <div className="section section-3 container">
          <div className="sub-section">
            <img className="small-image" alt="home-espot-2" src={Config.siteImagesUrl.replace('%fileName%', homeEspot2FileName)} onError={(e) => { e.target.src = homeEspot2; }} />
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
          <Parallax y={[-50, 10]} tag="figure">
            <div className="parallax-image-container">
              <img className="parallax-image" alt="home-espot-1" src={Config.siteImagesUrl.replace('%fileName%', homeEspotParallax1FileName)} onError={(e) => { e.target.src = homeEspotParallax1; }} />
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
            <img className="small-image image-1" alt="home-espot-3" src={Config.siteImagesUrl.replace('%fileName%', homeEspot3FileName)} onError={(e) => { e.target.src = homeEspot3; }} />
            <div className="text-block">
              <span className="line line-1">
                {intl.get('home-sub-espot-container3-first-line')}
              </span>
              <span className="line line-2">
                {intl.get('home-sub-espot-container3-second-line')}
              </span>
            </div>
            <img className="small-image image-2" alt="home-espot-3" src={Config.siteImagesUrl.replace('%fileName%', homeEspot3FileName)} onError={(e) => { e.target.src = homeEspot3; }} />
          </div>
        </div>
        <div className="section section-5 container">
          <div className="sub-section">
            <img className="small-image" alt="home-espot-4" src={Config.siteImagesUrl.replace('%fileName%', homeEspot4FileName)} onError={(e) => { e.target.src = homeEspot4; }} />
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
          <Parallax y={[10, -30]} tag="figure">
            <div className="parallax-image-container">
              <img className="parallax-image" alt="home-espot-1" src={Config.siteImagesUrl.replace('%fileName%', homeEspotParallax2FileName)} onError={(e) => { e.target.src = homeEspotParallax2; }} />
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
        {showGDPR && !gdprSupportAccept && !gdprSupportDecline && <GdprSupportModal onAcceptDataPolicy={handleAcceptDataPolicy} />}
      </div>
    </ParallaxProvider>
  );
};

export default withRouter(HomePage);
