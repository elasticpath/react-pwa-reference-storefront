# PaymentFormMain

#### Description

Displays a credit card form.

If **defaultPostSelection** is set to true then the component will automatically post and add to the Registered user profiles **paymentinstrumentform**.  Passing this property to true is appropriate when consuming this component on a users profile page where the form is always used to save payment information a users profile.  If **defaultPostSelection** is not passed or set to false then the component will post to the current users **paymentinstrumentform** under the **orders** resource.  Setting false to **defaultPostSelection** is most appropriate when using this component in a checkout flow.

The checkbox labelled **Save This Payment Method To My Profile** will be available when setting **showSaveToProfileOption** to true and is also recommended to be set to true when consumed in a checkout flow.  It gives the user an option to save the payment information to the profile resource.

**Important**: In a production environment, no credit information is passed to Cortex through this component.

In your storefront, the `PaymentFormMain` component must receive a token from a payment gateway. Ensure that process of sending and receiving the token complies with the Payment Card Industry Data Security Standard (PCI DSS).

Since this is a template component it is hardcoded to take the first **paymentinstrumentform** available in **paymentinstruments** resource.  When posting, arbitrary tokenized data is set to the respective **paymentinstrumentform** fields.  It is up to the implementor to make changes to how the component tokenizes data as this varies from solution to solution.  Comments in the code will guide as to which portions should be removed and filled.

#### Usage

```js
import { PaymentFormMain } from '@elasticpath/store-components';
```

#### Example

```js
<PaymentFormMain defaultPostSelection onCloseModal={this.handleCloseNewPaymentModal} fetchData={this.fetchOrderData} showSaveToProfileOption/>
```

#### Properties

<!-- PROPS -->
