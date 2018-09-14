---
layout: master
permalink: /documentation/installing/
title: Installing
weight: 2
---
Installing and Running
====================

To get started using the REACT Reference Storefront, select the how you want to install your instance, either locally or remotely. The prerequisites are the same for both local and remote instances.

### Prerequisites

The REACT Reference Storefront requires the following applications before you can install the instance:

<ul>
<li><a href="http://git-scm.com/downloads" target="_blank">GIT Client <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
<li><a href="http://nodejs.org/" target="_blank">Node.js <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
</ul>

When the prerequisites are installed, proceed to [Install REACT Reference Storefront Sources](#installing-react-reference-storefront-sources). You can run the Storefront either
**[locally](#running-react-reference-storefront-locally)** or **[remotely](#running-react-reference-storefront-remotely)**.

### <a name="installing-react-reference-storefront-sources"> </a> Install the REACT Reference Storefront Sources
1. Navigate to the REACT Reference Storefront sources. Go to
`{{ site.repository }}`.
2. Install the dependencies by navigating to the REACT Reference Storefront directory. Run
`npm install`.

### <a name="running-react-reference-storefront-locally"> </a>Local REACT Reference Storefront instance
To use the REACT Reference Storefront locally, run all of your applications, Cortex API, Search, Storefront, etc., on your local computer. Use these ports to run the REACT Reference Storefront locally:

<ul>
<li><a href="https://docs.elasticpath.com/display/EPCAPIDEV/Installation+and+Configuration+Guide" target="_blank">Cortex API <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>9080</code></li>
<li><a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Search Server <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>8080</code></li>
<li><a href="http://nodejs.org/" target="_blank">node.js <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>3008</code></li>
<li><a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Commerce Engine <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
</ul>

![localSetup]({{ site.baseurl }}/documentation/img/local_proxy_setup.png)

**To Run Locally:**

* **Set the Cortex End-point Configuration to Point to your local Cortex Instance.**

  * Open `ui-storefront/Gruntfile.js`.
  * Change the `CORTEX_HOST` and `CORTEX_PORT` variables:

        var CORTEX_HOST = 'localhost';
        var CORTEX_PORT = '9080';

* **Start the Application.**

  * Open a command line and navigate to your Storefront directory.
  * Run `grunt start`.

* **Access REACT Reference Storefront.**

  * Open your browser and navigate to
    `localhost:8080/`.

### <a name="running-react-reference-storefront-remotely"> </a>Remote REACT Reference Storefront Instance
The remote REACT Reference Storefront instance runs locally on port `8080`. Cortex API, Search, Commerce Engine, etc, run on an external server.
Use these ports to run the REACT Reference Storefront locally:
**Note:** When you run the instance remotely, it's assumed your Cortex API uses Elastic Path Integrator. For more information on the Elastic Path Integrator, see [http://docs.elasticpath.com](http://docs.elasticpath.com).

![localSetup]({{ site.baseurl }}/documentation/img/remote_proxy_setup.png)

**To Run Remotely:**

* **Set the Cortex End-point Configuration to Point to a Remote Cortex Instance.**

  * Open `ui-storefront/Gruntfile.js`.
  * Change the `CORTEX_HOST` and `CORTEX_PORT` variables:

          var CORTEX_HOST = '54.213.124.208';
          var CORTEX_PORT = '8080';

  * **Start the Application.**

    * Open a command line, navigate to your Storefront directory.
    * Run `grunt start`.

  * **Access REACT Reference Storefront.**

    * Open your browser and navigate to
    `localhost:8080/`.

{% include legal.html %}
