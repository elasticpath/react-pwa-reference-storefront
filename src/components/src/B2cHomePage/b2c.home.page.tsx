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

import homeEspot2 from '../../../images/site-images/home-block-image-3.jpg';
import homeEspot3 from '../../../images/site-images/home-block-image-2.jpg';
import homeEspot4 from '../../../images/site-images/home-block-image-1.jpg';
import homeEspotParallax2 from '../../../images/site-images/parallax-banner-2.jpg';
import homeEspotParallax1 from '../../../images/site-images/parallax-banner-1.jpg';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

const homeEspot2FileName = 'home-block-image-3.jpg';
const homeEspot3FileName = 'home-block-image-2.jpg';
const homeEspot4FileName = 'home-block-image-1.jpg';
const homeEspotParallax1FileName = 'parallax-banner-1.jpg';
const homeEspotParallax2FileName = 'parallax-banner-2.jpg';

const B2CHomePage: React.FunctionComponent = () => {
  const epConfig = getConfig();
  Config = epConfig.config;
  ({ intl } = epConfig);

  // Set the language-specific configuration for indi integration
  Config.indi.brandAmbassador.title = intl.get('indi-brand-ambassador-title');
  Config.indi.brandAmbassador.description = intl.get('indi-brand-ambassador-description');
  Config.indi.brandAmbassador.submit_button_text = intl.get('indi-brand-ambassador-submit-button-text');

  return (
    <ParallaxProvider>
      <div className="home-page-component" data-region="viewPortRegion">
        <Carousel />
        <IndiRecommendationsDisplayMain render={['carousel', 'brand']} configuration={Config.indi} />
        {/* eslint-disable-next-line no-return-assign */}
        <div className="section section-3 container">
          <div className="sub-section">
            <ImageContainer className="small-image" fileName={homeEspot2FileName} imgUrl={homeEspot2} />
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
              <ImageContainer className="parallax-image" fileName={homeEspotParallax1FileName} imgUrl={homeEspotParallax1} />
            </div>
          </Parallax>
          <div className="sub-section">
            <div className="text-block">
              <span className="line line-white">
                {intl.get('home-sub-espot-container2-second-line')}
              </span>
              <span className="line line-link">
                {intl.get('learn-more')}
              </span>
            </div>
          </div>
        </div>
        <div className="section section-4 container">
          <div className="sub-section">
            <ImageContainer className="small-image image-1" fileName={homeEspot3FileName} imgUrl={homeEspot3} />
            <div className="text-block">
              <span className="line line-1">
                {intl.get('home-sub-espot-container3-first-line')}
              </span>
              <span className="line line-2">
                {intl.get('home-sub-espot-container3-second-line')}
              </span>
            </div>
            <ImageContainer className="small-image image-2" fileName={homeEspot3FileName} imgUrl={homeEspot3} />
          </div>
        </div>
        <div className="section section-5 container">
          <div className="sub-section">
            <ImageContainer className="small-image" fileName={homeEspot4FileName} imgUrl={homeEspot4} />
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
              <ImageContainer className="parallax-image" fileName={homeEspotParallax2FileName} imgUrl={homeEspotParallax2} />
            </div>
          </Parallax>
          <div className="sub-section">
            <div className="text-block">
              <span className="line line-white">
                {intl.get('home-sub-espot-container2-second-line')}
              </span>
              <span className="line line-link">
                {intl.get('learn-more')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ParallaxProvider>
  );
};

export default B2CHomePage;
