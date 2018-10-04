---
layout: master
permalink: /documentation/overview/
title: Overview
weight: 2
---
# React Reference Storefront

## Overview

The React PWA Reference Storefront is a flexible e-commerce website built on Elastic Path’s [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) e-commerce API,  [Cortex API](https://developers.elasticpath.com/commerce/7.3/Cortex-API-Front-End-Development/Getting-Started/Introduction). Through Cortex API, the storefront get to use the e-commerce capabilities provided by Elastic Path Commerce and get data in a RESTful manner.

React Reference Storefront is composed of containers (pages) and React components. Each page in the storefront is composed of various components that fulfills the purpose of the page. For example, home, cart, categories, checkout, and registration are separate pages. Each page consists of various components, such as navigation, footer, product List, or products.

The Storefront is designed as an open source mobile Progressive Web Application (PWA) that has the capabilities for local browser storage page caching and persistent session management. This PWA is built using the ['React.js'](https://reactjs.org/), [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/), and [Babel](https://babeljs.io/) technologies. [Webpack](https://webpack.js.org/) and [node.js](https://nodejs.org/en/) enable the application layer interactions through configurable web server.

With theming, you can change the presentation of the React Reference Storefront without modifying JavaScript. React Reference Storefront uses the dynamic stylesheet language, [less](http://lesscss.org/), to changes the themes. You can change the look and feel of the storefront by modifying the corresponding `{less}` files.

Each theme is a set of `{less}` files, which can be compiled into a `style.css` file. The `{less}` files for each theme are organized in the same order as the storefront is presented.
For example, `CartPage.less` contains CSS for the cart’s container page, and  `cart.main.less` contains CSS for the main component in the cart page.

### Features

In React Reference Storefront, e-commerce functionality, such as cart, authentication, profile, or search, and the website presentation are separated. The front-end developers need not change JavaScript to update the CSS files to change the presentation and the JavaScript developers can develop functionality without changing front-end. Each customization layer is separated into it's own layer from the core code, so developers need not change the Storefront’s utility engine.

You can access the React Reference Storefront on various devices, such as tablets, mobile phones, or computers.

![Feature Guide]({{ site.baseurl }}/documentation/img/featureSupport.png)
<br/><br/>


{% include legal.html %}
