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

let Config: IEpConfig | any = {};


interface ImageContainerProps {
  /** name of file */
  fileName: string;
  /** image URL */
  imgUrl: string;
  /** class name */
  className?: string;
}

function ImageContainer(props: ImageContainerProps) {
  const { fileName, imgUrl, className } = props;

  const epConfig = getConfig();
  Config = epConfig.config;

  const handleError = (e, defaultImgUrl) => {
    const { src } = e.target;
    const types = ['.png', '.svg', '.jpg', '.tif'];
    const currentType = src.replace(/.*(?=\.)/g, '');
    const i = types.indexOf(currentType);
    if (types[i + 1]) {
      e.target.src = src.replace(currentType, types[i + 1]);
    } else {
      e.target.src = defaultImgUrl;
    }
  };
  return (
    <img className={className} alt="img" src={Config.siteImagesUrl.replace('%fileName%', fileName)} onError={e => handleError(e, imgUrl)} />
  );
}

ImageContainer.defaultProps = {
  className: '',
};

export default ImageContainer;
