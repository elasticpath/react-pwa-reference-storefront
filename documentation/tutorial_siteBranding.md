---
redirect_to: "https://documentation.elasticpath.com/storefront-react/index.html"
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

**Warning:** <br/>
 Ensure that the image names and the resolution are the same.<br/>

1. Navigate to the `react-pwa-reference-storefront` repository.<br/>
2. In the `src/ep.config.json` file, update the `cortexApi.scope` parameter with the store name.<br/>
3. In the `react-pwa-reference-storefront⁩/src⁩/images⁩/site-images` directory, add marketing content images.<br/>
    **Note**: You can reuse images and the layouts in various components if you don't change the image name. <br/>
4. In the `react-pwa-reference-storefront⁩/src⁩/images⁩/carousel-images` directory, add carousel content images.<br/>
5. In the `react-pwa-reference-storefront⁩/src⁩/images⁩/manifest-images` directory, add PWA icons and any default splash screen images. <br/>
6. In the `react-pwa-reference-storefront⁩/src⁩/images⁩/header-icons` directory, add icon images. <br/>
7. Upload all product, SKU, and other site images to a CMS. <br/>
    1. In the CMS, update all product and SKU image names to corresponding SKU codes.<br/>
    2. In the `react-pwa-reference-storefront⁩/ep.config.json` file, update the `skuImagesURL` parameter for each image to the corresponding path for the image in CMS.<br/>
    3. Update the SKU or product file name to `%sku%` and site image names to `%fileName%`.<br/>
    The `%sku%` parameter is populated with the SKU code associated with each image and the  `%fileName%` parameter is populated with the associated file name. When you load the page, Cortex retrieves image for the specific SKU code or file name from CMS using the file path provided by the `skuImagesURL` parameter. <br/>
     **Note**: If Cortex fails to retrieve the `%fileName%` value from CMS, the parameter is populated with the assets available locally in the `./src/images/site-images` directory.<br/>
8. Optional: In the `react-pwa-reference-storefront⁩/ep.config.json` file:<br/>
    1. Set the `arKit.enable` parameter to **true**. <br/>
    If a USDZ file for a SKU is available at the path provided by the `skuImagesURL`  parameter, the product images are wrapped with an anchor tag with a reference to the file on the CMS.<br/>
    2. Update the `arKit.skuArImagesUrl` parameter to the USDZ file paths hosted on the CMS for ARKit Quick Look images.<br/>
    3. To complete the URL of the files, in the file path, update the `sku/file-name` parameter to `%sku%`. <br/>For example,
    ` "skuArImagesUrl":"https://s3.amazonaws.com/referenceexp/ar/%sku%.usdz"`<br/>
    Cortex populates the page with the images corresponding to the parameter value when the page loads.<br/>
9. Update the `react-pwa-reference-storefront⁩/src/style/common.less` file with the color values for the store.<br/>
