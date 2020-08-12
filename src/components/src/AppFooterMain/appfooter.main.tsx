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
import { Link } from 'react-router-dom';
import { ReactComponent as FacebookIcon } from '../../../images/icons/ic_facebook.svg';
import { ReactComponent as InstagramIcon } from '../../../images/icons/ic_instagram.svg';
import { ReactComponent as TwitterIcon } from '../../../images/icons/ic_twitter.svg';

import './appfooter.main.scss';

interface AppFooterMainProps {
  /** footer links */
  appFooterLinks?: {
    [key: string]: any
  }
}

function AppFooterMain(props: AppFooterMainProps) {
  const { appFooterLinks } = props;
  const linkTo = appFooterLinks;

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="first-row">
        <div className="footer-column">
          <div className="content">
            {intl.get('store-description-message')}
          </div>
        </div>
        <div className="footer-column">
          <div className="title">
            {intl.get('assistance')}
          </div>
          <div className="content">
            <Link to={linkTo.aboutus}>
              {intl.get('about-us')}
            </Link>
            <Link to={linkTo.contactus}>
              {intl.get('contact')}
            </Link>
            <Link to={linkTo.shippingreturns}>
              {intl.get('shipping-returns')}
            </Link>
            <Link to={linkTo.termsandconditions}>
              {intl.get('terms-and-conditions')}
            </Link>
          </div>
        </div>
        <div className="footer-column social">
          <div className="title">
            {intl.get('find-us-online')}
          </div>
          <div className="content">
            <Link to={linkTo.shareFacebook} aria-label="share facebook">
              <FacebookIcon className="share-icon" />
              {intl.get('facebook')}
            </Link>
            <Link to={linkTo.shareTwitter} aria-label="share twitter">
              <TwitterIcon className="share-icon" />
              {intl.get('twitter')}
            </Link>
            <Link to={linkTo.shareInstagram} aria-label="share instagram">
              <InstagramIcon className="share-icon" />
              {intl.get('instagram')}
            </Link>
          </div>
        </div>
      </div>
      <div className="second-row">
        <div className="title">
          {intl.get('find-us-online')}
        </div>
        <Link to={linkTo.shareFacebook} aria-label="share facebook">
          <FacebookIcon className="share-icon" />
        </Link>
        <Link to={linkTo.shareTwitter} aria-label="share twitter">
          <TwitterIcon className="share-icon" />
        </Link>
        <Link to={linkTo.shareInstagram} aria-label="share instagram">
          <InstagramIcon className="share-icon" />
        </Link>
      </div>
    </footer>
  );
}


export default AppFooterMain;
