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

import homeEspotMain from '../images/Hero-Image-v2.jpg';
import homeEspot1 from '../images/VESTRI_CR-550_Banner.jpeg';
import homeEspot2 from '../images/VESTRI_M-CLASS_3_Banner.jpeg';
import homeEspot3 from '../images/VESTRI_X-CLASS_EL2_Banner.jpeg';

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
              <img alt="home-espot-2" className="home-espot-2" src={homeEspot1} />
              <img alt="home-espot-3" className="home-espot-3" src={homeEspot2} />
            </div>
            <div data-region="homeMainContentRegion" className="home-sub-espot-container2 container" style={{ display: 'block' }}>
              <img alt="home-espot-4" className="home-espot-4" src={homeEspot3} />
            </div>
          </div>
        </div>
        <AppFooterMain />
      </div>
    </div>
  );
}

export default HomePage;
