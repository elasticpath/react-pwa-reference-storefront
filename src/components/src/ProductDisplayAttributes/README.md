# ProductDisplayAttributes

#### Description

Displays product attribute information with the ability of folding.  The component takes an array of cortex product attributes with an added key `isOpened` which dictates whether or not the component should fold the attribute text.  An example of this structure can be seen in the MockHttpREsponses folder in this component.  Also refer to `productdisplayitem.main.tsx` for a real life example of how it is used.

#### Usage

```js
import { ProductDisplayAttributes } from '@elasticpath/store-components';
```

#### Example

```js
<ProductDisplayAttributes handleDetailAttribute={this.handleDetailAttribute} detailsProductData={detailsProductData} />
```

#### Properties

<!-- PROPS -->
