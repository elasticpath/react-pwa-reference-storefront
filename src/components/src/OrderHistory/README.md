# OrderHistoryMain

#### Description

Displays a history of purchases in a table format. The component retrieves the purchases from the shopper profile data. 

The component uses the `OrderLine` component to populate the table rows.

#### Usage

```js
import { OrderHistoryMain } from '@elasticpath/store-components';
```

#### Example

```js
<OrderHistoryMain purchaseHistory={profileData._purchases[0]} />
```

#### Properties

<!-- PROPS -->
