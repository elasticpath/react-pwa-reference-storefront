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
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppHeaderLocaleMain from './appheaderlocale.main';

import './appheadertop.main.less';
import { getConfig } from '../utils/ConfigProvider';

let intl = { get: str => str };

class AppHeaderTop extends React.Component {
  static propTypes = {
    isMobileView: PropTypes.bool,
    onCurrencyChange: PropTypes.func,
    onLocaleChange: PropTypes.func,
    appHeaderTopLinks: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  static defaultProps = {
    isMobileView: false,
    onLocaleChange: () => {},
    onCurrencyChange: () => {},
  };

  constructor(props) {
    super(props);
    ({ intl } = getConfig());
  }

  render() {
    const {
      isMobileView,
      onCurrencyChange,
      onLocaleChange,
      appHeaderTopLinks,
    } = this.props;

    return [
      <div key="AppHeaderTop" className={`top-header ${isMobileView ? 'mobile-view' : ''}`}>
        <div className="top-container">
          <div className="locale-container">
            <AppHeaderLocaleMain onCurrencyChange={onCurrencyChange} onLocaleChange={onLocaleChange} />
          </div>

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
