# B2bAccountList

#### Description

Displays a list of accounts by name, and indicates whether an account is enabled. If an account has sub-accounts defined, the sub-accounts are displayed in a hierarchy below the parent account.

- When an administrator selects an account or sub-account, the component retrieves data about the account or sub-account.
- When an administrator selects the **Add Sub Account** button, the `B2bAddSubAccount` component launches.

Use this component with the Accounts view.

#### Usage

```js
import { B2bAccountList } from '@elasticpath/store-components';
```

#### Example

```js
<B2bAccountList
  getAccountData={this.getAccountData}
  accountListData={accountListData}
  getSubAccountData={this.subAccountData}
  handleAddSubAccountClicked={this.handleAddSubAccountClicked}
  accountName={accountName}
  registrationNumber={registrationNumber}
/>
```

#### Properties

<!-- PROPS -->
