# CategoryItemsMain

#### Description

Displays items associated with a specified category. The items are displayed as tiles with item details such as name, image, and price. This component includes a facet selector to narrow the results within a category.

This component can include the `FeaturedProducts` component.

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
