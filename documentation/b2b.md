---
layout: master
permalink: /documentation/b2b/
title: B2B
weight: 7
---
# B2B Storefront Configuration and Implementation

## Configuration
TBA

## KeyCloak Theme Implementation
By default, KeyCloak provides a set of themes that may be used for the various actions KeyCloak supports (login, accounts, etc). Either of these existing themes may be used for the supported flows, or a customized theme may be added to the KeyCloak Docker Image if desired. The REACT PWA Reference Storefront includes a login theme that may be used for this purpose.

The current KeyClock Docker Image will expect any cusom themes to be provided in the directory `/devops/docker/keycloak/themes`.

To apply the custom KeyCloak theme to your EAM instance:
1. Copy and extract the file `https://github.com/elasticpath/react-pwa-reference-storefront/tree/master/eam/keycloak/themes.zip` into `/devops/docker/keycloak/themes`.
2. Ensure the new directory structure represents the following hierarchy: `/devops/docker/keycloak/themes/vestri/...`
3. Build and run the EAM KeyClock Docker Image as usual
4. Configure your client in the KeyClock administrative console to use the newly added custom `vestri` theme.
5. You may apply this same practice to add any further custom themes to the KeyClock Docker Image.
<br/><br/>

{% include legal.html %}
