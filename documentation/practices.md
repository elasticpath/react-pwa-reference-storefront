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

You can upload catalog images and site content images to WCH using the wchtools command-line utility. Uploaded assets are scanned using the Watson's Visual Recognition service, which are tagged based on the content, to create a searchable library. After uploading the images, provide the content delivery URL with the appropriate sku/file name placeholders in the Reference Storefront's configuration for both `skuImagesUrl` and `siteImagesUrl`. In the following examples, a few fields are populated based on the tenant ID of the WCH account and the directory structure of the assets:
`"skuImagesUrl": "https://my11.digitalexperience.ibm.com/<wch_tenant_identifier>/dxdam/<catalog_directory>/%sku%.jpeg",`
`"siteImagesUrl": "https://my11.digitalexperience.ibm.com/<wch_tenant_identifier>/dxdam/<site_images>/%fileName%",`

## Analytics Example

**Google Analytics Integration**

The React PWA Reference Storefront is pre-configured for integration with the Google Analytics enhanced e-commerce plugin.

### Route/Page Views
In the `App.js` file, integration handlers for Google Analytics are pre-configured to log routes as page views in a sites real-time traffic data. Configure Google Analytics for additional measurements for conversion rates based on the page views in the web traffic.
The `Analytics.js` file contains the functions used for logging page views with a React library for invoking Google Analytics functions (ReactGA), and enhanced e-commerce capabilities.

### Checkout Flow
Along with the configurations for submitting transaction information to Cortex, the storefront's check-out flow submits purchase details through Google Analytics' enhanced e-commerce capabilities where the transactions are logged.  When a customer completes a transaction, the storefront provides the transaction details for Google Analytics to analyze the logged transaction and purchase amounts and cart information in the *Conversions > Ecommerce* section.
For example, when a customer views a product, adds a product to the cart, or removes a product from the cart:
* The product and cart pages submit this information to Cortex.
* The product and cart pages submit this information for further analysis by Google Analytics’ in a separate request.

### Global Product Attribute
Google Analytics handlers use the global product attribute `Tag`. Use the formatted value of `store-name:category`, such as `vestri:Accessories`, to submit the product category information. You can set the global attribute for each product in the catalog to avoid submitting empty values for the product's category to Google Analytics.

Featured Product handlers use the global product attribute `Featured`. Use the attribute's boolean value to indicate when a product is designated a featured product. You can set the global attribute for each product in the catalog within the Commerce Manager. The React PWA Reference Storefront uses the tag to display a customizable banner for the featured product.

## ARKit Quick Look Example

**Apple ARKit Augmented Reality Quick Look Integration**

The React PWA Reference Storefront is pre-configured for integration with Apple's ARKit web integration. For iOS 12 or later versions, you can incorporate 3D objects into the real world using AR Quick Look directly through the Safari web browser when you visit a product's display page that supports the functionality. For more information on ARKit, see [Get ready for ARKit 2](https://developer.apple.com/arkit/).

ARKit USDZ files are externalized through content URLs within the storefront application configuration. The default URLs are configured to reference the USDZ files, which are located on Amazon S3. However, you can use other CMS providers as you prefer. When the image is called to the storefront, the required USDZ files are retrieved on a per-SKU basis as they are available from the CMS provider. The storefront only displays the required AR tags, if the file exists. Any SKUs without a corresponding USDZ file will not have an AR tag displayed on the product display page.

Configuration properties for content URLs are:
* `arKit.enable`: Enable elements for ARKit's Quick Look capability to load on a product display page. When `arKit.enable` is enabled, any product images that have hosted ARKit USDZ files are wrapped with an anchor tag referencing the file hosted on an external CMS.
* `arKit.skuArImagesUrl`: The path to the USDZ files hosted on an external CMS used for ARKit Quick Look. Set this parameter to the complete URL of the files by replacing the `sku/file-name` parameter with `%sku%`. This parameter is populated when the page is loaded with values retrieved by Cortex.

For any other CMS, you must update the configurations to reflect the public URLs of the files being retrieved by the particular content provider.

## Indi Brand Loyalty Example

The React PWA Reference Storefront is pre-configured for integration with Indi, with a custom component created to interact with the various widgets Indi may display. For more information on Indi, visit their official [website](https://indi.com/).

The Indi component available is a stand-alone component created solely to fetch the `indi-embed` libraries, then display the corresponding elements that were passed into the component as a structured list.

The required parameters of this component are as follows:
* `render`: A list of the elements to display from Indi. Example: `render={['carousel', 'brand', 'product']}`. Note the correct configurations must be provided for the element to render correctly.
* `configuration`: The structured object consisting of the configurations to provide to the Indi components. These are defined in `ep.config.json` in the `indi` element.
* `keywords`: A string of the keywords for the product in which the Indi component is displayed for.

Static strings for the Indi component have been localized in the Reference Storefront and are overrided on a per-usage basis for the Indi component. This will ensure the component displays the correct text in the storefront based on the locale which a customer chooses during their shopping flow.

Configuration properties for Indi component's requirements are:
* `indi.enable`: Enable the integration component for Indi. More information may be found available here [https://indi.com/](https://indi.com/).
* `indi.carousel`: Configurations for the Indi carousel component.
* `indi.carousel.apikey`: The apikey used to connect the carousel to Indi.
* `indi.carousel.id`: The apikey used to connect the carousel to Indi.
* `indi.carousel.size`: Used when theming the carousel displaying content from Indi.
* `indi.carousel.theme`: Used when theming the carousel displaying content from Indi.
* `indi.carousel.round_corners`: Used when theming the carousel displaying content from Indi.
* `indi.carousel.show_title`: Used when theming the carousel displaying content from Indi.
* `indi.carousel.show_views`: Used when theming the carousel displaying content from Indi.
* `indi.carousel.show_likes`: Used when theming the carousel displaying content from Indi.
* `indi.carousel.show_buzz`: Used when theming the carousel displaying content from Indi.
* `indi.carousel.animate`: Used when theming the carousel displaying content from Indi.
* `indi.productReview`: Configurations for the Indi product review component.
* `indi.productReview.submit_button_url`: The URL provided by Indi which directs to the action performed when the submit button is clicked on a product review.
* `indi.productReview.thumbnail_url`: The thumbnail provided by Indi for the submit button.
* `indi.brandAmbassador`: Configurations for the Indi brand ambassador component.
* `indi.brandAmbassador.submit_button_url`: The URL provided by Indi which directs to the action performed when the submit button is clicked on a brand ambassador signup.
* `indi.brandAmbassador.thumbnail_url`: The thumbnail provided by Indi for the submit button.

{% include legal.html %}
