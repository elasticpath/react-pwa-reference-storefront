# REACT PWA Reference Storefront Quick Start Guide

## Table of Contents

  * React PWA Reference Storefront
      * [Documentation Introduction](#documentation-introduction)
      * [Related Resources](#related-resources)
  * [Overview](#overview)
  * [Setting up the Storefront](#setting-up-the-storefront)
      * [Prerequisites](#prerequisites)
      * [Configuration Parameter Descriptions](#configuration#parameter#descriptions)
      * [Configuring Sample Data](#configuring-sample-data)
      * [Setting up a Development Environment](#setting-up-a-development-environment)
      * [Setting up a Production Environment](#setting-up-a-production-environment)
      * [Setting up a Remote Production Environment](#setting-up-a-remote-production-environment)
  * [Running a Linter](#running-a-linter)
  * [Adding New Locales](#adding-new-locales)
  * [Running Unit Tests](#running-unit-tests)
      * [Maven Options to Run the Unit Tests](#maven-options-to-run-the-unit-tests)
      * [Running Subset of Tests](#running#subset#of#tests)
      * [Updating Browser Driver Versions](#updating-browser-driver-versions)
  * [Configuring Jenkins Pipeline](#configuring#jenkins#pipeline)
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
- [REACT PWA Reference Storefront Installation Guide](https://elasticpath.github.io/react-pwa-reference-storefront/)
- [Requirements and Specifications](https://elasticpath.github.io/react-pwa-reference-storefront/documentation/technologyoverview/)

## Overview

The REACT PWA Reference Storefront is a flexible e-commerce website built on Elastic Path’s RESTful e-commerce API, Cortex API. Through the Cortex API, the storefront uses the e-commerce capabilities provided by Elastic Path Commerce and gets data in a RESTful manner. For more information about the storefront, see [REACT PWA Reference Storefront documentation](https://elasticpath.github.io/react-pwa-reference-storefront/).

The Storefront is designed as an open source mobile Progressive Web Application (PWA) that has the capabilities for local browser storage page caching and persistent session management. This PWA is built using the ['React.js'](https://reactjs.org/), [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/), and [Babel](https://babeljs.io/) technologies. [Webpack](https://webpack.js.org/) and [node.js](https://nodejs.org/en/) enable the application layer interactions through the configurable web server. For more information about the software requirements, see the [Requirements and Specifications](https://elasticpath.github.io/react-pwa-reference-storefront/documentation/technologyoverview/) section.

## Setting up the Storefront

### Prerequisites

Ensure that the following software are installed:

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:<br/>
    * [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)<br/>
    * [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)<br/>
* [Java JDK 8] (http://www.oracle.com/technetwork/java/javase/downloads/java-archive-javase8-2177648.html)(for unit testing, optional)
* [Maven 3.5.2] (https://archive.apache.org/dist/maven/maven-3/3.5.2/binaries/)(for unit testing, optional)
* [IntelliJ IDEA] (https://www.jetbrains.com/idea/)(for unit testing, optional)
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
|`gaTrackingId`| Optional| String| The Google Analytics tracking ID to integrate with Google Analytics Suite to track enhanced e-commerce activity on the site.|

### Configuring Sample Data

Elastic Path provides a set of sample data with the storefront project.<br/> **Note:** A valid Elastic Path development environment is required to access the sample data.

1. From the `ep-store/data` directory, extract the sample catalog data contents into the `ep-commerce/extensions/database/ext-data/src/main/resources/data` directory.
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
5. To start the server in development mode, run the `npm start` command.
6. To see the running Progressive Web Application (PWA), navigate to `http://localhost:8080/` .

### Setting up a Production Environment

1. Clone or pull the `react-pwa-reference-storefront` repository to your directory.
2. Run the `cd react-pwa-reference-storefront` command.
3. Run the `docker build -t ep-store -f ./docker/prod/Dockerfile` command.
4. Push the `ep-store` image to the docker repository.

### Setting up a Remote Production Environment

1. Pull the `ep-store` repository from your docker repository.
2. In the repository, navigate to the `docker/prod/` directory.
3. Copy the `docker-compose.yaml` and `nginx.conf` files to a folder on the remote host.
4. Replace the `$CORTEX_URL` parameter in the `nginx.conf` file with a Cortex server URL.
5. Replace the `$DOCKER_REPO` parameter in the `docker-compose.yaml` file with `ep-store`.
5. Run the `docker-compose up -d` command.

## Running a Linter

The storefront project is set up with the linting utility, [ESLint](https://eslint.org/). For the storefront project, Elastic Path uses and extends the ESLint configuration provided by Airbnb. For more information on the style guide, see the [Airbnb GitHub](https://github.com/airbnb/javascript) page.<br/>
By default, the ESLint loader is added to the `webpack.config.dev.js` file. When you start the application in the development mode, the ESLint loader automatically runs.
1. To run the linter from the command line, navigate to the project root directory.
2. Run the following command:
    `./node_modules/.bin/eslint --ext .js --ext .jsx [file|dir|glob]`
3. Run the following command for the entire project:
 `./node_modules/.bin/eslint --ext .js --ext .jsx `
With the ESLint extension for Visual Studio Code, you can view feedback when you write the code in the `Problems` view.

**Note:** When you check in the code, ensure that all linting errors are resolved.

## Adding New Locales

The reference storefront supports multiple languages and currencies. Add all front-end textual data in the `localization/en-CA.json` file as a resource string. By default,  `en-CA` and `fr-FR` locales are provided in the project.

1. For development purpose, run:<br/> `node tools/translate.js`.<br/>This runs a pseudo translation from `en-CA` locale to `fr-FR`.
2. To add a new locale, add an entry to the `supportedLocales` array in the `ep.config.json` file and add an appropriate `.json` file to the `localization` folder.
3. Configure the language and currency for all products in Commerce Manager.

## Running Unit Tests

Test data are provided in the `tests` directory.

1. To run all tests, run the following command:<br/> `mvn clean install -Dcucumber.options="--tags @smoketest"`<br/>
2. To run sanity test, run the following command:<br/>`mvn clean install -Dcucumber.options="--tags @sanity`<br/>

### Maven Options to Run the Unit Tests

|  Option| Description|
|--|--|
|`-Dcucumber.options="--tags @smoketest"`| Specifies that you can replace the tag with a tag that you define.|
|`-Dfailsafe.fork.count="<no of testes>"`| Specifies the number of tests that can be run at the same time. The default value is 1. You can change this value depending on number of TestsIT classes. |
|`-Premote -Dremote.web.driver.url="<REMOTE DRIVER IP>"`| Specifies that the tests are executed using a remote VM. The `remote.web.driver.url` attribute specifies the URL of the remote VM. For example, `http://<IP_ADDRESS>:4444/wd/hub`.

**Note:** You must set up the selenium grid to use this feature.For more information, see [Selenium](https://www.seleniumhq.org/docs/07_selenium_grid.jsp) documentation.

### Running Subset of Tests
1.  In the `/selenium/src/test/java/com/elasticpath/cucumber/` module, right-click a TestsIT class and click **Run**.
You can create your own local runner class to run your own tagged tests. For example, `RunLocalTestsIT.java` runs your own tagged tests at local.
    **Note**  Do not commit the local runner class and tags that are only for the local testing purpose.

### Updating browser driver versions

1. Download the latest browser driver and update the `/selenium/src/test/resources/RepositoryMap.xml` file with the driver version.
2. Update the `RepositoryMap.xml`  with the bash value of the browser driver:
    - To get the bash values, run the `openssl sha1 <filename>` command.
      The <filename> specifies the <filelocation> in the `RepositoryMap.xml` file.
  For example, https://github.com/Ardesco/Selenium-Maven-Template/blob/master/src/test/resources/RepositoryMap.xml


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
* `TEST` - Sets the environment variables for JAVA_HOME and adds Java and Maven to the path. The variables are pulled from the Jenkins tools. For headless tests, installs Google Chrome by running the script at [intoli](https://intoli.com/blog/installing-google-chrome-on-centos) and downloading `google-chrome-stable` and renames it to `google-chrome` to enable chromedriver to find it for tests. Before you run the tests, replace the `selenium.session.baseurl` in the `pom.xml`. For viewing reports in Jenkins UI, Jenkins Cucumber plugin is used.

## Terms And Conditions

- Any changes to this project must be reviewed and approved by the repository owner. For more information about contributing, see the [Contribution Guide](https://github.com/elasticpath/react-pwa-reference-storefront/blob/master/CONTRIBUTING.md).
- For more information about the license, see [GPLv3 License](https://github.com/elasticpath/react-pwa-reference-storefront/blob/master/LICENSE).
