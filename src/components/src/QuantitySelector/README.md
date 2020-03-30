# QuantitySelector

#### Description

Functional Quantity Selector component that can be repurposed for a situation that requires adding or subtracting items. The containing component will need to hold the state of `itemQuantity` and `isLoading` and define the callback handlers`handleQuantityDecrement`, `handleQuantityIncrement`, and `handleQuantityChange` that will mutate said state.  Currently used in the reference store on the `productdisplayitem.details.tsx` component for adding and subtracting items to be added to cart.  Take a look in this component for example usage.



#### Usage

```js
import { QuantitySelector } from '@elasticpath/store-components';
```

#### Example

```js
<QuantitySelector
    handleQuantityDecrement={this.handleQuantityDecrement}
    handleQuantityIncrement={this.handleQuantityIncrement}
    handleQuantityChange={this.handleQuantityChange}
    isLoading={isLoading}
    itemQuantity={itemQuantity}
/>
```

#### Properties

<!-- PROPS -->
