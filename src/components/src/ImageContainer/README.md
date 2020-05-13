# ImageContainer

#### Description

The image container is meant to abstract the Picture html 5 element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture

When given a list of image type extensions and sizes the component will generate the necessary `<source/>` child elements under `<picture/>` for responsive

image file types and sizes.  If not specified as a prop in the component it will default to what is specified in the ep.config.json file.

Look in ref-store application for example usage.

#### Usage

```js
import ImageContainer from '../ImageContainer/image.container';
```

#### Example

```js
<ImageContainer 
    alt="banner one" 
    imgClassName="main-banner-image" 
    pictureClassName="main-banner-image" 
    fileName={bannerFileName1} 
    imgUrl={bannerImage1} 
    ImageContainerSrcs={['jp2', 'webp', 'jpg']} 
/>
```

generates:

```html
<picture class="main-banner-image">
    <source srcset="https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/jp2/b2c-banner-1-768w.jp2 768w, https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/jp2/b2c-banner-1-1092w.jp2 1092w, https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/jp2/b2c-banner-1-2800w.jp2 2800w" type="image/jp2">
    <source srcset="https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/webp/b2c-banner-1-768w.webp 768w, https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/webp/b2c-banner-1-1092w.webp 1092w, https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/webp/b2c-banner-1-2800w.webp 2800w" type="image/webp">
    <source srcset="https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/jpg/b2c-banner-1-768w.jpg 768w, https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/jpg/b2c-banner-1-1092w.jpg 1092w, https://refstoreimgs.s3-us-west-2.amazonaws.com/siteImages/jpg/b2c-banner-1-2800w.jpg 2800w" type="image/jpg">
    <img class="main-banner-image" alt="banner one" src="/static/media/b2c-banner-1.5ad237f5.png">
</picture>
```

#### Properties

<!-- PROPS -->
