# PaymentSelectorMain

#### Description

Displays payment selector for all versions of Cortex payments in both the Orders and Profiles resource.  Look for example usage in the CheckoutPage.tsx and ProfilePage.tsx or in storybook stories.

#### How to use component with Cortex 7.6 Payments update
The key property to send into this component is `paymentInstrumentSelector`.  It is from this property that the entire component is rendered.
You should find this data through using these zooms:

For the paymentinstrumentselector under the orders resource.

```
order:paymentinstrumentselector,
order:paymentinstrumentselector:choice,
order:paymentinstrumentselector:choice:description,
order:paymentinstrumentselector:chosen,
order:paymentinstrumentselector:chosen:description,
```

For the paymentinstrumentselector under the profiles resource.
NOTE: N/A if querying under PUBLIC user
```
defaultprofile:paymentinstruments:defaultinstrumentselector,
defaultprofile:paymentinstruments:defaultinstrumentselector:chosen,
defaultprofile:paymentinstruments:defaultinstrumentselector:chosen:description,
defaultprofile:paymentinstruments:defaultinstrumentselector:choice,
defaultprofile:paymentinstruments:defaultinstrumentselector:choice:description,
```

`shouldPostToProfile` as well as `showSaveToProfileOption` are props surfaced up from the `paymentform.main.tsx` component.  Refer to that `PaymentForm/README.md` for more information.

`onChange` is a calledback that is called when either the a delete button, a radio button or `paymentform.main.tsx` component is submitted.  It is designed for the parent to make another request to Cortex and update its state and the state of its child, `PaymentSelectorMain`.

`disableAddPayment` simply disables the add new payment button.

#### Usage

```js
import { PaymentSelectorMain } from '@elasticpath/store-components';
```
#### Example

```js

<PaymentSelectorMain
            shouldPostToProfile={false}
            showSaveToProfileOption={showSaveToProfileOption}
            paymentInstrumentSelector={orderData._order[0]._paymentinstrumentselector[0]}
            onChange={() => {
              this.fetchProfileData();
              this.fetchOrderData();
            }}
            disableAddPayment={false}
          />
```


##### How to use component with Pre Cortex 7.6 Payments






#### Properties

<!-- PROPS -->
