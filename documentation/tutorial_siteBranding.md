---
layout: master
permalink: /documentation/tutorial_branding/
title: Tutorial Site Branding
tutorial: true
weight: 10
---
# Tutorial: Site Branding

### Overview

This tutorial demonstrates how to quickly brand the React PWA Reference Storefront.

### Prerequisites

This tutorial requires an Elastic Path developer environment:

* Your own development environment
* An Elastic Path Training virtual machine

Ensure that you are familiar with the following third-party technologies:

* Git
* Node.js
* Visual Studio Code with the following extensions:
*   Debugger for Chrome
*   ESLint extension

### Business Requirements

As a developer, I want to set up and install a React PWA Reference Storefront experience so my company can engage customers on multiple touchpoints, such as desktop, tablet and mobile devices.

### Reference Example

This reference example brands the storefront. This example can be used as a guide to creating other pages and containers within the React PWA Reference Storefront.

### Exercise

#### Step 1: Access the repository

Clone or pull the `react-pwa-reference-storefront` repository to your directory.


#### Step 2: Branding the React PWA Reference Storefront

1. Navigate to the `src/ep.config.json` file and update the value of `cortexApi.scope` with your store's scope.
2. Update the images in `react-pwa-reference-storefront⁩/src⁩/images⁩/site-images` with the images your site will use for various marketing content. Ensure to keep the image names the same to use existing components, but you may add more images if you choose to reference them in any additional components you add later.
3. Update the images in `react-pwa-reference-storefront⁩/src⁩/images⁩/manifest-images` with the images your site will use for the PWA icons and default splash screen images. Ensure to keep the image names and resolutions the same to maintain device compatability.
4. Update the images in `react-pwa-reference-storefront⁩/src⁩/images⁩/header-icons` with the images your site will use for any icons. Ensure to keep the image names and resolutions the same to maintain device compatability.
5. Upload all your sku/product images to a CMS of your choosing. Update the value of `skuImagesUrl`: Path to catalog images hosted on an external CMS. Set this to the complete URL of your images, replacing the sku/file-name with the string `%sku%`. This value is populated when the page is loaded with the values retrieved by Cortex.
6. Upload all your site images to a CMS of your choosing. Update the value of `siteImagesUrl`: Path to site content and marketing images hosted on an external CMS. Set this to the complete URL of your images, replacing the file name and file extension with the string `%fileName%`. This value is populated when the page is loaded with the values retrieved by your components. If there is an issue with retrieving the values, the value is populated with assets locally available in `./src/images/site-images`.
7. Optionally update the value of `arKit.enable`: Enable elements for ARKit's Quick Look capability to load on a product display page. When `arKit.enable` is enabled, any product images that have hosted ARKit USDZ files are wrapped with an anchor tag referencing the file hosted on an external CMS.
8. Optionally update the value of `arKit.skuArImagesUrl`: The path to the USDZ files hosted on an external CMS used for ARKit Quick Look. Set this parameter to the complete URL of the files by replacing the `sku/file-name` parameter with `%sku%`. This parameter is populated when the page is loaded with values retrieved by Cortex.
9. Update the values in `src/style/common.less` to your preferred colors for your store's brand.
