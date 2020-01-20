# B2bAddSubAccount

#### Description

Displays an **Add Sub Account** dialog box. An account administrator can add a sub-account to the account. Use sub-accounts to enable groups within an organization to manage and track their orders, such as departments, divisions, or global offices.

Use this component with the Accounts view.

#### Usage

```js
import { B2bAddSubAccount } from '@elasticpath/store-components';
```

#### Example

```js
<B2bAddSubAccount
  handleClose={this.handleAddSubAccountClose}
  handleUpdate={this.handleAccountSettingsUpdate}
  isOpen={isAddSubAccountOpen}
  addSubAccountUri={addSubAccountUri}
  addSubAccountSellerAdmin={addSubAccountSellerAdmin}
/>
```

#### Properties

<!-- PROPS -->
