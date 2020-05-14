# ImageContainer

#### Description

The image container is meant to abstract the Picture html 5 element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture

When given a filename and a list of image type extensions and sizes the component will generate the necessary `<source>` and `<img>` elements necessary for the `<picture>` element.  Depending if you set `isSkuImage` to either true or false the src prefix's will be either `Config.siteImagesUrl` or `Config.skuImagesUrl`.  If types and sizes are not specified as a prop in the component it will default to what is specified in `Config.ImageContainerSrcs.types` and `Config.ImageContainerSrcs.sizes`.  

Example of the ImageContainer configs here:  

```
 "ImageContainerSrcs": {
    "types": ["webp", "jp2", "jpg"],
    "sizes": ["768", "1092", "2800"]
  }
```

and of ImageContainer source prefix configs here:

```
"skuImagesUrl": "https://ep-demo-assets.s3-us-west-2.amazonaws.com/BELLEVIE/skuImages/%fileName%",
"siteImagesUrl": "https://ep-demo-assets.s3-us-west-2.amazonaws.com/BELLEVIE/siteImages/%fileName%",
```

If the component cannot find a valid source through the generated `<picture>` element it will fallback and show the source that is specified in the `imgUrl` parameter.  If even that source is invalid, the component will show its own 'image not found' fallback image when `isSkuImage` is set to true, else nothing will show.

Look in ref-store application and stories for more example usage.

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
