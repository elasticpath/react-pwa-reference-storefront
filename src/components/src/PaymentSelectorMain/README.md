# PaymentSelectorMain

#### Description

Displays payment selector for all versions of Cortex payments in both the Orders and Profiles resource.  Look for example usage in the CheckoutPage.tsx and ProfilePage.tsx or in storybook stories.

#### How to use component with Cortex 7.6 Payments update
The key property to send into this component with a Cortex version greater than 7.6 is `paymentInstrumentSelector`.  It is from this property that the entire component is rendered.
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

`allowSelectionContainerHighlight` is intended to be set to true when connected to Cortex 7.6 payments update as it highlights the payments container when a credit card is selected.  In a real implementation the logic that determines the highlighting will need to revisited.

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
    allowSelectionContainerHighlight
/>
```


#### How to use component with Pre Cortex 7.6 Payments
The key property to send into this component when using a Cortex instance less than version 7.6 is `paymentMethods` and `paymentMethodInfo`.  It is from these two properties that the entire component is rendered.  `paymentMethods` pertains to the resource under the profiles resource and `paymentMethodInfo` pertains to the resource under the orders resource.

You should find this data through using these zooms:

For the paymentMethods under the profile resource.
NOTE: N/A if querying under PUBLIC user
```
defaultprofile:paymentmethods:paymenttokenform,
defaultprofile:paymentmethods,
defaultprofile:paymentmethods:element,
```

For the paymentMethodsInfo under the orders resource.

```
order:paymentmethodinfo:paymentmethod,
order:paymentmethodinfo:selector:choice,
order:paymentmethodinfo:selector:choice:description,
```

For information on the other parameters take a look at previous section `How to use component with Cortex 7.6 Payments update`.

#### Usage

```js
import { PaymentSelectorMain } from '@elasticpath/store-components';
```
#### Example

```js
<PaymentSelectorMain
    paymentMethods={profileData._paymentmethods[0]}
    onChange={this.fetchProfileData}
    disableAddPayment={false}
    shouldPostToProfile
/>
```

```js
<PaymentSelectorMain
    shouldPostToProfile={false}
    showSaveToProfileOption={showSaveToProfileOption}
    paymentMethodInfo={orderData._order[0]._paymentmethodinfo[0]}
    onChange={() => {
        this.fetchProfileData();
        this.fetchOrderData();
    }}
    disableAddPayment={false}
/>
```



#### Properties

<!-- PROPS -->
