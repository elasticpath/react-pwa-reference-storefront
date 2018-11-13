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
import './MaintenancePage.less';

import doge from '../images/site-images/HikingDog.png';

const Config = require('Config');

const dogeFileName = 'HikingDog.png';

function MaintenancePage() {
  return (
    <div className="viewport ui-container static-ui-container" data-region="viewPortRegion" style={{ display: 'block' }}>
      <div>
        <div className="app-main static-contant-container" data-region="appMain" style={{ display: 'block' }}>
          <div>
            <div className="static-container container">
              <div className="static-container-inner">
                <div className="static-title-container" style={{ display: 'block' }}>
                  <div>
                    <h1 className="view-title-maintenance view-title">
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
                    <img alt="dog-espot-1" className="dog-espot-1" src={Config.siteImagesUrl.replace('%fileName%', dogeFileName)} onError={(e) => { e.target.src = doge; }} />
                  </div>
                  <h2 className="static-dog-name">
                    {intl.get('name-moki')}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;
