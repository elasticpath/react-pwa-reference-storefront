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
* Ensure that the image names and the resolution are the same.<br>

1. Navigate to the `react-pwa-reference-storefront` repository.
2. In the `src/ep.config.json` file, update the `cortexApi.scope` parameter with the store name.
4. In the `react-pwa-reference-storefront⁩/src⁩/images⁩/site-images` directory, add marketing content images.<br>
    **Note**: You can reuse images and the same layout in various components if you don't change the image name. <br>
5. In the `react-pwa-reference-storefront⁩/src⁩/images⁩/manifest-images` directory, add PWA icons and any default splash screen images. <br>
6. In the `react-pwa-reference-storefront⁩/src⁩/images⁩/header-icons` directory, add icon images. <br> For example, the magnifying glass icon.<br>
7. Upload all product and SKU images to a CMS. <br>
    a) Update the value of `skuImagesURL` in all product and SKU images with the corresponding path in the CMS.<br>
    b) Replace the SKU or product file name with `%sku%`. This value is populated when the page is loaded with the values retrieved by Cortex. <br>
8. Upload all your site images to a CMS. <br>
    a) Update the value of `siteImagesUrl` in all images with the corresponding path to the site content and marketing images.<br>
    b) Replace the file name and extension with `%fileName%`. This value is populated when the page is loaded with the values retrieved by your components. <br>
    **Note**: The `%fileName%` value is populated with assets available locally in the `./src/images/site-images` directory if the value retrieval fails. <br>
9. Optional: Set the value of `arKit.enable` to **true**. <br>
    **Result**: Product images with hosted ARKit USDZ files are wrapped with an anchor tag referencing the file hosted on an external CMS.<br>
10. Optional: Update the value of `arKit.skuArImagesUrl`. <br>
    a) Update the path to the USDZ files hosted on an external CMS used for ARKit Quick Look. <br>
    b) Replace the `sku/file-name` parameter with `%sku%` to complete the URL of the files. <br>
    Cortex populates the parameter value when the page loads.<br>
11. Update the `src/style/common.less` file with the colour values for the store.<br>
