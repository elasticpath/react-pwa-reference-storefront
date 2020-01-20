# BulkOrder

#### Description

Displays a window that contains the **Quick Order** and **Bulk Order** panes. Shoppers can create a list of item numbers and quantities, and then add all the items to the cart.

The **Quick Order** pane includes a set of `QuickOrderForm` components. Optionally, include a barcode scanner, by adding the `BarcodeScanner` component.

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
