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
import './appheadertop.main.less';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import AppHeaderLocaleMain from './appheaderlocale.main';

class AppHeaderTop extends React.Component {
  static propTypes = {
    isMobileView: PropTypes.bool.isRequired,
  }


  render() {
    const { isMobileView } = this.props;

    return [
      <div className={`top-header ${isMobileView ? 'mobile-view' : ''}`}>
        <div className="top-container">
          <div className="locale-container">
            <AppHeaderLocaleMain />
          </div>

          <div className="top-container-menu">
            <ul>
              <li>
                <Link to="/">
                Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/">
                Help
                </Link>
              </li>
              <li>
                <Link to="/contactus">
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
