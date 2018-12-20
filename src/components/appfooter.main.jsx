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

import './appfooter.main.less';

function AppFooterMain() {
  return (
    <footer className="app-footer">
      <div className="first-row">
        <div className="footer-column">
          <div className="title">
            {intl.get('vestri')}
          </div>
          <div className="content">
            {intl.get('store-description-message')}
          </div>
        </div>
        <div className="footer-column">
          <div className="title">
            {intl.get('assistance')}
          </div>
          <div className="content">
            <Link to="/aboutus">
              {intl.get('about-us')}
            </Link>
            <Link to="/contactus">
              {intl.get('contact')}
            </Link>
            <Link to="/shippingreturns">
              {intl.get('shipping-returns')}
            </Link>
            <Link to="/termsandconditions">
              {intl.get('terms-and-conditions')}
            </Link>
          </div>
        </div>
        <div className="footer-column social">
          <div className="title">
            {intl.get('find-us-online')}
          </div>
          <div className="content">
            <Link to="/" aria-label="share facebook">
              <span className="share-icon facebook" />
              {intl.get('facebook')}
            </Link>
            <Link to="/" aria-label="share twitter">
              <span className="share-icon twitter" />
              {intl.get('twitter')}
            </Link>
            <Link to="/" alt="share instagram">
              <span className="share-icon instagram" />
              {intl.get('instagram')}
            </Link>
          </div>
        </div>
      </div>
      <div className="second-row">
        <div className="title">
          {intl.get('find-us-online')}
        </div>
        <Link to="/" aria-label="share facebook">
          <span className="share-icon facebook" />
        </Link>
        <Link to="/" aria-label="share twitter">
          <span className="share-icon twitter" />
        </Link>
        <Link to="/" aria-label="share instagram">
          <span className="share-icon instagram" />
        </Link>
      </div>
    </footer>
  );
}

export default AppFooterMain;
