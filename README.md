# Elastic Path's reference storefront in REACT.js

Reference storefront demonstrating usage of Cortex in a modern UI progressive web application.

## Development Quick-Start
Built with REACT.js, Bootstrap 4, Babel, and Webpack.

### Pre-req:
If you haven’t already, you’ll need to install the following software:
* Install [Git](https://git-scm.com/downloads)
* Install [Node.js](https://nodejs.org/en/download/)
* Install [Visual Studio Code](https://code.visualstudio.com/) from Microsoft and the following extensions:<br/>
    * [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)<br/>
    * [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)<br/>

### Configuration
##### `ep.config.json (options)`

 - `cortexApi.path`, **required**, *string*:
Path to the actual Cortex service location. Set to `http://localhost:9080/cortex` for local development.
 - `cortexApi.scope`, **required**, *string*:
Name of store to retreive data from Cortex.
 - `skuImagesS3Url`, **required**, *string*:
 Path to catalog images hosted on S3 bucket. Set this to the full URL of your S3 images, replacing the sku/file-name with the string `%sku%`. This value will be populated during pageload with values retreived by Cortex.

### Setup (Development):
1. Clone/pull this repo to a directory of your choosing
2. `cd ep-store`
3. run `npm install` to install dependencies
4. Configure `./src/ep.config.json` as required for your environment: [here](#configuration)
5. run `npm start` to start the server in development node
6. navigate to `http://localhost:8080/` to see the running PWA

### Setup (Production):
1. Clone/pull this repo to a directory of your choosing
2. `cd ep-store`
3. run `npm install` to install dependencies
4. Configure `./src/ep.config.json` as required for your environment: [here](#configuration)
5. run `npm run start-prod` to start the server in production node
6. navigate to `http://localhost:8080/` to see the running PWA

### Linting
This project has been set up with ESLint as our linting utility.<br/>
If you'd like to learn a bit more about ESLint check out their [documentation](https://eslint.org/)<br/>
We're currently extending Airbnbs’ ESLint configuration because at this time the Airbnb Code Style and the according ESLint configuration are very popular and well accepted by developers.<br/>
You can check out the style guide on [github](https://github.com/airbnb/javascript)<br/>
* ESLint loader has been added to `webpack.config.dev.js` so it runs when you start the app in development mode.
* To run the linter from your commandline first go to the project root directory and run the following command:
    * `./node_modules/.bin/eslint --ext .js --ext .jsx [file|dir|glob]`
        * Run on entire project: `./node_modules/.bin/eslint --ext .js --ext .jsx .`
* With the ESLint extension for Visual Studio Code you'll get feedback while you're writing the code under the `Problems` View 

If you plan to check in your code, make sure to fix all your linting errors first!

## Unit Tests (TBA)
* Test json data can be found in `tests`
* run `npm test` to run tests

## Contribution Guide
* Contributions may be performed by developers at their choosing. Changes to this project must be reviewed and approved by an owner of this repository <br/>
See [CONTRIBUTING.md](https://github.com/shaunmaharaj/ep-store/blob/master/CONTRIBUTING.md)<br/>

## License
[EP Labs License](https://github.com/shaunmaharaj/ep-store/blob/master/EP_LICENSE)<br/>
[Apache License](https://github.com/shaunmaharaj/ep-store/blob/master/LICENSE)
