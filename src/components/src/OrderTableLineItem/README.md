# OrderTableLineItem

#### Description

Displays item details for an item from a previous order. Details include the item name, image, description, and price. The component retrieves the data for a specified item with a specified order code. 

This component is used by the `OrderTableMain` component to display items in the table.

#### Usage

```js
import { OrderTableLineItem } from '@elasticpath/store-components';
```

#### Example

```js
<OrderTableLineItem key={product._item[0]._code[0].code} item={product} itemDetailLink={itemDetailLink} />
```

#### Properties

<!-- PROPS -->
