# PaymentFormMain

#### Description

Displays a form that contains fields for entering payment details. The default fields are for credit cards. For this Storybook example, a token is randomly generated and passed to the demo payment gateway to populate the form field.

**Important**: In a production environment, no credit information is passed to Cortex through this component. 

In your storefront, the `PaymentFormMain` component must receive a token from a payment gateway. Ensure that process of sending and receiving the token complies with the Payment Card Industry Data Security Standard (PCI DSS).

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
