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

import React, {
  useState,
} from 'react';
import Config from '../../../ep.config.json';
import imgPlaceholder from '../../../images/img_missing_horizontal@2x.png';
import './image.container.scss';

interface ImageContainerProps {
  /** prefix name of the file in s3 with this form ${fileName}-${size}.${type} */
  fileName?: string;
  /** image URL that will be used as a fallback if no types are supported or sent into the parameter */
  imgUrl: string;
  /** picture element class name */
  pictureClassName?: string;
  /** img element class name */
  imgClassName?: string;
  /** is a sku image, determines whether to use `skuImagesUrl` or `siteImagesUrl` in ep.config.json as url prefix in srcSet */
  isSkuImage?: boolean;
  /** Types to use for srcSet */
  types?: string[];
  /** width breakpoints to serve different images */
  sizes?: string[];
  /** alt to be passed to img element */
  alt: string,
  /** The onLoadData */
  onLoadData?: any,
}

function ImageContainer(props: ImageContainerProps) {
  const {
    imgUrl, pictureClassName, imgClassName, isSkuImage, types, sizes, fileName, alt, onLoadData,
  } = props;

  const imageSizes = sizes === undefined ? Config.ImageContainerSrcs.sizes : sizes;
  const imageTypes = types === undefined ? Config.ImageContainerSrcs.types : types;
  let imgPrefix = '';

  if (isSkuImage) {
    imgPrefix = Config.skuImagesUrl;
  } else {
    imgPrefix = Config.siteImagesUrl;
  }

  const [error, setError] = useState(false);

  const handleError = (e, defaultImgUrl) => {
    e.currentTarget.src = isSkuImage ? imgPlaceholder : defaultImgUrl;
    setError(true);
  };

  const generateSrcSet = type => imageSizes.reduce((acc, imageSize) => {
    if (acc === '') {
      return `${acc}${imgPrefix.replace('%fileName%', `${type}/${fileName}-${imageSize}w.${type} ${imageSize}w`)}`;
    }
    return `${acc}, ${imgPrefix.replace('%fileName%', `${type}/${fileName}-${imageSize}w.${type} ${imageSize}w`)}`;
  }, '');

  if (!error) {
    return (
      <picture className={pictureClassName} key={fileName}>
        {imageTypes.map(type => <source onError={e => handleError(e, imgUrl)} key={`fileName${type}`} srcSet={generateSrcSet(type)} type={`image/${type}`} />)}
        <img className={imgClassName} alt="" src={imgUrl} key={fileName} onLoad={onLoadData} onError={e => handleError(e, imgUrl)} />
      </picture>
    );
  }

  return (<img className={imgClassName} alt="" src={imgUrl} onLoad={onLoadData} onError={e => handleError(e, imgUrl)} />);
}

ImageContainer.defaultProps = {
  imgClassName: '',
  pictureClassName: '',
  isSkuImage: false,
  ImageContainerSrcs: [],
  onLoadData: () => {},
};

export default ImageContainer;
