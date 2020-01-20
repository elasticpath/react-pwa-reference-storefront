# B2bEditAssociate

#### Description

Displays an **Add Associate** dialog box. Account administrators add associates by specifying their email address and roles.

Use this component with the Accounts view.

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
