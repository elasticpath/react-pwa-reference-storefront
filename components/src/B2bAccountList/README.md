# B2bAccountList

#### Description

Displays a list of accounts along with the status of the account. If an account has sub-accounts defined, the sub-accounts are also displayed in a hierarchy within the parent account. 

**Note**: This component is intended for account administrators.

- When an administrator selects an account or sub-account, the component retrieves data about the account or sub-account.
- When an administrator selects the **Add Sub Account** button, the [`B2bAddSubAccount`](../B2bAddSubAccount/README.md) component launches.

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
