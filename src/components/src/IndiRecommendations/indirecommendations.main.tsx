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

import React, { Component } from 'react';
import scriptjs from 'scriptjs';

const remoteScriptUrl = 'https://embed.indi.com/widgets/v1/indi-embed.js';

interface IndiRecommendationsDisplayMainProps {
  /** List of elements to display from Indi. Note: Provide the configurations to render the elements correctly. */
  render: any[],
  /** The structured object that contains the configurations required for the Indi component. */
  configuration: {
    [key: string]: any
  },
  /** A string of the keywords for the product in which the Indi component is displayed. */
  keywords?: string,
}

interface IndiRecommendationsDisplayMainState {
}

class IndiRecommendationsDisplayMain extends Component<IndiRecommendationsDisplayMainProps, IndiRecommendationsDisplayMainState> {
  static defaultProps = {
    keywords: '',
  }

  private instance;

  componentDidMount() {
    const {
      render, keywords, configuration,
    } = this.props;
    if (configuration.enable) {
      scriptjs(remoteScriptUrl, () => {
        if (render.includes('carousel')) {
          const carouselElement = document.createElement('script');
          carouselElement.type = 'text/javascript';
          carouselElement.async = true;
          carouselElement.innerHTML = `var indi_carousel = new indi.carousel("#indi-carousel-root", ${JSON.stringify(configuration.carousel)});`;
          this.instance.appendChild(carouselElement);
        }

        if (render.includes('product')) {
          configuration.productReview.keywords = keywords;
          const productReviewElement = document.createElement('script');
          productReviewElement.type = 'text/javascript';
          productReviewElement.async = true;
          productReviewElement.innerHTML = `var indi_reviews = new indi.reviews("#indi-reviews-root", ${JSON.stringify(configuration.productReview)});`;
          this.instance.appendChild(productReviewElement);
        }

        if (render.includes('brand')) {
          const brandAmbassadorElement = document.createElement('script');
          brandAmbassadorElement.type = 'text/javascript';
          brandAmbassadorElement.async = true;
          brandAmbassadorElement.innerHTML = `var indi_forum = new indi.forum("#indi-forum-root", ${JSON.stringify(configuration.brandAmbassador)});`;
          this.instance.appendChild(brandAmbassadorElement);
        }
      });
    }
  }

  render() {
    const {
      configuration,
    } = this.props;
    if (configuration.enable) {
      return (
        <div className="indi-content-component">
          <div id="indi-carousel-root" />
          <div id="indi-reviews-root" />
          <div id="indi-forum-root" />
          {/* eslint-disable-next-line no-return-assign */}
          <div ref={el => (this.instance = el)} />
        </div>
      );
    }
    return ('');
  }
}

export default IndiRecommendationsDisplayMain;
