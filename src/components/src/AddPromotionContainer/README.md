# AddPromotionContainer

#### Description

Apply coupons or other discounts to an order.

This component adds an **Add Promotion** button to a store page. When selected, the component changes to display an **Enter Coupon Code** field, **Apply Promotion** button, and a **Cancel** button.

- When a shopper enters a code and selects **Apply Promotion**, the component invokes the `onSubmittedPromotion` process. The process verifies the code and, if the code is valid, applies the discount to the order. If the code is not valid, an error is displayed.
- When a shopper selects **Cancel**, the expanded component collapses back to a button.

#### Usage

```js
import { AddPromotionContainer } from '@elasticpath/store-components';
```

#### Example

```js
<AddPromotionContainer data={cartData} onSubmittedPromotion={() => { this.fetchCartData(); }} />
```

#### Properties

<!-- PROPS -->
