# CartLineItem

#### Description

Displays an item. The component retrieves the item details, which might include an image, name, description, and availability. The component displays the item details, the quantity selected, and a price for the selected quantity. Shoppers can change the quantity or remove the item from the cart.

This component is displayed within the [`CartMain`](../CartMain/README.md) component.

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
