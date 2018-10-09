---
layout: master
permalink: /documentation/practices/
title: Best Practices
weight: 7
---
# Examples and Best Practices 

## Best Practices for Contributing Code
For an optimal experience, developers must follow these guidelines:
1. Pull the code from the external Git repository. 
2. Follow the guidelines outlined in the [Contribution Guide](https://github.com/elasticpath/react-pwa-reference-storefront/blob/master/.github/CONTRIBUTING.md) of the repository.

## Best Practices for Testing
By default, Elastic Path provides automated unit tests for various integration flows of the React PWA Reference Storefront. You can run the tests directly on the development environment that is being used to implement the Reference Storefront. For configuring and executing tests,follow the instructions provided in the `Readme` file for the project.

When you create unit tests:
* Create additional automated unit tests when you add new functionality.
* Run automated unit tests to ensure that no regression is introduced after customizing the project.
<br/><br/>

## Best Practices for Extending React Reference Storefront
Elastic Path recommends following the best practices listed in this section. However, Elastic Path does not recommend any specific rule for creating a page or component.

* Base the storefront page as the actual page your shoppers visit in the storefront. 
* Design a page to have a component corresponding to each functionality in the page. The functionality for a component, including references to the child components, are are configured within the component. You can customize components with properties and parameters to perform various actions, if required. <br>
For example, a shopper can navigate to a category page to view product lists. This category page can have a component to display the products within the category, and that component can have another component for each of the products in the list. The component that displays the products in a category view can be used to display products on the search results page because of the similar functionality between the workflows.

## Content Management for Assets and Catalog Images Integration Example
The React PWA Reference Storefront is pre-configured for integration with various Content Management solutions by externalizing the content URLs through the storefront application configurations. The default URLs are configured to reference images, which are located on Amazon S3. However, you may use other CMS providers as you prefer.

Configuration properties for content URLs are defined as follows:
* `skuImagesUrl`: Path to catalog images hosted on an external CMS. Set this to the complete URL of your images, replacing the sku/file-name with the string `%sku%`. This value is populated when the page is loaded with the values retrieved by Cortex.
* `siteImagesUrl`: Path to site content and marketing images hosted on an external CMS. Set this to the complete URL of your images, replacing the file name and file extension with the string `%fileName%`. This value is populated when the page is loaded with the values retrieved by your components. If there is an issue with retrieving the values, the value is populated with assets locally available in `./src/images/site-images`.

If you use another CMS, you must update the configurations to reflect the public URLs of the content being retrieved by the particular content provider.

## External Content Management System Integration Example

**IBM Watson Content Hub (WCH) Integration**

IBM Watson Content Hub is a cloud-based CMS. It also provides services with IBM Watson, such as cognitive tagging, to help transform assets into a searchable library of content.

You can upload catalog images and site content images to WCH using the wchtools command-line utility. Uploaded assets are scanned using Watson's Visual Image recognition service, and tagged based on the content to create a searchable library. After the images are uploaded, the content delivery URL must be provided in the Reference Storefront's configuration for both `skuImagesUrl` and `siteImagesUrl`, with the appropriate sku/file name placeholders. In the following examples, a few fields are populated based on the tenant ID of the WCH account and the directory structure of the assets: 
`"skuImagesUrl": "https://my11.digitalexperience.ibm.com/<wch_tenant_identifier>/dxdam/<catalog_directory>/%sku%.jpeg",`
`"siteImagesUrl": "https://my11.digitalexperience.ibm.com/<wch_tenant_identifier>/dxdam/<site_images>/%fileName%",`

## Analytics Example

**Google Analytics Integration**

The React PWA Reference Storefront is pre-configured for integration with the Google Analytics enhanced e-commerce plugin. 

### Route/Page Views
In the `App.js` file, integration handlers for Google Analytics are pre-configured to log routes as pageviews in a sites real-time traffic data. Configure Google Analytics for additional measurements for conversion rates based on the page views in the web traffic. 
The `Analytics.js` file contains the functions used for logging page views with a React library for invoking Google Analytics functions (ReactGA), and enhanced e-commerce capabilities.

### Checkout Flow
Along with the configurations for submitting transaction information to Cortex, the storefront's check-out flow submits purchase details through Google Analytics' enhanced e-commerce capabilities where the transactions are logged.  When a customer completes a transaction, the storefront provides the transaction details for Google Analytics to analyze the logged transaction and purchase amounts and cart information in the *Conversions > Ecommerce* section.
For example, when a customer views a product, adds a product to the cart, or removes a product from the cart:
* The product and cart pages submit this information to Cortex.
* The product and cart pages submit this information for further analysis by Google Analytics’ in a separate request.

### Global Product Attribute
Google Analytics handlers use the global product attribute `Tag`. Use the formatted value of `store-name:category`, such as `vestri:Accessories` to submit the product category information. You can set the global attribute for each product in the catalog to avoid submitting empty values for the product's category to Google Analytics. 

{% include legal.html %}
