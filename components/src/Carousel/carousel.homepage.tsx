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
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import carouselBaner1 from '../images/carousel-images/baner_1.jpg';
import carouselBaner2 from '../images/carousel-images/baner_2.jpg';
import carouselBaner3 from '../images/carousel-images/baner_3.jpg';
import carouselBaner4 from '../images/carousel-images/baner_4.jpg';

import './carousel.homepage.less';

const carouselBanerArray = [carouselBaner1, carouselBaner2, carouselBaner3, carouselBaner4];

let Config: IEpConfig | any = {};
let intl = { get: str => str };

const carouselBaner1FileName = 'baner_1.jpg';
const carouselBaner2FileName = 'baner_2.jpg';
const carouselBaner3FileName = 'baner_3.jpg';
const carouselBaner4FileName = 'baner_4.jpg';

const carouselBanerNameArray = [carouselBaner1FileName, carouselBaner2FileName, carouselBaner3FileName, carouselBaner4FileName];

interface CarouselProps {
    carouselLink?: string,
}

const Carousel: React.FunctionComponent<CarouselProps> = (props) => {
  const { carouselLink } = props;
  const epConfig = getConfig();
  Config = epConfig.config;
  ({ intl } = epConfig);

  const settings = {
    customPaging(i) {
      return (
        <div className="">
          <img alt="img" src={Config.siteImagesUrl.replace('%fileName%', carouselBanerNameArray[i])} onError={(e) => { const element: any = e.target; element.src = carouselBanerArray[i]; }} />
        </div>
      );
    },
    dots: true,
    dotsClass: 'slick-dots slick-thumb',
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="carousel">
      <div className="carousel-txt">
        <h2>
          {intl.get('home-carousel-txt1')}
          <strong>
            {' '}
            {intl.get('home-carousel-txt2')}
          </strong>
          <br />
          {intl.get('home-carousel-txt3')}
        </h2>
        <Link to={carouselLink} className="ep-btn">
          {intl.get('home-carousel-btn')}
        </Link>
      </div>
      <Slider {...settings}>
        <div>
          <img
            alt="img"
            src={Config.siteImagesUrl.replace('%fileName%', carouselBaner1FileName)}
            onError={(e) => {
              const element: any = e.target;
              element.src = carouselBaner1;
            }}
          />
        </div>
        <div>
          <img
            alt="img"
            src={Config.siteImagesUrl.replace('%fileName%', carouselBaner2FileName)}
            onError={(e) => {
              const element: any = e.target;
              element.src = carouselBaner2;
            }}
          />
        </div>
        <div>
          <img
            alt="img"
            src={Config.siteImagesUrl.replace('%fileName%', carouselBaner3FileName)}
            onError={(e) => {
              const element: any = e.target;
              element.src = carouselBaner3;
            }}
          />
        </div>
        <div>
          <img
            alt="img"
            src={Config.siteImagesUrl.replace('%fileName%', carouselBaner4FileName)}
            onError={(e) => {
              const element: any = e.target;
              element.src = carouselBaner4;
            }}
          />
        </div>
      </Slider>
    </div>
  );
};

Carousel.defaultProps = {
  carouselLink: '',
};

export default Carousel;
