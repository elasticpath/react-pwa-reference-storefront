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
    <footer className="app-footer page-footer font-small blue">
      <div id="footer_container" className="container-fluid text-center text-md-center footer-container">
        <div className="row">
          <div id="footer_container_column_1" className="col-7 col-md-4 col-lg-6 text-xs-center text-sm-center text-md-left text-lg-left">
            <div className="footer-column">
              <h5 className="text-uppercase store-description-title">
                {intl.get('vestri')}
              </h5>
              <p className="store-description">
                {intl.get('store-description-message')}
              </p>
            </div>
          </div>
          <hr className="clearfix d-md-none pb-3" />
          <div id="footer_container_column_2" className="col-5 col-md-4 col-lg-3 text-left">
            <div className="footer-column">
              <h5 className="text-uppercase">
                {intl.get('assistance')}
              </h5>
              <ul className="list-unstyled assistance-list">
                <li className="assistance-item">
                  <Link to="/aboutus" id="footer_assistance_about_us_link">
                    <span className="assistance-text">
                      {intl.get('about-us')}
                    </span>
                  </Link>
                </li>
                <li className="assistance-item">
                  <Link to="/contactus" id="footer_assistance_contact_us_link">
                    <span className="assistance-text">
                      {intl.get('contact')}
                    </span>
                  </Link>
                </li>
                <li className="assistance-item">
                  <Link to="/termsandconditions" id="footer_assistance_terms_and_conditions_link">
                    <span className="assistance-text">
                      {intl.get('terms-and-conditions')}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div id="footer_container_column_3" className="col-12 col-md-4 col-lg-3 text-left">
            <div className="footer-column">
              <h5 className="text-uppercase social-title">
                {intl.get('find-us-online')}
              </h5>
              <ul className="list-unstyled social-list">
                <li className="social-item">
                  <Link to="/" id="footer_social_facebook_link">
                    <span className="share-icon-facebook" />
                    <span className="social-text">
                      {intl.get('facebook')}
                    </span>
                  </Link>
                </li>
                <li className="social-item">
                  <Link to="/" id="footer_social_twitter_link">
                    <span className="share-icon-twitter" />
                    <span className="social-text">
                      {intl.get('twitter')}
                    </span>
                  </Link>
                </li>
                <li className="social-item">
                  <Link to="/" id="footer_social_instagram_link">
                    <span className="share-icon-instagram" />
                    <span className="social-text">
                      {intl.get('instagram')}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooterMain;
