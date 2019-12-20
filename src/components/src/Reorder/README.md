# ReorderMain

#### Description

Displays a **Reorder** button in the Purchase Details view. 

Use this component with the `PurchaseDetailsMain` component.

When selected, a **Buy It Again** modal window opens with the list of items from the purchase and another **Reorder** button. When a shopper selects this **Reorder** button, all the items in the list are added to the cart.

#### Usage

```js
import { ReorderMain } from '@elasticpath/store-components';
```

#### Example

```js
<ReorderMain productsData={data} onReorderAll={handleReorderAll} itemDetailLink={itemDetailLink} />
```

#### Properties

<!-- PROPS -->
