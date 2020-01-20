# CartLineItem

#### Description

Displays an item. The component displays the item details, the quantity selected, and a price for the selected quantity. Shoppers can change the quantity or remove the item from the cart.

This component is displayed within the `CartMain` component.

When a shopper selects an item, the item details open in the `ProductDisplayItemMain` component.

When a shopper selects an item, the item details open in the `ProductDisplayItemMain` component.

#### Usage

```js
import { CartLineItem } from '@elasticpath/store-components';
```

#### Example

```js
<CartLineItem
  key={product._item[0]._code[0].code}
  item={product}
  handleQuantityChange={() => { this.handleQuantityChange(); }}
  handleErrorMessage={this.handleErrorMessage}
  onRemove={this.handleRemove}
  onConfiguratorAddToCart={this.handleConfiguratorAddToCart}
  onMoveToCart={this.handleMoveToCart}
  itemDetailLink={itemDetailLink}
/>
```

#### Properties

<!-- PROPS -->
