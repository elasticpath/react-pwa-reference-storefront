# ImageContainer

#### Description

Loading of images that are in the frame and tracking the scrolling of the page if a new image appears and loads it.

Configurable variable "threshold" A number or an array of numbers indicating the percentage of visibility of the target element that callback should trigger. For example, the callback function will be called when each 25% of the target element appears in the visibility zone: [0, 0.25, 0.5, 0.75, 1]

#### Usage

```js
import LazyImage from './lazy.image.container';
```

#### Example

```js
<LazyImage
  className={imgClassName}
  alt={imgAlt}
  src={fallbackImgUrl}
  onLoad={() => { handleLoadData(); }}
  onError={() => { handleImgError(); }}
/>
```

#### Properties

<!-- PROPS -->
