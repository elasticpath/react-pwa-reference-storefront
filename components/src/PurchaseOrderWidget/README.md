# AddPromotionContainer

#### Description

A purchase order widget that allows entry, validation, and a link to view the purchase order in more detail.

The parameter `timeoutBeforeVerify` controls how long after the user stops typing to invoke the PO number validation request.

At the moment the component does not check validity of the PO number against cortex or any third party service.  It has been programmed to simluate validating numbers `1234`, `2345`, `3456`.  When placed into a real implementation parts of this code should be taken out.  Comments in the code will guide how to do that.


#### Usage

```js
import { PurchaseOrderWidget } from '@elasticpath/store-components';
```

#### Example

```js
<PurchaseOrderWidget />
```

#### Properties

<!-- PROPS -->
