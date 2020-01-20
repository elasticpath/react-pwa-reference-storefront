# CategoryItemsMain

#### Description

Displays items associated with a specified category. The items are displayed as tiles with item details such as name, image, and price. When a shopper selects an item, the item opens in the `ProductDisplayItemMain` component.

This component can include the following components:

- `SearchFacetNavigationMain` component to narrow the results within a category.
- `FeaturedProducts` component to display the **Featured** category.

#### Usage

```js
import { CategoryItemsMain } from '@elasticpath/store-components';
```

#### Example

```js
<CategoryItemsMain
  categoryProps={props}
  onProductFacetSelection={handleProductFacetSelection}
  productLinks={productLinks}
/>
```

#### Properties

<!-- PROPS -->
