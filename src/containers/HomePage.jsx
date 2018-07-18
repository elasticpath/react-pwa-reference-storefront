/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
