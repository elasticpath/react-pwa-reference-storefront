# BulkOrder

#### Description

Displays a window that contains the quick order and  bulk order panes. Shoppers can create a list of item numbers and quantities, and then add all the items to the cart.

**Tip**: You can add the `QuickOrder` components to the same window. You can also add a button to launch the `BarcodeScanner` component.

#### Usage

```js
import { BulkOrder } from '@elasticpath/store-components';
```

#### Example

```js
<BulkOrderMain isBulkModalOpened={isBulkModalOpened} handleClose={this.handleBulkModalClose} cartData={cartData} />
```

#### Properties

<!-- PROPS -->