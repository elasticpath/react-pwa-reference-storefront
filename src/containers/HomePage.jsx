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
import { withRouter } from 'react-router';
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

class HomePage extends React.Component {
  componentDidMount() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    /* eslint-disable-next-line no-multi-str */
    s.innerHTML = 'var indi_carousel = new indi.carousel("#indi-carousel-root", {\
      apikey: "EERIxwXF644c1E1To5puL8xNP5PvLHSv240PyNYf",\
      id: "5b2c577c-1cef-4b18-a49e-fc924783351c",\
      size: "large",\
      theme: "light",\
      round_corners: false,\
      show_title: false,\
      show_views: false,\
      show_likes: false,\
      show_buzz: false,\
      animate: true\
    });';
    this.instance.appendChild(s);

    const j = document.createElement('script');
    j.type = 'text/javascript';
    j.async = true;
    /* eslint-disable-next-line no-multi-str */
    j.innerHTML = 'var indi_forum = new indi.forum("#indi-forum-root", {\
      title: "Join Our Brand Ambassador Program",\
      description: "Upload a photo or video about Vestri",\
      submit_button_text: "UPLOAD PHOTO/VIDEO",\
      submit_button_url: "https://indi.com/Submit/ForumTerms?id=e26b530c-319c-4e81-8444-5e7c27acd39a",\
      thumbnail_url: "https://images.indi.com/s3/indi-upload-us-west-1/Image/f3ffee3e35213cfc30ee5b6525fa71c9.jpg"\
    });';
    this.instance.appendChild(j);
  }

  render() {
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
        <div id="indi-carousel-root" />
        <div id="indi-forum-root" />
        {/* eslint-disable-next-line no-return-assign */}
        <div ref={el => (this.instance = el)} />
      </div>
    );
  }
}

export default withRouter(HomePage);
