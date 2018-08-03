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
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';

import doge from '../images/HikingDog.png';

function AboutUsPage() {
  return (
    <div className="viewport ui-container static-ui-container" data-region="viewPortRegion" style={{ display: 'block' }}>
      <div>
        <AppHeaderMain hideHeaderNavigation />
        <div className="app-main static-contant-container" data-region="appMain" style={{ display: 'block' }}>
          <div>
            <div className="static-container container">
              <div className="static-container-inner">
                <div className="static-title-container" style={{ display: 'block' }}>
                  <div>
                    <h1>
                      {intl.get('something-went-wrong-message')}
                    </h1>
                    <h3 className="dog-view-title-message">
                      {intl.get('try-again-message')}
                      &nbsp;
                      <span className="dog-view-title-message-redirect">
                        <Link to="/">
                          {intl.get('return-home')}
                          .
                        </Link>
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="static-container dog-container" style={{ display: 'block' }}>
                  <div className="container" style={{ display: 'block' }}>
                    <img alt="home-espot-1" className="home-espot-1" src={doge} />
                  </div>
                  <h2 className="static-dog-name">
                    {intl.get('name-moki')}
                  </h2>
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

export default AboutUsPage;
