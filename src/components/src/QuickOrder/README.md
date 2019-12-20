# QuickOrderMain

#### Description

Displays a **Buy it again** button, which adds the items from the last quick order to the cart. Use this button with the `QuickOrderForm` component.

#### Usage

```js
import { QuickOrderMain } from '@elasticpath/store-components';
```

#### Example

```js
<QuickOrderMain isBuyItAgain productData={purchaseItem._item[0]} itemDetailLink={itemDetailLink} onMoveToCart={onMoveToCart} onConfiguratorAddToCart={onConfiguratorAddToCart} />
```

#### Properties

<!-- PROPS -->
