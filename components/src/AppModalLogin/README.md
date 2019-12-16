# AppModalLoginMain

#### Description

Displays a **Login** dialog box where shoppers can either register for an account or sign in to an existing account. If you implement a password reset process, you can configure this component to display a **Forgot Password** link.

- When a shopper enters their user credentials and clicks **Login**, the component passes the credentials to the authentication process. If the user is authenticated, the main store page opens.
- When a shopper clicks **Register**, the component opens the `RegistrationFormMain` component.
- When a shopper clicks **Forgot Password**, the component calls your password reset process.

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
