# ProfilePaymentMethodsMain

#### Description

Displays the payment methods that are defined for the profile. Credit card numbers are masked except for the last four digits. The profile owner can add and delete payment methods.

**Note**: For an organization account, the profile owner is the account administrator.

#### Usage

```js
import { ProfilePaymentMethodsMain } from '@elasticpath/store-components';
```

#### Example

```js
<ProfilePaymentMethodsMain paymentMethods={profileData._paymentmethods[0]} onChange={this.fetchProfileData} disableAddPayment={disableAddPayment} />
```

#### Properties

<!-- PROPS -->
