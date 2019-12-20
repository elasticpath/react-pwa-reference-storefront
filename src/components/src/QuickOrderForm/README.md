# QuickOrderForm

#### Description

Adds form fields for a product item number and quantity, and displays a price for the specified product and quantity. 

Use this component to populate the **Quick Order** pane in the `BulkOrder` component. You can add as many `QuickOrderForm` components as you need.

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
