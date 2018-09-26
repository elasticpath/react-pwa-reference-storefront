---
layout: master
permalink: /documentation/technologyoverview/
title: Technology
weight: 3
---
Technology
====================
The REACT Reference Storefront technologies were chosen for their robustness, popularity, and extensibility.
The idea is that your JavaScript developers and front-end developers already know these technologies, so they can start extending and customizing your storefront quickly.

The Reference Storefront can be loaded by various clients - Tablet, Mobile, Desktop/Laptops. The design is for an open source Mobile PWA capable of local browser storage page caching, and persistent session management. The PWA is built using React.js, Bootstrap4, and Babel. Webpack and node.js will aid to serve up the application by means of a configurable web server.
<br/>

## Platform Architecture
Image TBA
<br/>

#### Presentation Layer
* Includes UI management capabilities using a modern UI framework
	- index.html - The front-end html document to be populated by our React pages & components
	- App.js - Contains imports for React components and lower layers
	- index.js - Contains imports for necessary frameworks and renders our App.js. Also registers our PWA service worker
	- CSS - Custom stylesheets and static page assets

#### Page Assets
* As the assets are served via a webserver, there is no direct connection to a CMS required for the OOTB implementation of the Reference Storefront, and therefore no synchronization of catalog data between the two.
* Includes static assets for PWA
	- Assets are served from within the web app
	- Catalog Images are retrieved from Amazon S3 based on sku naming conventions (configurable in ep.config.json)
	- As new products/skus are created in EP which require new catalog images, those images should be uploaded to the same S3 bucket used for the PWA
	- This approach may also be used for other marketing images and marketing spot related content if desired to serve custom landing pages for categories/products.

#### Route/Page Layer
* Responsible for routing browser requests to their subsequent pages
* routes.js - Contains routes and mappings to React pages (.jsx)
* Pages - Top-level pages responsible for loading required components per page
* Includes service worker created with Workbox to manage caching and PWA capabilities

#### Component Layer
* Components to be loaded within each page
* Components are created based on scoped functionality of the item intended to be interacted with or loaded

#### Web Server Layer
* node.js - A simple, lightweight web server implementation serving the React PWA
* Webpack - A module bundler for javascript used to take modules with dependencies and generate static assets for those modules

#### API Layer
* Cortex API
* The services being interacted with by the PWA
<br/><br/>

Technology Stack
---------------------

<table border="1" cellpadding="3" cellspacing="0" style="width: 80%; border: 1px solid #000000;">
<tbody>
<tr>
	<th align="center" valign="middle">Technology</th>
	<th align="center" valign="middle">Description</th>
	<th align="center" valign="middle">Version</th>
</tr>
<tr>
	<td><strong>React.js</strong></td>
	<td>JavaScript library for building a UI using components for single page applications</td>
	<td>16.4.1</td>
</tr>
<tr>
	<td><strong>Webpack</strong></td>
	<td>An open-source JavaScript module bundler. Webpack takes modules with dependencies and generates static assets representing those modules.</td>
	<td>4.16.0</td>
</tr>
<tr>
	<td><strong>jQuery</strong></td>
	<td>Fast, feature rich JavaScript library used for the base DOM abstraction layer.</td>
	<td>3.3.1</td>
</tr>
<tr>
	<td><strong>Babel</strong></td>
	<td>Javascript compiler</td>
	<td>6.26.3</td>
</tr>
<tr>
	<td><strong>Bootstrap.js</strong></td>
	<td>A free and open-source front-end framework for designing websites and web applications</td>
	<td>4.4.1</td>
</tr>
<tr>
	<td><strong>node.js</strong></td>
	<td>An open-source, cross-platform JavaScript run-time environment that executes JavaScript code server-side.</td>
	<td>8.11.2</td>
</tr>
<tr>
	<td><strong>Workbox</strong></td>
	<td>JavaScript Libraries for adding offline support to web apps</td>
	<td>3.4.1</td>
</tr>
</tbody>
</table>
<br/>

Testing Frameworks
---------------------

<table border="1" cellpadding="3" cellspacing="0" style="width: 80%; border: 1px solid #000000;">
<tbody>
<tr>
	<th align="center" valign="middle">Technology</th>
	<th align="center" valign="middle">Description</th>
	<th align="center" valign="middle">Version</th>
</tr>
<tr>
	<td><strong>Selenium</strong></td>
	<td>Framework for testing web applications using browser automation</td>
	<td>3.4.0</td>
</tr>
<tr>
	<td><strong>Cucumber</strong></td>
	<td>Runs automated acceptance tests written in a behaviour-driven development style.	</td>
	<td>1.2.5</td>
</tr>
</tbody>
</table>
<br/>

REACT Reference Storefront Code Structure
---------------------
![Cortex]({{ site.baseurl }}/documentation/img/directory_structure.png)
<br/><br/>

Platform Support
---------------------

<table border="1" cellpadding="3" cellspacing="0" style="width: 80%; border: 1px solid #000000;">
<tbody>
<tr align="center">
	<th align="center" valign="middle"></th>
	<th align="center" valign="middle">Certified*</th>
	<th align="center" valign="middle">Compatible**</th>
	<th align="center" valign="middle">Not Supported</th>
</tr>
<tr>
	<td><strong>Browsers</strong></td>
	<td>
		<ul>
			<li>IE 10+</li>
			<li>Chrome</li>
			<li>Safari</li>
		</ul>
	</td>
	<td>
		<ul>
			<li>Firefox</li>
		</ul>
	</td>
	<td></td>
</tr>
<tr>
	<td><strong>Devices</strong></td>
	<td>
		<ul>
			<li>Android tablets 10" &amp; 7"</li>
			<li>iOS tablest 10" &amp; 7"</li>
		</ul>
	</td>
	<td>
		<ul>
			<li>Android Phones</li>
			<li>iOS Phones</li>
		</ul>
	</td>
	<td>
		<ul>
			<li>Windows Tablets</li>
			<li>Windows Phones</li>
		</ul>
	</td>
</tr>
</tbody>
</table>

\*<b>Certified</b> - Officially Supported and Tested

\*\***Compatible** - Base functionality works, but is not tested.

{% include legal.html %}
