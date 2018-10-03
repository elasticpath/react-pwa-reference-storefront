---
layout: master
permalink: /documentation/practices/
title: Best Practices
weight: 7
---
# Examples and Best Practices

## Best Practices for Developers

* Pull from the external Git repository to contribute or use the storefront.
* Follow the guidelines in the [Contribution Guide](https://github.com/elasticpath/react-pwa-reference-storefront/blob/master/CONTRIBUTING.md) of the repository.

## Best Practices for QA

By default, Elastic Path provides automated unit tests for various integration flows of the Reference Storefront. You can run the tests directly on the development environment that is being used to implement the Reference Storefront. For configuring and executing tests, follow the instructions provided in the `Readme` file for the project.

* Create additional automated unit tests when you add new functionality.
* Run automated unit tests to ensure that no regression is introduced after customizing the project.
<br/><br/>

## Best Practices for Extending React Reference Storefront

Elastic Path recommends following the best practices listed in this section. However, Elastic Path does not recommend any specific rule for creating a page or component.

- Base the Page as the page to be visited in the shoppers flow
We base our pages as the full page a shopper will visit in the storefront.
- Design a page to have a component corresponding to each functionality in the page. The functionality for a component, including references to the child components, are are configured within the component. You can customize components with properties and parameters to perform various actions if required. For example, a shopper can navigate to a category page to view product lists. This category page can have a component to display the products within the category, and that component can have another component for each of the products in the list. The component that displays the products in a category view can be used to display products on the search results page because of the similar functionality between the workflows.

## Analytics Example

**Google Analytics Integration**

The Reference Storefront is pre-configured for integration with the Google Analytics enhanced ecommerce plugin. The handlers for integrating with Google Analytics allow for routes (pre-configured in App.js) to be logged as pageviews in the sites real-time traffic data. Further configuration in Google Analytics will enable measurements for conversion rates based on the pages viewed in the web traffic. The checkout flow is pre-configured to log purchases through Google Analytics' basic Ecommerce capabilities, and will submit transaction/purchase amounts along with cart information where it may be further analyzed in Google Analytics under Conversions > Ecommerce. The product and cart pages are configured to submit information when a product is viewed, added to cart, or removed from the cart.

`Analytics.js` contains the functions used for logging page views with ReactGA (React library for invoking Google Analytics functions), and functions for invoking the enhanced Ecommerce capabilities.

The Google Analytics handlers use the global product attribute "Tag" and expect the formatted value of store-name:category to submit category information to Google Analytics, for example, "vestri:Accessories".
If this global attribute is not set for each product in the catalog, an empty value is submitted to Google Analytics as the product's category.

## Content management for assets and Catalog Images Integration Example

The Reference Storefront is pre-configured for integration with various Content Management solutions by externalizing the content URLs through the storefront application configurations. The default URLs are configured to reference images located on Amazon S3, however other CMS providers may be used as preferred.
Configuration properties for content URLs are defined as follows:

* `skuImagesUrl`: Path to catalog images hosted on an external CMS. Set this to the full URL of your images, replacing the sku/file-name with the string `%sku%`. This value is populated during pageload with values retrieved by Cortex.
* `siteImagesUrl`: Path to site content and marketing images hosted on an external CMS. Set this to the full URL of your images, replacing the file-name and file-extension with the string `%fileName%`. This value is populated during pageload with values set in your components and use assets locally available in `./src/images/site-images` as the fallback.

If you use another CMS, you must update the configurations to reflect the public URLs of the content being retrieved by the particular content provider.

## External Content Management System Integration Example

**IBM Watson Content Hub (WCH) Integration**

IBM Watson Content Hub is a cloud-based CMS with an embedded content delivery network that lets marketers update content faster. It also provides services with IBM Watson such as cognitive tagging, to help transform assets into a searchable library of content.
Catalog images and site content images can be uploaded to WCH using the wchtools command-line utility. Uploaded assets are scanned using Watson's Visual Image recognition service, and tagged based on content to create a searchable library. After images are uploaded, the content delivery url must be provided in the reference storefront's configuration for both the skuImagesUrl and siteImagesUrl with the appropriate sku/file-name placeholders. For example, certain fields in the following examples are populated based on the tenant ID of the WCH account being used, and the directory structure of the assets uploaded.
`"skuImagesUrl": "https://my11.digitalexperience.ibm.com/<wch_tenant_identifier>/dxdam/<catalog_directory>/%sku%.jpeg",`
`"siteImagesUrl": "https://my11.digitalexperience.ibm.com/<wch_tenant_identifier>/dxdam/<site_images>/%fileName%",`

{% include legal.html %}
