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

storiesOf('Components|ImageContainer', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .add('ImageContainer', () => {
    const homeEspotParallax1FileName = 'hero-banner-0.jpg';

    return (<ImageContainer className="parallax-image" fileName={homeEspotParallax1FileName} imgUrl={homeEspotParallax1} />);
  });
