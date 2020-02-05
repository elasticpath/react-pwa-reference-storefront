# B2bAddProductsModal

#### Description

Displays a window that contains the **Quick Order** and **Bulk Order** panes. Shoppers can create a list of item numbers and quantities, and then add all the items to the requisition list.

The **Quick Order** pane includes a set of `QuickOrderForm` components.

#### Usage

```js
import { B2bAddProductsModal } from '@elasticpath/store-components';
```

#### Example

```js
<B2bAddProductsModal
  isBulkModalOpened={isBulkModalOpened}
  handleClose={() => { textToFunc(handleClose); }}
  addItemsToItemListUri={addItemsToItemListUri}
  onAddItem={() => { textToFunc(onAddItem); }}
/>
```

#### Properties

<!-- PROPS -->
