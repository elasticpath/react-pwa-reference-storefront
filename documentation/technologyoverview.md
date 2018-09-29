---
layout: master
permalink: /documentation/technologyoverview/
title: Technology
weight: 3
---
## Requirements and Specifications

For installing and customizing React Reference Storefront, in addition to a valid Elastic Path development environment, the following software are required:
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:
	- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)</br>
	- [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Java JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-javase8-2177648.html)
- [Maven 3.5.2](https://archive.apache.org/dist/maven/maven-3/3.5.2/binaries/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)

## Supported Platforms

 Elastic Path recommends using certified platforms, which are used for the regression and performance testing, for the product configuration.
 Elastic Path products might function correctly when deployed with compatible platforms, however, these platforms are not tested with the products. Elastic Path does not provide recommendations or best practices for these technologies.

 || Certified|Compatible|
|--|--|--|
|** Browsers **| Internet Explorer(10 or later)<br/>Google Chrome<br/>Safari|Mozilla Firefox|
|** Devices **|Android tablets (10 and 7 ins)</br>iOS tablets (10 and 7 ins)|Android Phones<br/>iOS Phones |

## Technology Stack

The React Reference Storefront technologies are robust and extensible. With these technologies, JavaScript developers and the front-end developers can customize storefront with ease and quickly.

|  Technology| Description|Version|Domain|
|--|--|--|--|
| **React.js** |The JavaScript library for building a user interface using the components for single page applications.|16.4.1| Development |
|[**Webpack**](https://webpack.js.org/)| An open-source JavaScript module bundler. Webpack takes modules with dependencies and generates static assets for the modules. |4.16.0|Development |
|  **jQuery** | The JavaScript library used for the base DOM abstraction layer. | 3.3.1 |Development |
| [**Babel**](https://babeljs.io/) |The Javascript compiler. | 6.26.3 |Development |
| **Bootstrap.js** | A free and open-source front-end framework for designing websites and web applications. |  4.4.1|Development |
|[**node.js**](https://nodejs.org/en/)|An open-source, cross-platform JavaScript run-time environment that executes JavaScript code server-side.|8.11.2|Development |
|Workbox|JavaScript Libraries for adding offline support to web apps|3.4.1|Development |
|**Selenium**|Framework for testing web applications using browser automation.|3.4.0|QA|
|Cucumber|Runs automated acceptance tests written in a behaviour-driven development style.|1.2.5|QA|




{% include legal.html %}
