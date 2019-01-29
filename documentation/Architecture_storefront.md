---
redirect_to: "https://documentation.elasticpath.com/storefront-react/index.html"
layout: master
permalink: /documentation/architecture/
title: Architecture
weight: 3
---
# Platform Architecture
The React PWA Reference Storefront is composed of layers that work together to provide various capabilities to operate the storefront. The following diagram shows the storefront architecture:

![Reference Store Architecture]({{ site.baseurl }}/documentation/img/Ref_Store_Architecture.png)
<br/>

* Presentation Layer: Provides the user interface management capabilities using a modern UI framework. The configuration files in this layer are:
    * `index.html` - The front-end html document that is populated by the React pages and components.
    * `App.js` - The javascript file that contains the import instructions for the React components and the subsequent layers. When this script is run, all subsequent components are loaded on the page.
    * `index.js` - The javascript file that contains the import instructions for the required frameworks, such as bootstrap, React, and renders the `App.js` file. This file also registers the PWA service worker.
    * CSS - The file that consists of the custom stylesheets and static page assets for the storefront front-end presentation.
* Route/Page Layer: Routes browser requests to the subsequent pages. This layer consists of:
    *  `routes.js` - The javascript file that contains routes and mappings to the `.jsx` React pages.
    *  Pages - The top-level pages that loads the required components for each page.
    *  Service worker - A service worker created using Workbox to manage caching and PWA capabilities.
* Component Layer: Provides the components to be loaded within each page. The components are created depending on the functionality of the item that the pages interact with or loads. For example, the component layer provides the login component for the home page.
* Web Server Layer: Enables the interaction between the application and the service layer.
* API Layer: The application layer of React PWA Reference Storefront is built on [Cortex API](https://developers.elasticpath.com/commerce/7.3/Cortex-API-Front-End-Development/Getting-Started/Introduction). Through the Cortex API, the storefront get to use the e-commerce capabilities provided by Elastic Path Commerce. PWA interacts with the required services through this layer.

## Cortex Integration
The storefront invokes Cortex APIs to ensure that the best practices of consuming hypermedia APIs are followed.

![Cortex]({{ site.baseurl }}/documentation/img/cortex-page-diagram.png)

By modifying the following files, you can customize the API calls that make the REST HTTP request:
* The `Cortex.js` file contains the methods and classes that fetch data for the API calls made to Cortex. You can customize this file with additional headers or generic request modifications in the `cortexFetch()` function for custom implementations. This file also includes `x-headers` and the ability to add any additional headers.
* The `AuthService.js` contains the authentication functions used to authenticate users with Cortex using OAuth2. The OAuth tokens are saved in the local storage of the web application. For authenticating subsequent Cortex requests, the tokens are retrieved and added into the header.

You can create zoom queries by populating an array with all required queries and appending it to the request to Cortex. When you create a zoom query, request only the additional data needed by the component using the query. Elastic Path recommends to avoid requesting unnecessary data, and circular zooms for better performance.

### Workflow
1. The top-level root for the REST call is retrieved from Cortex. This URL consists of related links that provides URLs to the children of the root.
2. After retrieving the root level, subsequent actions are performed against Cortex on the children of the root, depending on the action intended to be performed by the React Component initiating the REST request.
    *Note*: For the subsequent calls, the storefront must call only the URL that Cortex returns when you call the root. You must not create custom URL in the storefront component settings to ensure that any change in the API names do not change the URL. Use the rels in Cortex response to make subsequent calls. However, for the OAuth implementation, you might want to create a URL in the storefront.
