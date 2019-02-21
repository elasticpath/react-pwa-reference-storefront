# REACT PWA Reference Storefront Quick Start Guide

## Table of Contents

  * React PWA Reference Storefront
      * [Documentation Introduction](#documentation-introduction)
      * [Related Resources](#related-resources)
  * [Overview](#overview)
  * [Setting up the Storefront](#setting-up-the-storefront)
      * [Prerequisites](#prerequisites)
      * [Configuration Parameter Descriptions](#configuration-parameter-descriptions)
      * [Configuring Sample Data](#configuring-sample-data)
      * [Setting up a Development Environment](#setting-up-a-development-environment)
      * [Setting up a Production Environment](#setting-up-a-production-environment)
  * [Running a Linter](#running-a-linter)
  * [Adding New Locales](#adding-new-locales)
  * [Running E2E Tests](#running-e2e-tests)
  * [Configuring Jenkins Pipeline](#configuring-jenkins-pipeline)
      * [Prerequisites](#prerequisites)
      * [Configuring the Jenkinfile](#configuring-the-jenkinfile)
      * [Jenkins Pipeline Parameter Descriptions](jenkins-pipeline-parameter-descriptions)
      * [Configuring the Jenkins Job](#configuring-the-jenkins-job)
      * [Jenkins Pipeline Workflow](#jenkins-pipeline-workflow)
  * [Terms And Conditions](#terms-and-conditions)

## React PWA Reference Storefront

### Documentation Introduction

This document provides guidelines for knowledgeable JavaScript developers and front-end developers to extend and customize React PWA Reference Storefront components. However, this document is not a primer for JavaScript or CSS and is intended for professionals who are familiar with the following technologies:

  * [React](https://reactjs.org/)
  * [jQuery](https://jquery.com/)
  * [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
  * [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets)
  * [less](http://lesscss.org/)

### Related Resources

- [REACT PWA Reference Storefront Overview](https://developers.elasticpath.com/reference-experiences)
- [REACT PWA Reference Storefront Documentation](https://documentation.elasticpath.com/storefront-react/index.html)

## Overview

The REACT PWA Reference Storefront is a flexible e-commerce website built on Elastic Path’s RESTful e-commerce API, Cortex API. Through the Cortex API, the storefront uses the e-commerce capabilities provided by Elastic Path Commerce and gets data in a RESTful manner. For more information about the storefront, see [REACT PWA Reference Storefront Documentation](https://documentation.elasticpath.com/storefront-react/index.html).

The Storefront is designed as an open source mobile Progressive Web Application (PWA) that has the capabilities for local browser storage page caching and persistent session management. This PWA is built using the ['React.js'](https://reactjs.org/), [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/), and [Babel](https://babeljs.io/) technologies. [Webpack](https://webpack.js.org/) and [node.js](https://nodejs.org/en/) enable the application layer interactions through the configurable web server. For more information about the software requirements, see the [Requirements and Specifications](https://documentation.elasticpath.com/storefront-react/docs/requirements.html) section.

## Setting up the Storefront

### Prerequisites

Ensure that the following software are installed:

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:<br/>
    * [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)<br/>
    * [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)<br/>
* A valid Elastic Path development environment. For more information, see
[The Starting Construction Guide](https://developers.elasticpath.com/commerce/construction-home).

### Configuration Parameter Descriptions

You must configure the following parameters in the `./src/ep.config.json` file:

|  Parameter| Importance|Type|Description|
|--|--|--|--|
|`cortexApi.path`| Required| String| The URL, which is composed of the hostname and port, to access Cortex. By default, a web proxy is configured in the [Webpack](https://webpack.js.org/) configuration of the project. For local development, set this value to `/cortex` to redirect Cortex calls to the local proxy.|
|`cortexApi.scope`| Required| String| Name of the store from which Cortex retrieves data.|
|`cortexApi.pathForProxy`|Required|String| The path to which the [Webpack](https://webpack.js.org/) proxy routes the Cortex calls from the storefront. This value is a URL that consists of hostname and port of a running instance of Cortex. Leave this field blank to disable proxy.|
|`skuImagesUrl`| Required| String| The URL that consists of the path to catalog images hosted on an external CMS. Set this parameter to the complete URL of the images by replacing the `sku/file-name` with the `%sku%` string. This value is populated when the page is loaded with values retrieved by Cortex.|
|`siteImagesUrl`| Optional| String| The path to the site content and marketing images hosted on an external CMS. Set this parameter to the complete URL of the images by replacing the filename and file extension with `%fileName%`. This parameter is populated with the values set in the components when the page is loaded, and uses the assets locally available in the `./src/images/site-images` directory.|
|`arKit.enable`| Optional| Boolean| Enable elements for ARKit's Quick Look capability to load on a product display page. When `arKit.enable` is enabled, any product images that have hosted ARKit USDZ files are wrapped with an anchor tag referencing the file hosted on an external CMS.|
|`arKit.skuArImagesUrl`| Optional| String| The path to the USDZ files hosted on an external CMS used for ARKit Quick Look. Set this parameter to the complete URL of the files by replacing the `sku/file-name` with `%sku%`. This value is populated when the page is loaded with values retrieved by Cortex.|
|`b2b.enable`| Optional| Boolean| The general configuration to enable the B2B e-commerce shopping flow components in the storefront.|
|`b2b.authServiceAPI.path`| Optional| String| The URL, which is composed of the hostname and port, to access the Admin APIs. By default, a web proxy is configured in the [Webpack](https://webpack.js.org/) configuration of the project. For local development, set this value to `/admin` to redirect Cortex calls to the local proxy.|
|`b2b.authServiceAPI.pathForProxy`| Optional| String| The path to which the [Webpack](https://webpack.js.org/) proxy uses to route Cortex calls from the storefront to the publically hosted Account Management service. This value is a URL consisting of a hostname and port of a running Cortex for Account Management service instance. Leave this field blank to disable proxy.|
|`b2b.keycloak.callbackUrl`| Optional| String| The URL that is passed to keycloak, and redirected to upon a successful login.|
|`b2b.keycloak.loginRedirectUrl`| Optional| String| The keycloak log on URL.|
|`b2b.keycloak.logoutRedirectUrl`| Optional| String| The keycloak log off URL.|
|`b2b.keycloak.client_id`| Optional| String| The keycloak client configuration ID.|
|`gaTrackingId`| Optional| String| The Google Analytics tracking ID to integrate with Google Analytics Suite to track enhanced e-commerce activity on the site.|
|`indi.enable`| Optional| Boolean| Enable the integration component for Indi. More information may be found available here `https://indi.com/`.|
|`indi.carousel`| Optional| Values| Configurations for the Indi carousel component.|
|`indi.productReview`| Optional| Values| Configurations for the Indi product review component.|
|`indi.brandAmbassador`| Optional| Values| Configurations for the Indi brand ambassador component.|
|`facebook.enable`| Optional| Boolean| Enable the Elastic Path Facebook Chatbot component. More information may be found available here `https://github.com/elasticpath/facebook-chat`.|
|`facebook.pageId`| Optional| String| The Facebook Page Identifier used to connect the chatbot component to Facebook.|
|`facebook.applicationId`| Optional| String| The Facebook Application Identifier used to connect the chatbot component to Facebook.|

### Configuring Sample Data

Elastic Path provides a set of sample data with the storefront project.<br/> **Note:** A valid Elastic Path development environment is required to access the sample data.

1. From the `react-pwa-reference-storefront/data` directory, extract the sample catalog data contents into the `ep-commerce/extensions/database/ext-data/src/main/resources/data` directory.
2. In the `ep-commerce/extensions/database/ext-data/src/main/resources/data/` directory, update the `liquibase-changelog.xml` file with the following sample data:<br/>`<include file="ep-blueprint-data/liquibase-changelog.xml" relativeToChangelogFile="true" />`
**Note:** This data must be the only sample data included within the sample data block.
3. In the  `ep-commerce/extensions/database/ext-data/src/main/resources/environments/local/data-population.properties` file, set the `liquibase.contexts` property to `default,ep-blueprint`.
4. In the command line, navigate to the `extensions/database` module.
5. To run the Data Population tool, run the following command:<br/> `mvn clean install -Preset-db`.
For more information about populating database, see the [Populating the Database](https://developers.elasticpath.com/commerce/7.3/Core-Commerce-Development/Setting-up-your-Developer-Environment/Populate-the-Database#ConfigureDemoDataSets) section.

### Setting up a Development Environment

1. Clone or pull the `react-pwa-reference-storefront` repository to your directory.
2. Run the `cd react-pwa-reference-storefront` command.
3. To install dependencies, run the `npm install` command.
4. Configure the `./src/ep.config.json` file as required for the environment.<br/> For more information, see the [Configuration Parameter Descriptions](#configuration-parameter-descriptions) section.
**Note:** For more information about configuring the storefront as a B2B instance, see [REACT PWA Reference Storefront Documentation B2B](https://documentation.elasticpath.com/storefront-react/docs/dev-guides/implement-b2b.html).
5. To start the server in development mode, run the `npm start` command.
6. To see the running Progressive Web Application (PWA), navigate to `http://localhost:8080/` .

### Setting up a Production Environment
1. Clone or pull the `react-pwa-reference-storefront` repository to your directory.
2. Navigate to the `react-pwa-reference-storefront` directory.<br>
3. Build a Production Docker Image:
    1. Clone or pull the `react-pwa-reference-storefront` repository to your directory.
    2. Run the `cd react-pwa-reference-storefront` command.
    3. Run the `docker build -t ep-store -f ./docker/prod/Dockerfile .` command.
    4. Push the `ep-store` image to the docker repository.

4. Run a Production Docker Image:
    1. Navigate to the `docker/prod/` directory.<br>
    2. Copy the following files to the user home directory on the remote host:<br>
        * `docker-compose.yaml`
        * `nginx.conf`
    3. In the `nginx.conf` file, update the following parameters:
        * `$CORTEX_URL` with Cortex server URL.
        * `$AUTHSERVICE_URL` with Cortex Account Management service URL (This is required for all scenarios. If not running the storefront in B2B mode, you may set this to the same value as `$CORTEX_URL`).
        * `$DOMAIN` with domain name without `http://`.
        * `$SSL_CERT_PATH` with the certificate file path in the remote server. <br>
        For example, `/etc/letsencrypt/live/reference.elasticpath.com/fullchain.pem`. <br>
        * `$SSL_KEY_PATH` with the path of the private key in the remote server.<br>
        For example, `/etc/letsencrypt/live/reference.elasticpath.com/privkey.pem`. <br>
        **Note:** You can use the certificate generated by any certificate provider, such as [Let's Encrypt](https://letsencrypt.org).
    4. In the `docker-compose.yaml` file, update the following parameters:
        * `$DOCKER_REPO` with `ep-store`.
        * `$SSL_CERT_PATH` with the certificate file path in the remote server .
        <br> For example, `/etc/letsencrypt/live/reference.elasticpath.com/fullchain.pem`.<br>
        * `$SSL_KEY_PATH` with the path of the private key in the remote server.
        <br> For example, `/etc/letsencrypt/live/reference.elasticpath.com/privkey.pem`.<br>
    5. Run the following Docker command to start the Docker container created for the Docker image:<br/>
        * `docker-compose up -d` <br>

## Running a Linter

The storefront project is set up with the linting utility, [ESLint](https://eslint.org/). For the storefront project, Elastic Path uses and extends the ESLint configuration provided by Airbnb. For more information on the style guide, see the [Airbnb GitHub](https://github.com/airbnb/javascript) page.<br/>
By default, the ESLint loader is added to the `webpack.config.dev.js` file. When you start the application in the development mode, the ESLint loader automatically runs.
1. To run the linter from the command line, navigate to the project root directory.
2. Run the following command:
    `./node_modules/.bin/eslint --ext .js --ext .jsx [file|dir|glob]`
3. Run the following command for the entire project:
 `./node_modules/.bin/eslint --ext .js --ext .jsx .`
With the ESLint extension for Visual Studio Code, you can view feedback when you write the code in the `Problems` view.

**Note:** When you check in the code, ensure that all linting errors are resolved.

## Adding New Locales

The reference storefront supports multiple languages and currencies. Add all front-end textual data in the `localization/en-CA.json` file as a resource string. By default,  `en-CA` and `fr-FR` locales are provided in the project.

1. For development purpose, run:<br/> `node tools/translate.js`.<br/>This runs a pseudo translation from `en-CA` locale to `fr-FR`.
2. To add a new locale, add an entry to the `supportedLocales` array in the `ep.config.json` file and add an appropriate `.json` file to the `localization` folder.
3. Configure the language and currency for all products in Commerce Manager.

## Running E2E Tests

Test are provided in the `tests` directory.

1. To run all unit tests, run the following command:<br/>`npm test`<br/>
2. To run all end to end tests, run the previous command, then press "p" and enter `e2e`, then press "enter".
3. To run a single test, run the previous command, then press "p" and type the filename.

**Note:** You may need to install watchman to get past the "too many files open" error. You may use [Homebrew](https://brew.sh/) to do so:
- `brew update`<br/>
- `brew install watchman`<br/>

For more information, see [Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/v1.12.2/docs/api.md).

## Configuring Jenkins Pipeline

The storefront project includes a Jenkinsfile template to configure a Jenkins job to build a Docker image for store from the project, deploy the Docker image to AWS, and run the unit tests.

### Prerequisites

- Ensure that an AWS EC2 instance is created for the pipeline to deploy the store and Cortex.

### Configuring the Jenkinfile

1. Open the Jenkisfile included in the project directory.
2. Configure Jenkins job with the required parameters as described in the [Jenkins Pipeline Parameter Descriptions](#jenkins-pipeline-parameter-descriptions) section.
3. Save the changes.

### Jenkins Pipeline Parameter Descriptions

| **Parameter** | **Description** |
|--|--|
|`DOCKER_REGISTRY_ADDRESS`|The path to AWS ECR. For example, `${awsAccountID}.dkr.ecr.${region}.amazonaws.com`. |
|`CORTEX_NAMESPACE`|The namespace for the Cortex images, such as Activemq, batch server, integration server, search server ,and Cortex server.|
|`DOCKER_IMAGE_TAG`|The tag used for the Cortex images.|
| `STORE_NAMESPACE`| The namespace for the store image and database image.|
|`STORE_IMAGE_TAG` | The tag for the store images, which are store image and database image.|
|`STORE_NAME` | The name of the store. For example, `vestri`.|
|`EC2_INSTANCE_HOST`| The IP address of the AWS EC2 host to deploy Jenkins pipeline.|
|`EC2_INSTANCE_USER` | The user credentials of the AWS EC2 instance.|
| `EC2_INSTANCE_SSH_KEY`|The path in Jenkins node that redirects to `ec2.pem file`.|
|`SOLR_HOME_GIT_URL` |The git URL to the project containing the solr home configuration.|
|`SOLR_HOME_BRANCH` |The branch name of the solr home configuration.|
|`SOLR_HOME_PATH` |The path to the solr home configuration that is provided in the git project.|

### Configuring the Jenkins Job

1. Navigate to the Jenkins job console and select the Jenkins job to configure.
2. In the left pane, select **Configuration**.
3. In the **Build Triggers** tab, select **Poll SCM**.<br/> The **Schedule** field is displayed.
4. In the **Schedule** field, set the time to run the job periodically.<br/> The default setting is `1 min`.
6. In the **Advanced Project Options** tab, do the following:
    1. In the **Definition** field, select **Pipeline script from SCM**.
    2. In the **SCM** field, select **Git**.
    3. In the **Repository URL** and **Branches to build** fields, enter the appropriate settings.
    4. In the **Script Path** filed, select **Jenkinsfile**
7. Click **Apply**.
8. Click **Save**.

You can configure all other setting as required for the project. This Jenkins job triggers commits to the master at the scheduled time. For more information about the pipeline, see the [Jenkins Pipeline Workflow](#jenkins-pipeline-workflow) section.


### Jenkins Pipeline Workflow

When you run the the Jenkins job, the job operates in the following sequence:

* `SETUP` - Pulls the project and the project containing solr home configuration to a repository.
* `BUILD` - Builds the store Docker image from the `docker/dev/Dockerfile` directory in the project and pushes the changes to AWS.
  * The development Docker runs the `entrypoint.sh` script to replace the path to Cortex and the store in the `ep.config.json` file and starts the project in development by running the `npm start` command.
* `UNDEPLOY_EXISTING` - Cleans up the working directory and removes docker containers and images, if any.
* `DEPLOY` - Creates the working directory, copies the files from the project and solr home configuration, exports the environment variables used in the compose file, and deploys the store and Cortex with Docker-compose.
* `TEST` - Runs the automated Puppeteer tests against the store created from the previous deployment step.

## Terms And Conditions

- Any changes to this project must be reviewed and approved by the repository owner. For more information about contributing, see the [Contribution Guide](https://github.com/elasticpath/react-pwa-reference-storefront/blob/master/.github/CONTRIBUTING.md).
- For more information about the license, see [GPLv3 License](https://github.com/elasticpath/react-pwa-reference-storefront/blob/master/LICENSE).
