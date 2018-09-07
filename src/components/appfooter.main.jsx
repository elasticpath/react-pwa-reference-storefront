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
    <footer className="app-footer page-footer font-small blue pt-4 mt-4">
      <div id="footer_container" className="container-fluid text-center text-md-center">
        <div className="row">
          <div id="footer_container_column_1" className="col-xs-12 col-sm-12 col-md-4 col-lg-4 text-xs-center text-sm-center text-md-left text-lg-left">
            <div className="footer-column">
              <h5 className="text-uppercase">
                {intl.get('vestri')}
              </h5>
              <p>
                {intl.get('store-description-message')}
              </p>
            </div>
          </div>
          <hr className="clearfix d-md-none pb-3" />
          <div id="footer_container_column_2" className="col-xs-6 col-sm-6 col-md-4 col-lg-4 text-left">
            <div className="footer-column">
              <h5 className="text-uppercase">
                {intl.get('assistance')}
              </h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/aboutus" id="footer_assistance_about_us_link">
                    {intl.get('about-us')}
                  </Link>
                </li>
                <li>
                  <Link to="/contactus" id="footer_assistance_contact_us_link">
                    {intl.get('contact')}
                  </Link>
                </li>
                <li>
                  <Link to="/termsandconditions" id="footer_assistance_terms_and_conditions_link">
                    {intl.get('terms-and-conditions')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div id="footer_container_column_3" className="col-xs-6 col-sm-6 col-md-4 col-lg-4 text-left">
            <div className="footer-column">
              <h5 className="text-uppercase">
                {intl.get('find-us-online')}
              </h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/" id="footer_social_facebook_link">
                    <span className="share-icon-facebook" />
                    {intl.get('facebook')}
                  </Link>
                </li>
                <li>
                  <Link to="/" id="footer_social_twitter_link">
                    <span className="share-icon-twitter" />
                    {intl.get('twitter')}
                  </Link>
                </li>
                <li>
                  <Link to="/" id="footer_social_instagram_link">
                    <span className="share-icon-instagram" />
                    {intl.get('instagram')}
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
