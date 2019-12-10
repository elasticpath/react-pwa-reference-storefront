# CartCreate

#### Description

Displays a **Manage Carts** modal window.

Shoppers can initiate the following actions:
- Create a cart.
- Review the list of existing carts, including how many items are in the cart.
- Update a cart name.
- Delete a cart.
- Open a cart.
 

**Note**: Requires that the multiple carts feature is enabled in your Elastic Path Commerce solution. 

#### Usage

```js
import { CartCreate } from '@elasticpath/store-components';
```

#### Example

```js
<CartCreate handleModalClose={this.handleModalClose} openModal={openModal} handleCartsUpdate={() => { this.fetchCartData(); }} handleCartElementSelect={this.handleCartElementSelect} updateCartModal={updateCartModal} />
```

#### Properties

<!-- PROPS -->
