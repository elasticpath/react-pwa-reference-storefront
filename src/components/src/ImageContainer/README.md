# ImageContainer

#### Description

Initially trying to fetch primary file type received from the prop if not found try PNG, if not found try JPG, if not found try SVG etc.

The configuration of these file types may be managed within `ep.config.json`. If no file types are provided in the configuration, the image will be used as is provided in the URL.

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
