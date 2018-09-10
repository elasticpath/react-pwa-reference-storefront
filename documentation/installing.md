---
layout: master
permalink: /documentation/installing/
title: Installing
weight: 2
---
Installing and Running
====================
The HTML5 Reference Storefront requires the following installed:

<ul>
<li><a href="http://git-scm.com/downloads" target="_blank">GIT Client <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
<li><a href="http://nodejs.org/" target="_blank">Node.js <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
</ul>

Once those are installed, proceed to [Install HTML5 Reference Storefront Sources](#installing-html5-reference-storefront-sources) and then run the Storefront either
**[locally](#running-html5-reference-storefront-locally)** or **[remotely](#running-html5-reference-storefront-remotely)**.

### <a name="installing-html5-reference-storefront-sources"> </a> Installing HTML5 Reference Storefront Sources
1. Fetch HTML5 Reference Storefront sources:   
`{{ site.repository }}`
2. Install the Storefront's dependencies by navigating to HTML5 Reference Storefront directory and running:   
`npm install`

### <a name="running-html5-reference-storefront-locally"> </a>Running HTML5 Reference Storefront Locally
Running locally means all your applications, Cortex API, Search, HTML5 Storefront, etc, are running on your local computer on these ports:

<ul>
<li><a href="https://docs.elasticpath.com/display/EPCAPIDEV/Installation+and+Configuration+Guide" target="_blank">Cortex API <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>9080</code></li>
<li><a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Search Server <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>8080</code></li>
<li><a href="http://nodejs.org/" target="_blank">node.js <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>3008</code></li>
<li><a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Commerce Engine <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
</ul>

![localSetup]({{ site.baseurl }}/documentation/img/local_proxy_setup.png)

**To run locally:**

* **Set the Cortex end-point configuration to point to your local Cortex instance**

  * Open `ui-storefront/Gruntfile.js` and change the `CORTEX_HOST`, `CORTEX_PORT` variables as follows:

        var CORTEX_HOST = 'localhost';
        var CORTEX_PORT = '9080';

* **Start the app**

  * Open a command line, navigate to your HTML5 Storefront directory, and run   
    `grunt start`

* **Access HTML5 Reference Storefront**

  * Open your browser and navigate to   
    `localhost:3007/html5storefront/`

### <a name="running-html5-reference-storefront-remotely"> </a>Running HTML5 Reference Storefront Remotely
Running remotely means your HTML5 Reference Storefront runs locally on port `3008`, but Cortex API, Search, Commerce Engine, etc, run on an external server.
When running remotely, we expect your Cortex API is using Elastic Path Integrator, see [http://docs.elasticpath.com](http://docs.elasticpath.com) for more information on Integrator.

![localSetup]({{ site.baseurl }}/documentation/img/remote_proxy_setup.png)

**To run remotely:**

* **Set the Cortex end-point configuration to point to a remote Cortex instance**

  * Open `ui-storefront/Gruntfile.js` and change the `CORTEX_HOST`, `CORTEX_PORT` variables as follows:

          var CORTEX_HOST = '54.213.124.208';
          var CORTEX_PORT = '8080';

  * **Start the app**

    * Open a command line, navigate to your HTML5 Storefront directory, and run   
    `grunt start`

  * **Access HTML5 Reference Storefront**

    * Open your browser and navigate to   
    `localhost:3007/html5storefront/`

{% include legal.html %}