# VRProductDisplayItem

#### Description

VRProductDisplayItem is built on top of aframe and aframe-react.  Here are two links to learn more about these two libraries:

https://aframe.io/
<br>
https://www.npmjs.com/package/aframe-react

For an example of how to integrate this component into your own project checkout:

`productdisplayitem.main.tsx`

The component gives the user the ability to rotate in the vr-scene with mobile devices, dedicated vr devices and on desktop.  The aframe website linked above will have a more exhaustive list of compatible devices.  The component also allows the user to set a panorama image, a 3D mesh, and an html markup that populates a 3D plane.  

To change what 3D Mesh the component should show input a url into the property `meshUri` (Can be either .gltf or .glb format).  Likewise to change the panorama image in the scene input a url into `backgroundUri`.  Note that the html markup that populates the plane in the 3d scene
is hidden outside of aframes `Scene` tag.  To make changes to the html markup that populates the 3D plane, adjust `VRPanelContent.tsx` and `VRPanelContent.less`.

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
