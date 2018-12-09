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
import { Link } from 'react-router-dom';

import homeEspotMain from '../images/site-images/homepage-banner.jpg';
import homeEspot2 from '../images/site-images/brake-icon.jpg';
import homeEspot3 from '../images/site-images/charging-icon.jpg';
import homeEspot4 from '../images/site-images/warranty-graphic.jpg';

import './HomePage.less';

const Config = require('Config');

const homeEspotMainFileName = 'homepage-banner.jpg';
const homeEspot2FileName = 'brake-icon.jpg';
const homeEspot3FileName = 'charging-icon.jpg';
const homeEspot4FileName = 'warranty-graphic.jpg';

function HomePage() {
  return (
    <div className="home-page-component" data-region="viewPortRegion">
      <div className="section section-1 container" data-region="homeMainContentRegion">
        <img className="cover" alt="home-espot-1" src={Config.siteImagesUrl.replace('%fileName%', homeEspotMainFileName)} onError={(e) => { e.target.src = homeEspotMain; }} />
      </div>
      <div className="section section-2 container">
        <div className="sub-section">
          <span className="line line-1">
            {intl.get('home-sub-espot-container1-first-line')}
          </span>
          <span className="line line-2">
            {intl.get('home-sub-espot-container1-second-line')}
          </span>
          <span className="line line-3">
            <Link className="ep-btn primary wide btn-accessories accessories-link" to="/category/VESTRI_ACCESSORIES">
              <span>
                {intl.get('home-sub-espot-container1-button')}
              </span>
            </Link>
          </span>
        </div>
      </div>
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
    </div>
  );
}

export default HomePage;
