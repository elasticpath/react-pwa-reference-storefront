# AppHeaderNavigationMain

#### Description

Adds catalog navigation links in the header. Some navigation items open a submenu of child navigation items. The structure of the navigation is built from the catalog navigation hierarchy. The component supports unlimited nested levels.

#### Usage

```js
import { AppHeaderNavigationMain } from '@elasticpath/store-components';
```

#### Example

```js
<AppHeaderNavigationMain
  isOfflineCheck={this.handleIsOffline}
  isOffline={isOffline}
  isMobileView={false}
  onFetchNavigationError={redirectToMainPage}
  checkedLocation={checkedLocation}
  appHeaderNavigationLinks={appHeaderNavigationLinks}
/>
```

#### Properties

<!-- PROPS -->
