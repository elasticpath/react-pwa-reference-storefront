# ImageContainer

#### Description

Displays the image that dynamically fetching from external CDN of various file-types.

Initially trying to fetch primary file type received from the prop if not found try PNG, if not found try SVG, if not found try JPG, etc.


#### Usage

```js
import ImageContainer from '../ImageContainer/image.container';
```

#### Example

```js
<ImageContainer className="parallax-image" fileName={homeEspotParallax1FileName} imgUrl={homeEspotParallax1} />
```

#### Properties

<!-- PROPS -->
