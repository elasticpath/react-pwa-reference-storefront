# AddressFormMain

#### Description

Display an address form with some required fields. You can add multiple `AddressFormMain` components to track different types addresses, such as billing address and shipping address.

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
