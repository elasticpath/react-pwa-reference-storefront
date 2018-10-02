# Elastic Path REACT PWA Reference Storefront Quick Start Guide

## Table of contents

  * Elastic Path REACT PWA Reference Storefront
    * [Documentation Introduction]()
    * [Related Resources]()
   * [Overview]()
   * [Development quick start](#gh-md-toc)
      * [Prerequisites](#pre-req)
      * [Configuration](#configuration)
      * [Sample data](#sample-data)
      * [Setup (Development)](#setup-development)
      * [Setup (Production)](#setup-production)
   * [Linting](#linting)
   * [Offline mode](#offline-mode)
   * [Localization](#localization)
   * [Unit tests](#unit-tests)
   * [Jenkins pipeline](#jenkins-pipeline)
   * [Contribution guide](#contribution-guide)
   * [License](#license)

## Elastic Path REACT PWA Reference Storefront

### Documentation Introduction

This document provides guidelines for knowledgeable JavaScript developers and front-end developers to extend and customize React Reference Storefront components. However, this document is not a primer for JavaScript or CSS and is intended for professionals who are familiar with the following technologies:
  * [React](https://reactjs.org/)
  * [jQuery](https://jquery.com/)
  * [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
  * [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets)
  * [less](http://lesscss.org/)

### Related Resources

[Elastic Path REACT PWA Reference Storefront Overview](https://developers.elasticpath.com/reference-experiences)
[Elastic Path REACT PWA Reference Storefront Installation Guide](https://elasticpath.github.io/react-pwa-reference-storefront/)
[Requirements and Specifications](https://elasticpath.github.io/react-pwa-reference-storefront/documentation/technologyoverview/)

## Overview

The Elastic Path REACT PWA Reference Storefront is a flexible e-commerce website built on Elastic Path’s RESTful e-commerce API, Cortex API.Through Cortex API, the storefront uses the e-commerce capabilities provided by Elastic Path Commerce and gets data in a RESTful manner. For more information about the storefront, see [Elastic Path REACT PWA Reference Storefront documentation](https://elasticpath.github.io/react-pwa-reference-storefront/).

The Storefront is designed as an open source Mobile Progressive Web Application (PWA) that has the capabilities for local browser storage page caching and persistent session management. This PWA is built using the ['React.js'](https://reactjs.org/), [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/), and [Babel](https://babeljs.io/) technologies. [Webpack](https://webpack.js.org/) and [node.js](https://nodejs.org/en/) enables the application layer interactions through configurable web server. For more information about the software requirements, see the [Requirements and Specifications](https://elasticpath.github.io/react-pwa-reference-storefront/documentation/technologyoverview/).

## Setting up the storefront

### Prerequisites

Ensure that the following software are installed :
* [Git](https://git-scm.com/downloads).
* [Node.js](https://nodejs.org/en/download/).
* [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:<br/>
    * [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)<br/>
    * [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)<br/>
* [Java JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-javase8-2177648.html)
* [Maven 3.5.2](https://archive.apache.org/dist/maven/maven-3/3.5.2/binaries/)
* [IntelliJ IDEA](https://www.jetbrains.com/idea/) (optional)
* A valid Elastic Path development environment. For  more information, see
[The Starting Construction Guide](https://developers.elasticpath.com/commerce/construction-home).

### Configuration Parameter Descriptions

Configure the following parameters in the `./src/ep.config.json` file:

|  Parameter| Importance|Type|Description|
|--|--|--|--|
|`cortexApi.path`|Required|String|The URL, which is composed of the hostname and port, to access Cortex. By default, a web proxy is configured in the [Webpack](https://webpack.js.org/) configuration of this project. For local development, set this value to `/cortex` to redirect Cortex calls to the local proxy.|
|`cortexApi.scope`|Required|String|Name of the store from which Cortex retrieves data.|
|`cortexApi.pathForProxy`|Required|String|The path to which the [Webpack](https://webpack.js.org/) proxy routes the Cortex calls from the storefront. This value is a URL that consists of hostname and port of a running instance of Cortex. Leave this field blank to disable proxy.|
|`skuImagesUrl`|Required|String|The URL that consists of the path to catalog images hosted on an external CMS. Set this parameter to the complete URL of the images by replacing the `sku/file-name` with the `%sku%` string . This value is populated when the page is loaded with values retrieved by Cortex.|
|`siteImagesUrl`|Optional|String|Path to the site content and marketing images hosted on an external CMS. Set this parameter to the complete URL of the images by replacing the filename and file extension with the `%fileName%` . This parameter is populated with the values set in the components when the page is loaded, and use the assets locally available in the `./src/images/site-images` directory.|
|`enableOfflineMode`|Optional|String|The option to enable offline mode to fetch requests static data instead of Cortex. For more information, see [offline mode](#offline_mode).|
|`gaTrackingId`|Optional|String|
 The Google Analytics tracking ID to integrate with Google Analytics Suite to track enhanced e-commerce activity on the site.|

### Configuring Sample Data

Elastic Path provides a set of sample data with this project.<br/> **Note:** A valid Elastic Path development environment is required to access the sample data.<br/>
1. Extract the sample catalog data contents from the `ep-store/data` directory into the `ep-commerce/extensions/database/ext-data/src/main/resources/data` directory.
2. In the `ep-commerce/extensions/database/ext-data/src/main/resources/data/` directory, update the `liquibase-changelog.xml` file with the following sample data:<br/>`<include file="ep-blueprint-data/liquibase-changelog.xml" relativeToChangelogFile="true" />`
**Note:** This data must be the only sample data included within the sample data block.
3. In the  `ep-commerce/extensions/database/ext-data/src/main/resources/environments/local/data-population.properties` file, set the `liquibase.contexts` property to `default,ep-blueprint`.
4. In the command line, navigate to the `extensions/database` module.
5. To run the Data Population tool, run the following command:<br/> `mvn clean install -Preset-db`.
For more information about populating database, see the [Populating the Database](https://developers.elasticpath.com/commerce/7.3/Core-Commerce-Development/Setting-up-your-Developer-Environment/Populate-the-Database#ConfigureDemoDataSets) section.

### Setting up the Development Environment

1. Clone or pull the `react-pwa-reference-storefront` repository to your directory.
2. Run the `cd ep-store` command.
3. To install dependencies, if any, run the `npm install` command.
4. Configure the `./src/ep.config.json` file as required for the environment. For more information, see the [Configuration Parameter Descriptions](#configuration) section.
5. To start the server in development node, run the `npm start` command.
6. To see the running Progressive Web Application (PWA), navigate to `http://localhost:8080/` .

### Setting up the Production Environment
1. Clone or pull the `react-pwa-reference-storefront` repository to your directory.
2. Run the `cd ep-store` command.
3. Run the `docker build -t ep-store -f ./docker/prod/Dockerfile` command.
4. Push the `ep-store` image to the docker repository.

##### Setting up Remote Production Environment
1. Pull the `ep-store` repository from your docker repository.
2. In the repository, navigate to the `docker/prod/` directory.
3. Copy the `docker-compose.yaml` and `nginx.conf` files to a folder on the remote host.
4. Replace the `$CORTEX_URL` parameter in the `nginx.conf` file with a Cortex Server URL.
5. Replace the `$DOCKER_REPO` parameter in the `docker-compose.yaml` file with `ep-store`.
5. Run the `docker-compose up -d` command.

## Running a Linter

The storefront project is set up with the linting utility, [ESLint]((https://eslint.org/). For the storefront project, Elastic Path uses and extends ESLint configuration provided by Airbnb. For more information on the style guide, see the [Airbnb GitHub](https://github.com/airbnb/javascript) page.<br/>
By default, the ESLint loader is added to the `webpack.config.dev.js` file. When you start the application in the development mode, the ESLint loader automatically runs.
1. To run the linter from the command line, navigate to the project root directory.
2. Run the following command:
    `./node_modules/.bin/eslint --ext .js --ext .jsx [file|dir|glob]`
3. Run the following command for the entire project:
 `./node_modules/.bin/eslint --ext .js --ext .jsx `
With the ESLint extension for Visual Studio Code, you can view feedback when you write the code in the `Problems` view.

**Note:** When you check in the code, ensure that all linting errors are fixed.

## Offline mode

In offline mode, the store fetched static data instead of Cortex. You can enable offline mode by setting the `enableOfflineMode` parameter in the [`./src/ep.config.json`](#configuration) file.

The *mock magic* is contained in `./src/utils/Mock.js`<br/>
The *mock data files* are expected to be stored in `./src/offlineData`<br/>
At a high level, **Mock.js** uses a map of Requests to Responses to send the mock data, given a Request. Instead of doing a fetch call to a url, it does a lookup in the map to retrieve/return the mock data. If mock data cannot be found for a request, an Error is thrown.<br/>

### Adding or Editing Data

To add or edit *mock data*:

1. Start *Online* and perform the *flow* that you want to mock.<br/>
2. In the browser, to see requests made by the *flow*, go to the **Settings>Tools>Developer Tools>Network** tab.
3. Filter the requests using the **XHRF** or **XHR and Fetch** options.
4. Copy the response directly from the request into a *.json* file at the            
  `./src/offlineData` directory.  
4. In the `.src/utils/Mock.js` file, add the following variable for data:
  `const myData = require('../offlineData/myData.json')`
5. Add data into the `mockData.set(myData.self.uri, { status: myStatusCode, data: myData}` map.
    * For **followlocation**, create a new variable for the request uri and use that variable instead of the `myData.self.uri` variable. The responses include the *followed* url instead of the *request* url.
    * For a request with no response, add the request URL with a status code and empty data. For more information, see the forms in the *Mock.js* file.

### Verifying Data

After mocking data for *flow*, enable [Offline Mode](#configuration) mode, restart the server and verify that the storefront is functioning as required.<br/>
Go through your *flow* and verify everything works the same as Online. For any missing response, an error is displayed in the *browser console*, which includes the request for which mock data is not found. Mock that request to continue.

### Default flows
By default, mock data for the following flows are available:
1. In the **Search** filed, enter `water` and view the products returned.
2. Navigate to the **Women** category.<br/>The products in the category are displayed.
3. In the **Women** category, add *Women's CR550 Polo"* to cart.<br/>**Note** Currently, only grey in medium size is available.
4. Check out the cart. There's currently one product in there for viewing.<br/>**Note** You cannot modify the cart. The `./src/offlineData/cartData.json` response is static.
5. In the cart, click  *Proceed To Checkout*.<br/> Currently, you can continue only without an account.
6. On the checkout page, complete the order by using the mock data for billing address, shipping address, and payment method.
    * When the order is complete, the **Order Review** page is displayed.
7. To view the order information, complete the purchase.
     The **Purchase Receipt** page with the order information is displayed.

## Adding New Locales

The reference storefront supports multiple languages and currencies. Add all front-end textual data in the `localization/en-CA.json` file as a resource string.By default,  `en-CA` and `fr-FR` are provided in this project.

1. For development purpose, run: `node tools/translate.js`.<br/>This runs a pseudo translation from `en-CA` locale to `fr-FR`.
2. To add a new locale, add an entry to the `supportedLocales` array in `ep.config.json` file and add an appropriate `.json` file to the `localization` folder.
3. Configure the language and currency for all products in the Commerce Manager.

## Running Unit Tests

Test data are provided in the `tests` directory.

1. To run all tests, run the following command:<br/> `mvn clean install -Dcucumber.options="--tags @smoketest"`<br/>
2. To run sanity t, run the following command:<br/>`@sanity`<br/>

### Maven Options to Run the Unit Tests
|  Option| Description|
|--|--|
|`-Dcucumber.options="--tags @smoketest"`|Specifies that you can replace the tag with a tag that you define.|
|`-Dfailsafe.fork.count="<no of testes>"`|Specifies the number of tests that can be run at the same time. The default value is 1. You can change this value depending on number of TestsIT classes. |
|`-Premote -Dremote.web.driver.url="<REMOTE DRIVER IP>"`|TSpecifies that the tests are executed using a remote VM. The remote.web.driver.url attribute specifies the URL of the remote VM. For example, `http://<IP_ADDRESS>:4444/wd/hub`.
    * **Note:** You must set up the selenium grid to use this feature.For more information, see [Selenium](https://www.seleniumhq.org/docs/07_selenium_grid.jsp) documentation.

### Running Subset of Tests
1.  In the `extensions/cm/ext-cm-modules/ext-system-tests/selenium/src/test/java/com/elasticpath/cucumber/` module, right-click a TestsIT class and click Run.
You can create your own local runner class to run your own tagged tests. For example, RunLocalTestsIT.java runs your own tagged tests at local.
    **Note**  Do not commit the local runner class and tags that are only for the local testing purpose.

### Updating browser driver versions*

1. Download the latest browser driver and update the `extensions/cm/ext-cm-modules/ext-system-tests/selenium/src/test/resources/RepositoryMap.xml` file with the driver version.
2. Update the `RepositoryMap.xml`  with the bash value of the browser driver.
    - To get the bash values, run the `openssl sha1 <filename>` command.
      The <filename> specifies the <filelocation> in the `RepositoryMap.xml` file.
  For example, https://github.com/Ardesco/Selenium-Maven-Template/blob/master/src/test/resources/RepositoryMap.xml

## Jenkins Pipeline
The project includes a Jenkinsfile for a Scripted Pipeline. It builds a store docker image from this project, deploys it to AWS, and then runs the Unit Tests from this project. If using this pipeline, you'll need to create an EC2 instance for the pipeline to deploy your store + cortex.

**Configuring the pipeline**<br/>
Create a new Jenkins Pipeline and configure it with the following:
* Give your pipeline a name.
* Set the project to be parameterised and include the following parameters:
  * `DOCKER_REGISTRY_ADDRESS` - *Path to AWS ECR* ie: `${awsAccountID}.dkr.ecr.${region}.amazonaws.com`
  * `CORTEX_NAMESPACE` - *The namespace for your cortex images (activemq, batch, integration, search, cortex)*
  * `DOCKER_IMAGE_TAG` - *The tag used for your cortex images*
  * `STORE_NAMESPACE` - *The namespace for your store image and db image*
  * `STORE_IMAGE_TAG` - *The tag for your store images (store + db)*
  * `STORE_NAME` - *The name of the store in your data* ie: `vestri`
  * `EC2_INSTANCE_HOST` - *The ip of your EC2 host for deploying this pipeline*
  * `EC2_INSTANCE_USER` - *The user of your EC2 instance*
  * `EC2_INSTANCE_SSH_KEY` - *The path in Jenkins node to your ec2.pem file*
  * `SOLR_HOME_GIT_URL` - *The git url to your project containing your SOLR HOME Config*
  * `SOLR_HOME_BRANCH` - *The branch name for your SOLR HOME Config*
  * `SOLR_HOME_PATH` - *The path in your git project to your SOLR HOME Config*
* Set Build Triggers to **Poll SCM** and choose a schedule.
* Set Pipeline with the following:
  * **Definition** to *Pipeline script from SCM*
  * **SCM** to *Git*
  * **Repository URL** to your Repository for this project
  * **Branches to build** specifier to *\*/master*
  * **Script Path** to *Jenkinsfile*
* **Save** your configuration.<br/>

You now have a pipeline that triggers on commits to the master based on your chosen schedule. See **How it works** section for more on the logic to the pipeline.

**How it works**<br/>
The Stages:
* `SETUP` - The setup stage pulls from this project and the project containing SOLR HOME Config.
* `BUILD` - The build stage builds the store docker from the `docker/dev/Dockerfile` in this project and then pushes it to AWS.
  * The dev docker that is created uses an `entrypoint.sh` to replace the path to CORTEX and the STORE name in `ep.config.json` and then starts the project in dev mode using `npm start`.
* `UNDEPLOY_EXISTING` - The undeploy stage cleans up the working directory if it exists, and then remove any docker containers and images.
* `DEPLOY` - The deploy stage starts by creating the working directory, copying over files from this project, and copying over the SOLR HOME Config. Then, it exports the environment variables used in the compose file and deploys the store and cortex with docker-compose.
* `TEST` - The test stage sets environment variables for JAVA_HOME, and adds JAVA + MAVEN to the path. These are pulled from your Jenkins tools. This stage uses a script from [intoli](https://intoli.com/blog/installing-google-chrome-on-centos) for installing Google Chrome to use for headless tests. The script downloads `google-chrome-stable`. It is renamed to `google-chrome` so that chromedriver finds it for the tests. Before you run the tests, replace the `selenium.session.baseurl` in the `pom.xml`. The tests are run in a try-finally block so the cucumber reports are added even if one fails. This uses the Jenkins Cucumber Plugin for viewing reports in Jenkins UI.


## Contribution guide
* Contributions might be performed by developers at their choosing. Changes to this project must be reviewed and approved by an owner of this repository. <br/>
For more information about contributing, see [CONTRIBUTING.md](https://github.com/shaunmaharaj/ep-store/blob/master/CONTRIBUTING.md).<br/>

## License
[GPLv3 License](https://github.com/shaunmaharaj/ep-store/blob/master/LICENSE)
