---
layout: master
permalink: /documentation/tutorial_production/
title: Tutorial Setting Up Production
tutorial: true
weight: 9
---
# Tutorial: Setting Up a Production Instance

### Requirements

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

1. Clone or pull the `react-pwa-reference-storefront` repository in to your directory.<br>
2. Navigate to the `react-pwa-reference-storefront` repository.<br>
3. Build a production Docker image by running the following command:</br>
`docker build -t ep-store -f ./docker/prod/Dockerfile .` <br>
4. Push the `ep-store` image to the Docker repository.<br>
5. Navigate to your Docker directory,`docker/prod/`.<br>
6. Copy the following files to the user home directory on the remote host:<br>
        -`docker-compose.yaml`
        -`nginx.conf` 
7. In the `nginx.conf` file, update:
   * `$CORTEX_URL` with Cortex server URL
   * `$DOMAIN` with domain name without `http://`
   * `$SSL_CERT_PATH` with with the path of the certificate file from the remote server. <br>
    For example, `/etc/letsencrypt/live/reference.elasticpath.com/fullchain.pem`.
   * `$SSL_KEY_PATH` with the path of the private key from the remote server.<br> 
   For example, `/etc/letsencrypt/live/reference.elasticpath.com/privkey.pem`
8. In the `docker-compose.yaml` file, update:
   * `$DOCKER_REPO` parameter with `ep-store`.
   * `$SSL_CERT_PATH` with the path of the certificate file from the remote server. 
    <br> For example, `/etc/letsencrypt/live/reference.elasticpath.com/fullchain.pem`.<br>
   * `$SSL_KEY_PATH` with the path of the private key from the remote server.
    <br> For example, `/etc/letsencrypt/live/reference.elasticpath.com/privkey.pem`<br>
9. Run the following Docker command:<br/> 
`docker-compose up -d` <br>