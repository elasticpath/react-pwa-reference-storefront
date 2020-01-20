# PurchaseDetailsMain

#### Description

Displays details about a specified purchase, including a purchase summary, addresses, and price.

Optionally, this component can include the `ReorderMain` component, which adds a **Reorder** button to the Purchase Details view. When selected, a **Buy It Again** modal window opens with the list of items from the purchase and another **Reorder** button. When a shopper selects this **Reorder** button, all the items in the list are added to the cart.

#### Usage

```js
import { PurchaseDetailsMain } from '@elasticpath/store-components';
```

#### Example

```js
<PurchaseDetailsMain data={purchaseData} itemDetailLink={itemDetailLink} onMoveToCart={this.moveToCart} onConfiguratorAddToCart={this.moveToCart} onReorderAllProducts={this.moveToCart} />
```

#### Properties

<!-- PROPS -->
