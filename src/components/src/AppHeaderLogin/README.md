# AppHeaderLoginMain

#### Description

Login component for B2C and B2B components. Displays authentication actions and redirects when appropriate for login/logout flows.

#### Usage

```js
import { AppHeaderLoginMain } from '@elasticpath/store-components';
```

#### Example

```js
<AppHeaderLoginMain
  isMobileView={false}
  permission={availability}
  onLogout={redirectToMainPage}
  onLogin={redirectToMainPage}
  onResetPassword={handleResetPassword}
  onContinueCart={onContinueCart}
  locationSearchData={locationSearchData}
  appHeaderLoginLinks={appHeaderLoginLinks}
  appModalLoginLinks={appModalLoginLinks}
  isLoggedIn={isLoggedInUser}
/>
```

#### Properties

<!-- PROPS -->
