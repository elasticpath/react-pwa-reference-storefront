# AppHeaderLoginMain

#### Description

Adds a **Login** link in the header. When selected, the link opens the `AppModalLoginMain` component, which displays a **Login** dialog box.

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
