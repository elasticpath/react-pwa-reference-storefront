# CartCheckoutButton

#### Description

A simple button component that accepts a handler for when the button is pressed and data to discern what text to display for the button.  

The button will display `Proceed to Checkout` by default.  It will display `Transfer Cart` if a redirect url is detected in Cortex's cart response (This will be used during procurement / punchout system integrations).

Take a look at `CartPage.tsx` for more information on how to use the component

#### Usage

```js
import CartCheckoutButton from '../components/src/CartCheckoutButton/cart.checkout.btn';
```

#### Example

```js
<CartCheckoutButton cartData={cartData} checkoutCallback={() => { this.checkout(); }} />
```

#### Properties

<!-- PROPS -->
