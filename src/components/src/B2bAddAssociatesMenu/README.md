# B2bAddAssociatesMenu

#### Description

Displays a drop-down menu with import options. An account administrator can add a list of associates to an account by creating a list and importing the list into the store.

- When an administrator selects **Download Associate Template**, the component downloads a spreadsheet with the required layout for the associate information.
- When an administrator selects **Upload List**, the component uploads the selected spreadsheet and creates the associates in the account.

Use this component with the Accounts view.

#### Usage

```js
import { B2bAddAssociatesMenu } from '@elasticpath/store-components';
```

#### Example

```js
<B2bAddAssociatesMenu
  onSpreeadsheetClicked={() => this.handleSpreeadsheetClicked()}
  onTemplateClicked={() => this.handleTemplateClicked()}
/>
```

#### Properties

<!-- PROPS -->
