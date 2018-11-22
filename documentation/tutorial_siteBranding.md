---
layout: master
permalink: /documentation/tutorial_branding/
title: Tutorial Site Branding
tutorial: true
weight: 10
---
# Tutorial: Site Branding

### Requirements

* A development environment
* An Elastic Path training virtual machine

### Prerequisites

Ensure that you are familiar with the following third-party technologies:
* Git
* Node.js
* Visual Studio Code with the following extensions:
    * Debugger for Chrome
    * ESLint extension

### Example

**Before you begin**:
* For device compatibility, ensure that any image names and the resolution are the same.<br>

1. Clone or pull the `react-pwa-reference-storefront` repository to your directory.
2. Navigate to the `src/ep.config.json` file.
3. Update the value of `cortexApi.scope` with the store's name.
4. Add marketing content images in the `react-pwa-reference-storefront⁩/src⁩/images⁩/site-images` file. <br>
    **Note**: To replace images and keep the same layout in other components, ensure that the image names are the same. <br>
5. Add PWA icons and any default splash screen images in the `react-pwa-reference-storefront⁩/src⁩/images⁩/manifest-images` file. <br>
6. Add icon images in the `react-pwa-reference-storefront⁩/src⁩/images⁩/header-icons` file. <br> For example, the magnifying glass icon.<br>
7. Upload all product and SKU images to a CMS. <br>
    a) In each image, update the value of `skuImagesUrl` with the path to the product and SKU images hosted on your external CMS. <br>
    b) Replace the SKU or product file name with `%sku%`. This value is populated when the page is loaded with the values retrieved by Cortex. <br>
8. Upload all your site images to a CMS. <br>
    a) In each image, update the value of `siteImagesUrl` with the path to the site content and marketing images.<br>
    b) Replace the file name and extension with `%fileName%`. This value is populated when the page is loaded with the values retrieved by your components. <br>
    **Note**: If there is an issue with retrieving the values, the value is populated with assets locally available in `./src/images/site-images`. <br>
9. Optional: Set the value of `arKit.enable` to **true**. <br>
    **Note**: When you enable `arKit.enable`, any product images with hosted ARKit USDZ files are wrapped with an anchor tag referencing the file hosted on an external CMS.<br>
10. Optional: Update the value of `arKit.skuArImagesUrl`. <br>
    a) Update the path to the USDZ files hosted on an external CMS used for ARKit Quick Look. <br>
    b) Replace the `sku/file-name` parameter with `%sku%` to complete the URL of the files. <br>
    Cortex populates the parameter value when the page loads.<br>
11. Update the color values for your store's brand in the `src/style/common.less` file.<br>
