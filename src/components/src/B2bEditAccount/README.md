# B2bEditAccount

#### Description

Displays an **Edit Account** dialog box where account administrators can edit the details of an account or sub-account.

Use this component with the Accounts view.

#### Usage

```js
import { B2bEditAccount } from '@elasticpath/store-components';
```

#### Example

```js
<B2bEditAccount
  handleClose={this.handleAccountSettingsClose}
  handleUpdate={this.handleAccountSettingsUpdate}
  isOpen={isSettingsDialogOpen}
  accountData={editAccountData}
  editSubAccountUri={editSubAccountUri}
  editMetadataUri={editMetadataUri}
/>
```

#### Properties

<!-- PROPS -->
