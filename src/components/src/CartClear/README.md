# CartClear

#### Description

Adds a **Remove all cart items** icon beside each of the carts in a list of carts. When a shopper clicks the icon beside a cart, the component calls a process that removes all items from that cart.

**Note**: Requires that the multiple carts feature is enabled in your Elastic Path Commerce solution.


#### Usage

```js
import { CartClear } from '@elasticpath/store-components';
```

#### Example

```js
<CartClear cartData={cartData} handleCartsUpdate={() => { this.fetchCartData(); }} handleCartModalUpdate={() => { this.handleCartModalUpdate(); }} />
```

#### Properties

<!-- PROPS -->
