# WishListMain

#### Description

Displays wish list given with list data. Makes use of other components.

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
