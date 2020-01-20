# AppModalBundleConfigurationMain

#### Description

Displays a modal window that contains a set of related items, called a bundle. A shopper can add items from the bundle to a cart by clicking the **Add to cart** button.

The items in the bundle are displayed with item details such as name, image, and availability. When a shopper selects an item, the item opens in the `ProductDisplayItemMain` component.

#### Usage

```js
import { AppModalBundleConfigurationMain } from '@elasticpath/store-components';
```

#### Example

```js
<AppModalBundleConfigurationMain key={`app-modal-bundle-configuration-main_${itemCodeString}`} handleModalClose={this.handleModalClose} bundleConfigurationItems={item} openModal={openModal} itemDetailLink={itemDetailLink} onItemConfiguratorAddToCart={onConfiguratorAddToCart} onItemRemove={onRemove} />
```

#### Properties

<!-- PROPS -->
