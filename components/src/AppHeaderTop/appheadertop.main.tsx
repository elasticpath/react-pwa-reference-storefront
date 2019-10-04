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
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import AppHeaderLocaleMain from '../AppHeaderLocale/appheaderlocale.main';

import './appheadertop.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface AppHeaderTopProps {
    isMobileView?: boolean,
    onCurrencyChange?: (...args: any[]) => any,
    onLocaleChange?: (...args: any[]) => any,
    appHeaderTopLinks: {
        [key: string]: any
    }
}

class AppHeaderTop extends React.Component<AppHeaderTopProps> {
  static defaultProps = {
    isMobileView: false,
    onLocaleChange: () => {},
    onCurrencyChange: () => {},
  };

  constructor(props) {
    super(props);
    ({ intl } = getConfig());
    const epConfig = getConfig();
    Config = epConfig.config;
  }

  render() {
    const {
      isMobileView,
      onCurrencyChange,
      onLocaleChange,
      appHeaderTopLinks,
    } = this.props;

    const impersonating = localStorage.getItem(`${Config.cortexApi.scope}_oAuthImpersonationToken`);
    const userName = localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserName`) || localStorage.getItem(`${Config.cortexApi.scope}_oAuthUserId`);

    return [
      <div key="AppHeaderTop" className={`top-header ${isMobileView ? 'mobile-view' : ''}`}>
        <div className={impersonating ? 'top-container-impersonation' : 'top-container'}>
          <div className="locale-container">
            <AppHeaderLocaleMain onCurrencyChange={onCurrencyChange} onLocaleChange={onLocaleChange} />
          </div>

          {
            impersonating ? (
              <div className="impersonation-notification">
                {intl.get('shopper-impersonation-message')}
                {userName}
              </div>
            ) : ''
          }

          <div className="top-container-menu">
            <ul>
              <li>
                <Link to={appHeaderTopLinks.shippingreturns}>
                  {intl.get('shipping-returns')}
                </Link>
              </li>
              <li>
                <Link to={appHeaderTopLinks.aboutus}>
                  {intl.get('help')}
                </Link>
              </li>
              <li>
                <Link to={appHeaderTopLinks.contactus}>
                  {intl.get('contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>,
    ];
  }
}

export default withRouter(AppHeaderTop);
