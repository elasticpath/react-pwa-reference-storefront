# <CartMain

#### Description

A container for cart items. The `CartMain` component contains a `CartLineItem` component for each item added to a cart. If there are no items in a cart, the component displays a message that the cart is empty.

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
