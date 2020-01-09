# PaymentFormMain

#### Description

Displays a credit card form.  

If **defaultPostSelection** is set to true then the component will automatically post and add to the Registered user profiles **paymentinstrumentform**.  The **Save To Profile** option will be hidden as the option for the form to save to profile is hardcoded through passing the **defaultPostSelection** prop.  Passing this prop is appropriate on a users profile page where the form is always used to save payment information to their profile.

If **defaultPostSelection** is not passed or set to false then the component will post to the current logged in users **paymentinstrumentform** under the **orders** resource.  The option to **Save To Profile** will be available if the current logged in user is **REGISTERED** and once checked by the user the form will post to **paymentinstrumentform** under the **profile** resource.  Setting false to **defaultPostSelection** is most appropriate when using this component in a checkout flow when adding payment information to the users order must be available and saving that information to the profile is an option.

Since this is a template component it is hardcoded to take the first **paymentinstrumentform** available in **paymentinstruments** resource.  When posting arbitrary tokenized data is set to the respective **paymentinstrumentform** fields.  It is up to the implementor to make changes to how the component tokenizes data as this varies from solution to solution.

#### Usage

```js
import { PaymentFormMain } from '@elasticpath/store-components';
```

#### Example

```js
<PaymentFormMain defaultPostSelection onCloseModal={this.handleCloseNewPaymentModal} fetchData={this.fetchOrderData} />
```

#### Properties

<!-- PROPS -->
