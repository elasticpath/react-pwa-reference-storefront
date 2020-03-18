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
import intl from 'react-intl-universal';

function SupportPage() {
  return (
    <div className="viewport ui-container static-ui-container" data-region="viewPortRegion">
      <div>
        <div className="app-main static-contant-container" data-region="appMain">
          <div>
            <div className="static-container container">
              <div className="static-container-inner">
                <div className="static-title-container">
                  <div>
                    <h1 className="view-title">
                      {intl.get('support')}
                    </h1>
                  </div>
                </div>
                <div className="static-main-container">
                  <div className="static-container">
                    <span className="static-message">
                      {intl.get('support-content')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
