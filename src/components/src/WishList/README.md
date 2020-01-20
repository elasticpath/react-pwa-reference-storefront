# WishListMain

#### Description

Displays the items in the wish list. The component displays the item details, the quantity selected, and a price for the selected quantity. Shoppers can change the quantity or remove the item from the cart.

When a shopper selects an item, the item opens in the `ProductDisplayItemMain` component.

When the wish list is empty, a message is displayed.

#### Usage

```js
import { WishListMain } from '@elasticpath/store-components';
```

#### Example

```js
<WishListMain
  empty={!wishListData._lineitems[0]._element}
  wishListData={wishListData}
  handleQuantityChange={() => { this.handleQuantityChange(); }}
  onItemConfiguratorAddToCart={this.handleItemConfiguratorAddToCart}
  onItemMoveToCart={this.handleItemMoveToCart}
  onItemRemove={this.handleItemRemove}
  itemDetailLink={itemDetailLink}
/>
```

#### Properties

<!-- PROPS -->
