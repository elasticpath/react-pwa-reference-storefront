---
layout: master
permalink: /documentation/practices/
title: Best Practices
weight: 4
---

## Project Structure
TBA
<br/><br/>

## Developer Best Practices
* The development lifecycle is expected to be as follows in the diagram below:

* Developers who want to contribute or use the reference storefront will both pull from the external Git repo
* Developers will be required to follow the guidelines set in the Contribution guide of the repo
<br/><br/>

## QA Best Practices
Automated Unit Tests are provided for various integration flows of the Reference Storefront. The tests may be invoked directly on the same development environment being used to implement the Reference Storefront and can be configured/executed by following the instructions provided in the project's README.

The Reference Storefront uses Selenium as the UI Automation framework for testing the UI components through various shopping flows supported, and are built with Cucumber to keep simplicity of execution a priority.

* Developers expected to create additional AUT for new functionality they introduce
* Developers expected to run AUT to ensure no regression introduced after performing any changes to project
<br/><br/>

## Cortex Integration
The Reference Storefront invokes Cortex APIs by means to ensure the best practices of consuming hypermedia APIs are followed.

For your convenience, the fetch call invoking the REST HTTP request has been wrapped to allow for modifications/customizations to the basic fetch being performed.

The top-level root is always invoked first to retrieve the top most APIs that can be invoked. Upon retrieving the root level, subsequent actions are performed against Cortex on children of the root depending on the action intended to be performed by the REACT Component initiating the REST request. It's important to note that REST requests should be made to URLs returned by Cortex, and not constructed by the UI itself (with the exception of the oauth authentication services). This is to ensure the UI remains unconstrained to URIs and does not regress in the case of any API naming updates in the future. Since there is a possibility of URL nouns and verbs changing in future releases, it's important to note that consumption of a URL directly through Cortex' response should be avoided and instead rels should be retrieved from Cortex' response.

Cortex.js contains the wrapper for fetch requests made to Cortex. You may include additional headers or generic request modifications in the cortexFetch() function if you choose so as part of your implementation. This includes, x-headers, and the ability to add additional headers.

AuthService.js contains the authentication functions used to authenticate a user/shopper with Cortex using oauth2. OAuth tokens are then saved to the web application's local storage where they can be retrieved and injected into the header for authenticating subsequent Cortex requests.

Zoom queries can be constructed in the simple manner of populating an array with all required queries and appending it to the request to Cortex. The basic construct for creating zoom queries is to only request the additional data needed by the component consuming it. Avoid requesting data which is not required, and avoid circular zooms as these may have impacts to performance.
<br/><br/>

## Analytics
The Reference Storefront is pre-configured for integration with the Google Analytics enhanced ecommerce plugin. The handlers for integrating with Google Analytics allow for routes (pre-configured in App.js) to be logged as pageviews in the sites real-time traffic data. Further configuration in Google Analytics will enable measurements for conversion rates based on the pages viewed in the web traffic. The checkout flow is pre-configured to log purchases through Google Analytics' basic Ecommerce capabilities, and will submit transaction/purchase amounts along with cart information where it may be further analyzed in Google Analytics under Conversions > Ecommerce. The product and cart pages are configured to submit information when a product is viewed, added to cart, or removed from the cart.

Analytics.js contains the functions used for logging pageviews with ReactGA (React library for invoking Google Analytics functions), and functions for invoking the enhanced Ecommerce capabilities.

The Google Analytics handlers use the global product attribute "Tag" and expect the formatted value of store-name:category to submit category information to Google Analytics.
ex. "vestri:Accessories"
If this global attribute is not set for each product in the catalog, an empty value is submitted to Google Analytics as the product's category.
<br/><br/>

## Content management for assets and Catalog Images
The Reference Storefront is pre-configured for integration with various Content Management solutions by externalizing the content URLs through the storefront application configurations. The default URLs are configured to reference images located on Amazon S3, however other CMS providers may be used as preferred.
Configuration properties for content URLs are defined as follows:

* `skuImagesUrl`: Path to catalog images hosted on an external CMS. Set this to the full URL of your images, replacing the sku/file-name with the string `%sku%`. This value will be populated during pageload with values retrieved by Cortex.
* `siteImagesUrl`: Path to site content and marketing images hosted on an external CMS. Set this to the full URL of your images, replacing the file-name and file-extension with the string `%fileName%`. This value will be populated during pageload with values set in your components and use assets locally available in `./src/images/site-images` as the fallback.

If usage of another CMS is required, the configurations must simply be updated to reflect the public URLs of the content being retrieved by the particular content provider.

**Example: Integration with IBM Watson Content Hub (WCH) as an external Content Management System.**<br/>
IBM Watson Content Hub is a cloud-based CMS with an embedded content delivery network that lets marketers update content faster, and provides services with IBM Watson such as cognitive tagging to help transform assets into a searchable library of content.
Catalog images and site content images may be uploaded to WCH using the wchtools command-line utility. Uploaded assets will be scanned using Watson's Visual Image recognition service, and tagged based on content to create a searchable library. Once images have been uploaded, the content delivery url must be provided in the reference storefront's configuration for both the skuImagesUrl and siteImagesUrl with the appropriate sku/file-name placeholders.
ex. Certain fields below will be populated based on the tenant ID of the WCH account being used, and the directory structure of the assets uploaded.
`"skuImagesUrl": "https://my11.digitalexperience.ibm.com/<wch_tenant_identifier>/dxdam/<catalog_directory>/%sku%.jpeg",`
`"siteImagesUrl": "https://my11.digitalexperience.ibm.com/<wch_tenant_identifier>/dxdam/<site_images>/%fileName%",`
<br/><br/>

**References:**<br/>
Watson Content Hub login to digital experience dashboard: [http://digitalexperience.ibm.com/](http://digitalexperience.ibm.com/)
wchtools github repository: [https://github.com/ibm-wch/wchtools-cli](https://github.com/ibm-wch/wchtools-cli)

{% include legal.html %}
