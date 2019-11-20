# B2bEditAssociate

#### Description

Modal to edit associate for Buyer Admin view. Used to select roles, set name, etc.

#### Usage

```js
import { B2bEditAssociate } from '@elasticpath/store-components';
```

#### Example

```js
<B2bEditAssociate
  handleClose={this.isEditAssociateClose}
  handleUpdate={this.handleAccountSettingsUpdate}
  accountName={mainAccountName}
  subAccountName={accountName}
  rolesSelector={selector}
  isSelf={associateEditEmail === userEmail}
  associateEmail={associateEditEmail}
  isOpen={isEditAssociateOpen}
  isAddAssociateOpen={isAddAssociateOpen}
  addAssociateUri={addAssociateUri}
/>
```

#### Properties

<!-- PROPS -->
