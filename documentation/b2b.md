---
redirect_to: "https://documentation.elasticpath.com/storefront-react/index.html"
layout: master
permalink: /documentation/b2b/
title: B2B
weight: 7
---
# B2B Storefront Configuration and Implementation

The REACT PWA Reference Storefront will use the Account Management service to authenticate for any B2B Commerce shopping flows.

## Configuration
The `b2b` configurations in the `src/ep.config.json` file are described in the repository's `README.md`.<br>
You must also ensure to correctly configure the `cortexApi.scope` parameter with the intended store/organization name used by divisions for your store, and the `cortexApi.pathForProxy` parameter with the location of cortex instance used for any B2B Commerce shopping flows.

## Implementing Keycloak Theme
By default, Keycloak provides a set of themes, such as, login or accounts, that can be used for the various actions that Keycloak supports. Use one of these existing themes for the supported flows or add a customized theme to the Keycloak Docker Image, if required. The REACT PWA Reference Storefront provides a login theme to use for the custom login page.

For the current KeyClock Docker Image, add the custom themes to the `/devops/docker/keycloak/themes` directory.

To apply a custom Keycloak theme to an Account Management instance:
1. Copy and extract the `https://github.com/elasticpath/react-pwa-reference-storefront/tree/master/eam/keycloak/themes.zip` file into the `/devops/docker/keycloak/themes` directory.<br>
**Note:** Ensure that the new directory is in the following order: `/devops/docker/keycloak/themes/vestri/...`.
2. Build and run the Account Management KeyClock Docker Image.
3. To use the newly added `vestri` custom theme, configure your client in the KeyClock administrative console.
<br/><br/>

{% include legal.html %}
