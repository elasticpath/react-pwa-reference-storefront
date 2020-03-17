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
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import imgPlaceholder from '../../../images/img_missing_horizontal@2x.png';

let Config: IEpConfig | any = {};

interface ImageContainerProps {
  /** name of file */
  fileName: string;
  /** image URL */
  imgUrl: string;
  /** class name */
  className?: string;
  /** is a sku image */
  isSkuImage?: boolean;
  /** loading data */
  onLoadData?: (...args: any[]) => any;
}

function ImageContainer(props: ImageContainerProps) {
  const epConfig = getConfig();
  Config = epConfig.config;
  const {
    fileName, imgUrl, className, isSkuImage, onLoadData,
  } = props;

  const imageSource = isSkuImage ? Config.skuImagesUrl.replace('%sku%', fileName) : Config.siteImagesUrl.replace('%fileName%', fileName);

  const handleError = (e, defaultImgUrl) => {
    const { src } = e.target;
    if (Config.imageFileTypes && Config.imageFileTypes.enable && e.target['data-source'] !== 'default') {
      const fallbackTypes = Config.imageFileTypes.types;
      const initType = imgUrl.replace(/.*(?=\.)/g, '');
      const types = (fallbackTypes && fallbackTypes.length > 0) ? [
        initType,
        ...fallbackTypes.filter(fileType => fileType !== initType),
      ] : [];
      const currentType = src.replace(/.*(?=\.)/g, '');
      const i = types.indexOf(currentType);
      if (types[i + 1]) {
        e.target.src = src.replace(currentType, types[i + 1]);
      } else {
        e.target.src = isSkuImage ? imgPlaceholder : defaultImgUrl;
        e.target['data-source'] = 'default';
      }
    } else if (e.target['data-source'] !== 'default') {
      e.target.src = isSkuImage ? imgPlaceholder : defaultImgUrl;
      e.target['data-source'] = 'default';
    }
  };

  return (
    <img
      className={className}
      alt=""
      src={imageSource}
      onError={e => handleError(e, imgUrl)}
      onLoad={onLoadData}
    />
  );
}

ImageContainer.defaultProps = {
  className: '',
  isSkuImage: false,
  onLoadData: () => {},
};

export default ImageContainer;
