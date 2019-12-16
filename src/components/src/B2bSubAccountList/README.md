# B2bSubAccountList

#### Description

Displays a list of sub-accounts for the specified account. The list information includes the sub-account name and whether the sub-account is enabled. When an account administrator selects the sub-account, the component retrieves data about the sub-account.

Use this component with the Accounts view.

#### Usage

```js
import { B2bSubAccountList } from '@elasticpath/store-components';
```

#### Example

```js
<B2bSubAccountList getAccountData={this.handleAccount} subAccounts={accountListData.subAccounts} accountName={accountName} registrationNumber={registrationNumber} />
```

#### Properties

<!-- PROPS -->
