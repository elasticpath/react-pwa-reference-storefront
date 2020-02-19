# PurchaseOrderWidgetModal

#### Description

A purchase order widget that allows entry, validation, and a link to view the purchase order in more detail once verification succeeds.

The parameter `timeoutBeforeVerify` controls how long after the user stops typing to invoke the PO number validation request.

At the moment the component does not check validity of the PO number against cortex or any third party service.  It has been programmed to simluate validating numbers `1234`, `2345`, `3456`.  When placed into a real implementation parts of this code should be taken out.  Comments in the code will guide how to do that.

onPayWithPO is a callback invoked once the `Pay With PO` button is pressed.

onViewClicked is a callback invoked once the `View` button in the top right is clicked after PO number validation.


#### Usage

```js
import { PurchaseOrderWidgetModal } from '@elasticpath/store-components';
```

#### Example

```js
<PurchaseOrderWidgetModal openModal={true} createPaymentInstrumentActionUri={"/dummy/payment/action/uri"} handleCloseModal={()=>{})} />
```

#### Properties

<!-- PROPS -->
