# PaymentFormMain

#### Description

Displays modal to add payment informatioon to order. Falls back to generating random string for credit card placeholder if Cybersource accelerator resource is not present.

#### Usage

```js
import { PaymentFormMain } from '@elasticpath/store-components';
```

#### Example

```js
<PaymentFormMain onCloseModal={this.handleCloseNewPaymentModal} fetchData={this.fetchOrderData} />
```

#### Properties

<!-- PROPS -->
