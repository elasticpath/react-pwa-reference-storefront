# Tutorial: Setting Up a Production Instance

### Overview

This tutorial demonstrates how to set up a production ready environment for a React PWA Reference Storefront.

### Prerequisites

This tutorial requires an Elastic Path developer environment: 

* Your own development environment
* An Elastic Path Training virtual machine

Ensure that you are familiar with the following third-party technologies:

* Git
* Node.js
* Visual Studio Code with the following extensions:
*   * Debugger for Chrome
*   * ESLint extension

### Business Requirements

As a developer, I want to set up and install a React PWA Reference Storefront experience so my company can engage customers on multiple touchpoints, such as desktop, tablet and mobile devices.

### Reference Example

This reference example creates a **Terms and Conditions** page used during the shopper checkout flow. This example can be used as a guide to creating other pages and containers within the React PWA Reference Storefront. 

### Exercise

#### Step 1: Access the repository

Clone or pull the `react-pwa-reference-storefront` repository to your directory.

#### Step 2: Build a Production Docker Image

Build the Production Docker Image for the React PWA Reference Storefront.

1. Start by cloning or pulling the `react-pwa-reference-storefront` repository in to your directory.
2. When the repository is cloned or pulled into your directory, run the `cd react-pwa-reference-storefront` command.
3. Run the docker build `-t ep-store -f ./docker/prod/Dockerfile .` command.
4. Push the `ep-store` image to the docker repository.

#### Step 3: Run a Production Docker Image

With the Production Docker Image built, the next steps are to run the image.

1. In the repository, navigate to the `docker/prod/ directory`.
2. Copy the` docker-compose.yaml` and `nginx.conf` files to a folder on the remote host.
3. Replace the `$CORTEX_URL` parameter in the `nginx.conf` file with a Cortex server URL.
4. Replace the `$DOCKER_REPO` parameter in the `docker-compose.yaml` file with `ep-store`.
5. Run the `docker-compose up -d` command.

