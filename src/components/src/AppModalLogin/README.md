# AppModalLoginMain

#### Description

Modal to perform login action. Invokes registration page upon button click. Will present password reset option if resource available.

#### Usage

```js
import { AppModalLoginMain } from '@elasticpath/store-components';
```

#### Example

```js
<AppModalLoginMain
  key="app-modal-login-main"
  handleModalClose={this.handleModalClose}
  openModal={openModal}
  onLogin={onLogin}
  onResetPassword={onResetPassword}
  locationSearchData={locationSearchData}
  appModalLoginLinks={appModalLoginLinks}
  showForgotPasswordLink={showForgotPasswordLink}
  disableLogin={disableLogin}
/>
```

#### Properties

<!-- PROPS -->
