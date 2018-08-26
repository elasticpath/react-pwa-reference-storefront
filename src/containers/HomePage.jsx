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
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';

import homeEspotMain from '../images/homepage-banner.jpg';
import homeEspot2 from '../images/brake-icon.jpg';
import homeEspot3 from '../images/charging-icon.png';
import homeEspot4 from '../images/warranty-graphic.jpg';

function HomePage() {
  return (
    <div className="viewport ui-container home-ui-container" data-region="viewPortRegion" style={{ display: 'block' }}>
      <div>
        <AppHeaderMain />
        <div className="home-contant-container" style={{ display: 'block' }}>
          <div>
            <div data-region="homeMainContentRegion" className="home-espot-container container" style={{ display: 'block' }}>
              <img alt="home-espot-1" className="home-espot-1" src={homeEspotMain} />
            </div>
            <div className="home-sub-espot-container1 container">
              <div className="home-sub-espot-container1-sub">
                <span className="home-sub-espot-container1-first-line">
                  Find all the right accessories to live the Vestri brand.
                </span>
                <span className="home-sub-espot-container1-second-line">
                  Choose from dozens of clothing options to fit your specific needs.
                </span>
                <button className="home-sub-espot-container1-button" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                  VIEW OUR PRODUCTS
                </button>
              </div>
            </div>
            <div className="home-sub-espot-container2 container">
              <div className="home-sub-espot-container2-sub">
                <img alt="home-espot-2" className="home-espot-2" src={homeEspot2} />
                <div className="home-sub-espot-container2-text">
                  <span className="home-sub-espot-container2-first-line">
                    Fully automated braking system
                  </span>
                  <span className="home-sub-espot-container2-second-line">
                    Take advantage of our patented Brake-Smart™ technology across all of our vehicles to avoid accidents and drive smart in all weather conditions.
                  </span>
                </div>
              </div>
            </div>
            <div className="home-sub-espot-container3 container">
              <div className="home-sub-espot-container3-sub">
                <img alt="home-espot-3" className="home-espot-3-mobile" src={homeEspot3} />
                <div className="home-sub-espot-container3-text">
                  <span className="home-sub-espot-container3-first-line">
                    Effortless plug-and-play charging
                  </span>
                  <span className="home-sub-espot-container3-second-line">
                    Just download our app, book a charging session from one of thousands of authorized charging location, plug in your car and you’re good to go!
                  </span>
                </div>
                <img alt="home-espot-3" className="home-espot-3" src={homeEspot3} />
              </div>
            </div>
            <div className="home-sub-espot-container4 container">
              <div className="home-sub-espot-container4-sub">
                <img alt="home-espot-4" className="home-espot-4" src={homeEspot4} />
                <div className="home-sub-espot-container4-text">
                  <span className="home-sub-espot-container4-first-line">
                    Unlimited km warranty
                  </span>
                  <span className="home-sub-espot-container4-second-line">
                    No matter how far you drive, we’re there for you. Bring your car into the nearest dealer location and we’ll give your electric engine the tune-up it needs - regardless of the time since your last appointment.
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
