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

import './indirecommendations.main.less';

class IndiRecommendationsDisplayMain extends React.Component {
  componentDidMount() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    /* eslint-disable-next-line no-multi-str */
    s.innerHTML = 'var indi_carousel = new indi.carousel("#indi-carousel-root", {\
      apikey: "EERIxwXF644c1E1To5puL8xNP5PvLHSv240PyNYf",\
      id: "5b2c577c-1cef-4b18-a49e-fc924783351c",\
      size: "large",\
      theme: "light",\
      round_corners: false,\
      show_title: false,\
      show_views: false,\
      show_likes: false,\
      show_buzz: false,\
      animate: true\
    });';
    this.instance.appendChild(s);

    const i = document.createElement('script');
    i.type = 'text/javascript';
    i.async = true;
    /* eslint-disable-next-line no-multi-str */
    i.innerHTML = 'var indi_forum = new indi.forum("#indi-forum-root", {\
      title: "Share Your Review",\
      description: "Upload your photo or video about this product",\
      submit_button_text: "UPLOAD PHOTO/VIDEO",\
      submit_button_url: "https://indi.com/Submit/ForumTerms?id=e26b530c-319c-4e81-8444-5e7c27acd39a",\
      thumbnail_url: "https://indi-upload-us-west-1.s3.amazonaws.com/Image/1e1eee8842d4002382882bc7590445a4.jpg",\
      keywords: "{{ product.handle }}"\
    });';
    this.instance.appendChild(i);
  }

  render() {
    return (
      <div className="product-recomentations-component" data-region="categoryBrowseRegion" key="categoryBrowseRegion">
        <div id="indi-carousel-root" />
        <div id="indi-forum-root" />
        {/* eslint-disable-next-line no-return-assign */}
        <div ref={el => (this.instance = el)} />
      </div>
    );
  }
}

export default withRouter(IndiRecommendationsDisplayMain);
