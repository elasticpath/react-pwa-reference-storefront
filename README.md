# Elastic Path's reference storefront in REACT.js

Reference storefront demonstrating usage of Cortex in a modern UI progressive web application.

## Development Quick-Start
Built with REACT.js, Bootstrap 4, and Webpack.

### Pre-req:
If you haven’t already, you’ll need to install the following software:
* Install [Git](https://git-scm.com/downloads)
* Install [Node.js](https://nodejs.org/en/download/)
* Install [Visual Studio Code](https://code.visualstudio.com/) from Microsoft and the [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) extension from Microsoft.

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

## Unit Tests (TBA)
* Test json data can be found in `tests`
* run `npm test` to run tests

## Contribution Guide (TBA)
* You may contribute to this repo by opening a pull request

## License
[EP Labs License](https://github.com/shaunmaharaj/ep-store/blob/master/EP_LICENSE)<br/>
[Apache License](https://github.com/shaunmaharaj/ep-store/blob/master/LICENSE)