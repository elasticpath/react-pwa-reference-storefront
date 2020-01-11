# CartLineItem

#### Description

Displays cart line item with interactable elements given all item information.

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
