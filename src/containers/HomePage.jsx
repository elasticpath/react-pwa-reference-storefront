/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';

import homeEspotMain from '../images/site-images/homepage-banner.jpg';
import homeEspot2 from '../images/site-images/brake-icon.jpg';
import homeEspot3 from '../images/site-images/charging-icon.png';
import homeEspot4 from '../images/site-images/warranty-graphic.jpg';

const Config = require('Config');

const homeEspotMainFileName = 'homepage-banner.jpg';
const homeEspot2FileName = 'brake-icon.jpg';
const homeEspot3FileName = 'charging-icon.png';
const homeEspot4FileName = 'warranty-graphic.jpg';

function HomePage() {
  return (
    <div className="viewport ui-container home-ui-container" data-region="viewPortRegion" style={{ display: 'block' }}>
      <div>
        <AppHeaderMain />
        <div className="home-contant-container" style={{ display: 'block' }}>
          <div>
            <div data-region="homeMainContentRegion" className="home-espot-container container" style={{ display: 'block' }}>
              <img alt="home-espot-1" className="home-espot-1" src={Config.siteImagesUrl.replace('%fileName%', homeEspotMainFileName)} onError={(e) => { e.target.src = homeEspotMain; }} />
            </div>
            <div className="home-sub-espot-container1 container">
              <div className="home-sub-espot-container1-sub">
                <span className="home-sub-espot-container1-first-line">
                  {intl.get('home-sub-espot-container1-first-line')}
                </span>
                <span className="home-sub-espot-container1-second-line">
                  {intl.get('home-sub-espot-container1-second-line')}
                </span>
                <button className="home-sub-espot-container1-button" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                  {intl.get('home-sub-espot-container1-button')}
                </button>
              </div>
            </div>
            <div className="home-sub-espot-container2 container">
              <div className="home-sub-espot-container2-sub">
                <img alt="home-espot-2" className="home-espot-2" src={Config.siteImagesUrl.replace('%fileName%', homeEspot2FileName)} onError={(e) => { e.target.src = homeEspot2; }} />
                <div className="home-sub-espot-container2-text">
                  <span className="home-sub-espot-container2-first-line">
                    {intl.get('home-sub-espot-container2-first-line')}
                  </span>
                  <span className="home-sub-espot-container2-second-line">
                    {intl.get('home-sub-espot-container2-second-line')}
                  </span>
                </div>
              </div>
            </div>
            <div className="home-sub-espot-container3 container">
              <div className="home-sub-espot-container3-sub">
                <img alt="home-espot-3" className="home-espot-3-mobile" src={Config.siteImagesUrl.replace('%fileName%', homeEspot3FileName)} onError={(e) => { e.target.src = homeEspot3; }} />
                <div className="home-sub-espot-container3-text">
                  <span className="home-sub-espot-container3-first-line">
                    {intl.get('home-sub-espot-container3-first-line')}
                  </span>
                  <span className="home-sub-espot-container3-second-line">
                    {intl.get('home-sub-espot-container3-second-line')}
                  </span>
                </div>
                <img alt="home-espot-3" className="home-espot-3" src={Config.siteImagesUrl.replace('%fileName%', homeEspot3FileName)} onError={(e) => { e.target.src = homeEspot3; }} />
              </div>
            </div>
            <div className="home-sub-espot-container4 container">
              <div className="home-sub-espot-container4-sub">
                <img alt="home-espot-4" className="home-espot-4" src={Config.siteImagesUrl.replace('%fileName%', homeEspot4FileName)} onError={(e) => { e.target.src = homeEspot4; }} />
                <div className="home-sub-espot-container4-text">
                  <span className="home-sub-espot-container4-first-line">
                    {intl.get('home-sub-espot-container4-first-line')}
                  </span>
                  <span className="home-sub-espot-container4-second-line">
                    {intl.get('home-sub-espot-container4-second-line')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AppFooterMain />
      </div>
    </div>
  );
}

export default HomePage;
