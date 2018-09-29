---
layout: master
permalink: /documentation/overview/
title: Overview
weight: 2
---
# REACT Reference Storefront

### Contents
- [Overview](/documentation/Overview.md#Overview)
- [Technical Architecture](/documentation/Overview.md#platform_architecture)


## Overview

The REACT PWA Reference Storefront is a flexible e-commerce website built on Elastic Path’s [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) e-commerce API,  [Cortex API](https://developers.elasticpath.com/commerce/7.3/Cortex-API-Front-End-Development/Getting-Started/Introduction).Through Cortex API, the storefront get to use the ecommerce capabilities provided Elastic Path Commerce and get data in a RESTful manner.

React Reference Storefront is divided into containers(Pages) and React components. Each page in the storefront is composed of various components that fulfills the purpose of the page. For example, home, cart, categories, checkout, and registration are separate Pages. Each page consists of various components, such as navigation, footer, product List, or products.

The Storefront is designed as an open source Mobile Progressive Web Application (PWA) that has the capabilities for local browser storage page caching and persistent session management. This PWA is built using the ['React.js'](https://reactjs.org/), [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/), and [Babel](https://babeljs.io/) technologies. [Webpack](https://webpack.js.org/) and [node.js](https://nodejs.org/en/) enables the application layer interactions through configurable web server.

With theming, you can change the presentation of the React Reference Storefront without modifying the JavaScript. React Reference Storefront uses the dynamic stylesheet language, [less](http://lesscss.org/), to changes the themes. You can change the look and feel of the storefront by modifying the corresponding `{less}` files.

Each theme is a set of `{less}` files, which can be compiled into a `style.css` file. The `{less}` files for each theme are organized in the same order as the storefront is presented.
For example, `CartPage.less` contains the CSS for the cart’s container page, and  `cart.main.less` contains the CSS for the main component in the cart page.

### Features

In React Reference Storefront, e-commerce functionality, such as cart, authentication, profile, or search, and the website presentation are separated. The front-end developers need not change JavaScript to update the CSS files to change the presentation and the JavaScript developers can develop functionality without changing front-end. Each customization layer is separated into it's own layer from the core code into it's own layer, so developers need not change the Storefront’s utility engine.

You can access the React Reference Storefront on various devices, such as tablets, mobile phones, or computers.

![Feature Guide]({{ site.baseurl }}/documentation/img/featureSupport.png)
<br/><br/>


## Platform Architecture

![Reference Store Architecture]({{ site.baseurl }}/documentation/img/Ref_Store_Architecture.png)
<br/>

### Presentation Layer

The presentation layer provides the user interface management capabilities using a modern UI framework that uses the following configuration files:
- `index.html` - The front-end html document that is populated by the REACT pages and components.
- `App.js` - The javascript file that contains the import instructions for the React components and the subsequent layers. When this script is run, all subsequent components are loaded on the page.
- `index.js` - The javascript file that contains the import instructions for the required frameworks, such as bootstrap, React, and renders the `App.js` file. This file also registers the PWA service worker.
- `CSS` - The file that consists of the  custom stylesheets and static page assets for the storefront front-end presentation.

### Page Assets

The storefront loads the page assets  through a webserver. For the default implementation of the storefront, you need not connect a Content Management System (CMS) with the storefront or synchronize catalog data between the storefront and CMS.

A page is composed of the static assets for PWA. These assets are included within the web application and are loaded by the web application. The catalog images stored in the Amazon S3 bucket are retrieved using the SKU naming conventions. You can configure the SKU naming conventions in the `/src/ep.config.json` file, which contains the configurations for the reference storefront.

When you add new products and create corresponding SKUs in Elastic Path Commerce, to add new catalog images for these products, upload the images to the Amazon S3 bucket that is used for PWA. When you create custom landing page for categories or products, you can upload images and content for the page to the Amazon S3 bucket that PWA uses for the page.

### Route/Page Layer

The route/page layer routes browser requests to the subsequent pages. This layer is composed of:
* `routes.js` - The javascript file that contains routes and mappings to the `.jsx` React pages.
* Pages - The top-level pages that loads the required components for each page.
* Service worker - A service worker  created using Workbox to manage caching and PWA capabilities.

### Component Layer

The component layer provides the components to be loaded within each page. The components are created depending on the functionality of the item that the pages interact with or loads.

### Web Server Layer

Web Server Layer enables the interaction between the application and the service layer. This layer is composed of:
* [node.js](https://nodejs.org/en/) - The web server implementation that loads the React PWA.
* [Webpack](https://webpack.js.org/) - The  javascript module bundler that captures the modules with dependencies and generate static assets for the modules.

### API Layer

The application layer of React Reference Storefront is built on [Cortex API](https://developers.elasticpath.com/commerce/7.3/Cortex-API-Front-End-Development/Getting-Started/Introduction). Through Cortex API, the storefront get to use the ecommerce capabilities provided Elastic Path Commerce. PWA interacts with the required services through this layer.

## Cortex Integration

The Reference Storefront invokes Cortex APIs to ensure that the best practices of consuming hypermedia APIs are followed.

![Cortex]({{ site.baseurl }}/documentation/img/cortex-page-diagram.png)

For your convenience, the fetch call invoking the REST HTTP request is wrapped to allow for modifications or customizations to the basic fetch being performed.

The top-level root is always invoked first to retrieve the top most APIs that can be invoked. Upon retrieving the root level, subsequent actions are performed against Cortex on children of the root, depending on the action intended to be performed by the REACT Component initiating the REST request. It's important to note that REST requests should be made to URLs returned by Cortex, and not constructed by the UI itself, with the exception of the oauth authentication services. This is to ensure that the UI remains unconstrained to URIs and does not regress in the case of any API naming updates in the future. Due to the possibility of URL nouns and verbs changing in future releases, it's important to note that the consumption of a URL directly through Cortex' response must be avoided and instead rels must be retrieved from Cortex' response.

`Cortex.js` contains the wrapper for fetch requests made to Cortex. You can include additional headers or generic request modifications in the cortexFetch() function if you choose, as part of your implementation. This includes x-headers and the ability to add any additional headers.

`AuthService.js` contains the authentication functions used to authenticate a user/shopper with Cortex using oauth2. OAuth tokens are saved to the web application's local storage where they can be retrieved and injected into the header for authenticating subsequent Cortex requests.
`
Zoom queries can be constructed in the simple manner of populating an array with all required queries and appending it to the request to Cortex. The basic construct for creating zoom queries is to only request the additional data needed by the component consuming it. Avoid requesting data which is not required, and avoid circular zooms as these may have impacts to performance.
<br/><br/>
