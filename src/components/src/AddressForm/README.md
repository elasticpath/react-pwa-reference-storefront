# AddressFormMain

#### Description

Displays a form with the fields for entering an address. You can label the address to suit your needs, such as billing address and shipping address. You can add multiple `AddressFormMain` components to a page.

If an address exists for the shopper, the component retrieves the address and displays it in the form. Otherwise, the fields are blank.

#### Usage

```js
import { AddressFormMain } from '@elasticpath/store-components';
```

#### Example

```js
<AddressFormMain onCloseModal={this.handleCloseAddressModal} fetchData={this.fetchOrderData} addressData={addressUrl} />
```

#### Properties

<!-- PROPS -->
