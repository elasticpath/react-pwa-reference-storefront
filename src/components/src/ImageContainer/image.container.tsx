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
  useEffect,
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
  alt?: string,
  /** The onLoadData */
  onLoadData?: any,
}

const ImageContainer: React.FC<ImageContainerProps> = (props) => {
  const {
    imgUrl, pictureClassName, imgClassName, isSkuImage, types, sizes, fileName, alt, onLoadData,
  } = props;

  const imageSizes = sizes === undefined ? Config.ImageContainerSrcs.sizes : sizes;
  const imageTypes = types === undefined ? Config.ImageContainerSrcs.types : types;
  const imgAlt = alt != null ? alt : '';
  const imgPrefix = isSkuImage ? Config.skuImagesUrl : Config.siteImagesUrl;

  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>();
  const [imageRef, setImageRef] = useState<any>();

  useEffect(
    () => {
      let observer;
      let didCancel = false;
      if (imageRef && imageSrc !== imgUrl && imageSrc !== imgPlaceholder) {
        if (IntersectionObserver) {
          observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (
                  !didCancel
                  && (entry.intersectionRatio > 0 || entry.isIntersecting)
                ) {
                  setImageSrc(imgUrl);
                  observer.unobserve(imageRef);
                }
              });
            },
            {
              threshold: 0,
            },
          );
          observer.observe(imageRef);
        } else {
          setImageSrc(imgUrl);
        }
      }
      return () => {
        didCancel = true;
        if (observer && observer.unobserve) {
          observer.unobserve(imageRef);
        }
      };
    },
    [imgUrl, imageSrc, imageRef],
  );

  const handlePictureError = () => {
    setError(true);
  };

  const handleImgError = () => {
    if (isSkuImage) {
      setImageSrc(imgPlaceholder);
    } else {
      setImageSrc('');
    }
  };

  if (!error && fileName) {
    return (
      <picture className={pictureClassName} key={fileName}>
        { imageSrc && imageTypes.map(type => (
          <source
            key={`fileName${type}`}
            srcSet={(imageSizes === undefined || imageSizes.length === 0)
              ? `${imgPrefix.replace('%fileName%', `${type}/${fileName}.${type}`)}`
              : imageSizes.map(imageSize => `${imgPrefix.replace('%fileName%', `${type}/${fileName}-${imageSize}w.${type} ${imageSize}w`)}`).join(', ')}
            type={`image/${type}`}
          />
        ))}
        <img className={imgClassName} ref={setImageRef} alt={imgAlt} src={imageSrc} key={fileName} onLoad={onLoadData} onError={() => handlePictureError()} />
      </picture>
    );
  }

  if (imageSrc) {
    return (<img className={imgClassName} ref={setImageRef} alt={imgAlt} src={imageSrc} onLoad={onLoadData} onError={() => handleImgError()} />);
  }

  return null;
};

ImageContainer.defaultProps = {
  imgClassName: '',
  pictureClassName: '',
  isSkuImage: false,
  onLoadData: () => {},
};

export default ImageContainer;
