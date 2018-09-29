---
layout: master
permalink: /
title: Home
weight: 1
---

# Elastic Path React Reference Storefront

## Contents

* React Reference Storefront
  * [Overview]({{ site.baseurl }}/documentation/overview)
      * [Architecture Overview]({{ site.baseurl }}/documentation/overview#platform-architecture)
  * [Requirements and Specifications]({{ site.baseurl }}/documentation/technologyoverview)
  * [Installing and Configuring React Reference Storefront]({{ site.baseurl }}/documentation/installing)
      *  [Running React Reference Storefront]({{ site.baseurl }}/documentation/installing#running-react-reference-storefront)
  * [Customizing React Reference Storefront]({{ site.baseurl }}/documentation/extending)
      * [Creating New Containers]({{ site.baseurl }}/documentation/extending#creating-new-containers-in-react)
      * [Creating New Components]({{ site.baseurl }}/documentation/extending#creating-new-components-in-react)
  * [Examples]({{ site.baseurl }}/documentation/practices)
      * [Analytics example goes here]({{ site.baseurl }}/documentation/practices#analytics)
      * [Content management example goes here]({{ site.baseurl }}/documentation/practices#content-management-for-assets-and-catalog-images)
  * [Related Resources]({{ site.baseurl }}/documentation/resources)


The REACT PWA Reference Storefront is a flexible e-commerce website backed by Elastic Path’s Cortex API.
It is comprised of the latest technologies, and is designed for extensibility.

E-commerce functionality (cart, authentication, profile, search, etc.) is separated from the website’s
presentation, allowing
front-end developers to work on the CSS without having to touch the JavaScript, while JavaScript developers
can develop
functionality without having to touch the front end. Each customization layer is separated from the core
code into it's own layer, so
neither developer has to touch the Storefront’s utility engine.
<br/><br/>

What is the Cortex API?
-------------------
Cortex API is Elastic Path's powerful [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) e-commerce API.
The API can surface up data from Elastic Path's backend system in a RESTful manner.

To learn more about Cortex API, see our [Developer Portal](http://touchpoint-developers.elasticpath.com/).

![Cortex]({{ site.baseurl }}/documentation/img/cortex-page-diagram.png)
<br/><br/>

REACT Reference Storefront Features
---------------------
![Feature Guide]({{ site.baseurl }}/documentation/img/featureSupport.png)
<br/><br/>

About the Documentation
---------------------
This document is written for knowledgeable JavaScript developers who are extending/customizing REACT
Storefront components and
for knowledgeable front-end developers. This document is not a primer for JavaScript, CSS, etc. Before you begin, you should have working knowledge of the following technologies:

* REACT.js
* jQuery.js
* Bootstrap.js
* CSS/{less}
<br/><br/>

Audience
---------------------
This document is written for experienced JavaScript developers and front-end UI developers who want to learn how to customize/extend REACT Reference Storefront.


{% include legal.html %}
