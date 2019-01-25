---
layout: master
permalink: /documentation/b2b/
title: B2B
weight: 7
---
# B2B Storefront Configuration and Implementation

## Configuration
TBA

## Implementing KeyCloak Theme
By default, KeyCloak provides a set of themes, such as, login or accounts, that can be used for the various actions that KeyCloak supports. Use one of these existing themes for the supported flows or add a customized theme to the KeyCloak Docker Image, if required. The REACT PWA Reference Storefront provides a login theme to use for the custom login page.

For the current KeyClock Docker Image, add the custom themes to the `/devops/docker/keycloak/themes` directory.

To apply a custom KeyCloak theme to an Account Management instance::
1. Copy and extract the `https://github.com/elasticpath/react-pwa-reference-storefront/tree/master/eam/keycloak/themes.zip` file into the `/devops/docker/keycloak/themes` directory.

**Note:** Ensure that the new directory is in the following order: `/devops/docker/keycloak/themes/vestri/...`.
2. Build and run the Account Management KeyClock Docker Image.
3. To use the newly added `vestri` custom theme, configure your client in the KeyClock administrative console.
<br/><br/>

{% include legal.html %}
