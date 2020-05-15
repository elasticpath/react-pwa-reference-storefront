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
import { storiesOf } from '@storybook/react';
import Readme from './README.md';
import ImageContainer from './image.container';
import homeEspotParallax1 from '../../../images/site-images/hero-banner-0.jpg';
import bannerImage3 from '../../../images/site-images/b2c-banner-3.png';

storiesOf('Components|ImageContainer', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .add('Failure to find matching srcSet in Picture element - fallback to imgUrl', () => {
    const homeEspotParallax1FileName = 'hero-banner-0.jpg';
    return (<ImageContainer
      imgClassName="parallax-image"
      fileName={homeEspotParallax1FileName}
      imgUrl={homeEspotParallax1}
    />);
  })
  .add('Use configs for sizing and typing', () => (
    <ImageContainer
      imgClassName="main-banner-image"
      isSkuImage
      pictureClassName="main-banner-image"
      fileName="KIDS_SS_HANLEY"
      imgUrl={bannerImage3}
    />))
  .add('Override sizing breakpoint and different possible types for image', () => (
    <ImageContainer
      imgClassName="main-banner-image"
      pictureClassName="main-banner-image"
      isSkuImage
      sizes={['1092', '2800']}
      types={['jp2', 'webp']}
      fileName="KIDS_SS_HANLEY"
      imgUrl={bannerImage3}
    />
  ))
  .add('Component showing its own fallback image when it cannot find the fallback img specified', () => {
    const bannerFileName3 = 'b2c-banner-3';
    return (<ImageContainer
      imgClassName="main-banner-image"
      isSkuImage // THIS MUST BE TRUE!
      pictureClassName="main-banner-image"
      fileName={bannerFileName3}
      imgUrl="https://invalidsrc.com"
    />);
  })
  .add('Component not showing any fallback', () => (<ImageContainer
    imgClassName="main-banner-image"
    isSkuImage={false} // THIS MUST BE TRUE!
    pictureClassName="main-banner-image"
    fileName="invalidfilename"
    imgUrl="https://invalidsrc.com"
  />));
