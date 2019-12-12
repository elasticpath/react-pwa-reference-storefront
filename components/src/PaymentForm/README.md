# PaymentFormMain

#### Description

Displays a form that contains fields for entering payment details. The default fields are for credit cards.

**Note**: Works with the CyberSource accelerator. If the accelerator is not present in your Elastic Path Commerce solution, the component generates a random string as a credit card placeholder.

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
