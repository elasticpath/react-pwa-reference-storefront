# <CartMain

#### Description

Displays main cart element comprised of CartLineItems.

#### Usage

```js
import { CartMain } from '@elasticpath/store-components';
```

#### Example

```js
<CartMain
  empty={!cartData['total-quantity'] || cartData._lineitems === undefined}
  cartData={cartData}
  handleQuantityChange={() => { this.handleQuantityChange(); }}
  onItemConfiguratorAddToCart={this.handleItemConfiguratorAddToCart}
  onItemMoveToCart={this.handleItemMoveToCart}
  onItemRemove={this.handleItemRemove}
  itemDetailLink={itemDetailLink}
/>
```

#### Properties

<!-- PROPS -->
