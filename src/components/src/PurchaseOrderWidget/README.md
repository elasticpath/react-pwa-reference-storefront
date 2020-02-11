# PurchaseOrderWidget

#### Description

A purchase order widget that allows entry and selection for payment.  Intended usage in a checkoutpage.

Pass orderPaymentData to the component so that it can save the respective PO Post url, or display an existing PO number selection in the order.  Note that the component will not appear entirely if the OOTB PO payment method is not available.

The component expects data from a GET request made to the `defaultcart` or `carts` resource with the following zoom:

```
order:paymentinstrumentselector:chosen,
order:paymentinstrumentselector:chosen:description,
order:paymentmethodinfo:element:paymentinstrumentform,
```

Take a look at stories, its mock data, and component integration in `CheckoutPage.tsx` for more details.

#### Usage

```js
import { PurchaseOrderWidget } from '@elasticpath/store-components';
```

#### Example

```js
<PurchaseOrderWidget
    orderPaymentData={orderData}
    onChange={() => {
    this.fetchProfileData();
    this.fetchOrderData();
    }}
/>
```

#### Properties

<!-- PROPS -->
