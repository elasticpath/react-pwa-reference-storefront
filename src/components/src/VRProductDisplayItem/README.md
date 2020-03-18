# VRProductDisplayItem

#### Description

VRProductDisplayItem is built on top of aframe and aframe-react.  Here are two links to learn more about these two libraries:

https://aframe.io/
<br>
https://www.npmjs.com/package/aframe-react

For an example of how to integrate this component into your own project checkout:

`productdisplayitem.main.tsx`

The component gives the user the ability to rotate in the vr-scene with mobile, dedicated vr devices and on desktop.  Look at the aframe website for a more exhaustive list.  
The component also allows the user to set a panorama image, a 3D mesh, and an html markup that populates a 3D plane.  

Note that the html markup that populates the plane in the 3d scene
is hidden outside of aframes `Scene` tag.  Populate markup inside the div with the classname `inner-html-texture` to customize desired information to be shown in the 3D scene.

#### Usage

```js
import { VRProductDisplayItem } from '@elasticpath/store-components';
```

#### Example

```js
<VRProductDisplayItem handleCloseVR={() => { console.log('handlecloseVR) }} backgroundUri="https://s3.amazonaws.com/referenceexp/vr/10484.jpg" />
```

#### Properties

<!-- PROPS -->
