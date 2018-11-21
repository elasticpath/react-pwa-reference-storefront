---
layout: master
permalink: /documentation/tutorial_production/
title: Tutorial Setting Up Production
tutorial: true
weight: 9
---
# Tutorial: Setting Up a Production Instance

### Requirements

This tutorial requires:
* A development environment
* An Elastic Path training virtual machine

### Prerequisites

Ensure that you are familiar with the following third-party technologies:<br>
* Git
* Node.js
* Visual Studio Code with the following extensions:
   * Debugger for Chrome
   * ESLint extension

### Example

1. Build a production Docker image.<br>
    a) Clone or pull the `react-pwa-reference-storefront` repository in to your directory.<br>
    b) Run the following command: <br>`cd react-pwa-reference-storefront`<br>
    c) Run the following command: <br>`docker build -t ep-store -f ./docker/prod/Dockerfile .` <br>
    d) Push the `ep-store` image to the Docker repository.<br>
2. Run a production Docker image.<br>
    a) Navigate to your Docker directory: <br>`docker/prod/`<br>
    b) Copy the following files to the user home directory on the remote host:<br>
        -`docker-compose.yaml`<br>
        -`nginx.conf` <br>
    c) In the `nginx.conf` file, replace the `$CORTEX_URL` parameter with a Cortex server URL.<br>
    d) In the `docker-compose.yaml` file, replace the `$DOCKER_REPO` parameter with `ep-store`.<br>
    e) In the `nginx.conf` file, replace the `$DOMAIN` parameter the domain name. <br>
    **Note**: Ensure that you exclude `http://`.<br>
    f) Replace the `$SSL_CERT_PATH` in the `nginx.conf` and `docker-compose.yaml` files with the path of the certificate file from the remote server. <br> For example, `/etc/letsencrypt/live/reference.elasticpath.com/fullchain.pem`.<br>
    g) Replace the `$SSL_KEY_PATH` in the `nginx.conf` and `docker-compose.yaml` files with the path of the private key from the remote server.<br> For example, `/etc/letsencrypt/live/reference.elasticpath.com/privkey.pem`<br>
    e) Run the following Docker command: <br> `docker-compose up -d` <br>
