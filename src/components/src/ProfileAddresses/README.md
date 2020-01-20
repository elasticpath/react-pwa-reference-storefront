# ProfileAddressesMain

#### Description

Displays the addresses for a specified profile. The profile owner can add, edit, and delete addresses.

**Note**: For an organization account, the profile owner is the account administrator.

#### Usage

```js
import { ProfileAddressesMain } from '@elasticpath/store-components';
```

#### Example

```js
<ProfileAddressesMain addresses={profileData._addresses[0]} onChange={this.fetchProfileData} onAddNewAddress={this.handleNewAddress} onEditAddress={this.handleEditAddress} />
```

#### Properties

<!-- PROPS -->
