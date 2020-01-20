# CartCreate

#### Description

Displays a **Manage Carts** modal window that contains a list of existing carts and how many items are in each cart.

Shoppers can initiate the following actions:

- Create a cart. The component prompts for a name, calls the process to create the cart, and retrieves and displays the updated list of carts.
- Rename a cart. The component prompts for a name, calls the process to save the change, and retrieves and displays the updated list of carts.
- Delete a cart. The component calls the process to delete the cart, and then retrieves and displays the updated list of carts. A deleted cart cannot be restored.
- Open a cart. The component retrieves the cart data and displays the cart items in the [`CartMain`](../CartMain/README.md) component.
 
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
