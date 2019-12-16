# QuickOrderForm

#### Description

Displays form fields for a product item number and quantity, and displays a price for the specified product and quantity. You can use this component to populate a quick order form.

#### Usage

```js
import { QuickOrderForm } from '@elasticpath/store-components';
```

#### Example

```js
<QuickOrderForm item={item} key={item.key} onItemSubmit={updatedItem => this.quickFormSubmit(updatedItem, i)} />
```

#### Properties

<!-- PROPS -->
