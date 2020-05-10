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
import Config from '../../../ep.config.json';

import imgPlaceholder from '../../../images/img_missing_horizontal@2x.png';

interface ImageContainerProps {
  /** name of file */
  fileName?: string;
  /** image URL that exists in the project */
  fallbackImgUrl?: string;
  /** class name */
  pictureClassName?: string;
  /** img Classname */
  imgClassName?: string;
  /** is a sku image */
  isSkuImage?: boolean;
  /** loading data */
  imageFileTypes?: string[];
  /** sizes of the files. */
  sizes?: string[];
}

function ImageContainer(props: ImageContainerProps) {
  const {
    fallbackImgUrl, pictureClassName, imgClassName, isSkuImage, imageFileTypes, sizes, fileName,
  } = props;

  const imageSizes = sizes === undefined ? Config.imageFileTypes.sizes : sizes;

  let imgPrefix = '';
  if (isSkuImage) {
    imgPrefix = Config.skuImagesUrl;
  } else {
    imgPrefix = Config.siteImagesUrl;
  }

  const generateSrcSet = type => imageSizes.reduce((acc, imageSize) => {
    console.log('inside the img prefix');
    console.log(imgPrefix);
    if (acc === '') {
      return `${acc}${imgPrefix.replace('%fileName%', `${type}/${fileName}-${imageSize}w.${type} ${imageSize}w`)}`;
    }
    return `${acc}, ${imgPrefix.replace('%fileName%', `${type}/${fileName}-${imageSize}w.${type} ${imageSize}w`)}`;
  }, '');

  return (
    <picture className={pictureClassName}>
      {imageFileTypes.map(type => <source srcSet={generateSrcSet(type)} type={`image/${type}`} />)}
      <img className={imgClassName} alt="animage" src={fallbackImgUrl} />
    </picture>
  );
}

ImageContainer.defaultProps = {
  className: '',
  isSkuImage: false,
  onLoadData: () => {},
};

export default ImageContainer;
