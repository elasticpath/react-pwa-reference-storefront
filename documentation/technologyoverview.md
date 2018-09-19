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

## <a name="platformArchitecture"> </a> Platform Architecture
![codeStructure]({{ site.baseurl  }}/documentation/img/architecture.png)

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
	<td><strong><a href="http://marionettejs.com/">Marionette.js</a></strong></td>
	<td>A JavaScript library extending Backbone.js, which manages the REACT Reference Storefront views.
	Provides common design and implementation patterns for the Storefront.</td>
	<td>v1.0.0-rc6</td>
</tr>
<tr>
	<td><strong><a href="http://requirejs.org/">Require.js</a></strong></td>
	<td>A JavaScript library facilitating asynchronous module definition <a href="http://en.wikipedia.org/wiki/Asynchronous_module_definition">(AMD)</a> .
	</td>
	<td>2.0</td>
</tr>
<tr>
	<td><strong><a href="http://jquery.com/">jQuery</a></strong></td>
	<td>A fast, feature rich JavaScript library used for the base DOM abstraction layer.</td>
	<td>1.8</td>
</tr>
<tr>
	<td><strong><a href="http://underscorejs.org/">underscore.js</a></strong></td>
	<td>A lightweight JavaScript utility and template framework.</td>
	<td>1.4.4</td>
</tr>
<tr>
	<td><strong><a href="http://backbonejs.org/">Backbone.js</a></strong></td>
	<td>
		<p>The foundation UI framework. Provides the core UI elements such as Models, Views, and Events.</p>
	</td>
	<td>1.0.0</td>
</tr>
<tr>
	<td><strong><a href="http://nodejs.org/">node.js</a></strong></td>
	<td>A simple, lightweight web server implementation, acting as a proxy server to facilitate <em>cross-domain</em> communication with the Cortex API.</td>
	<td>0.8.x</td>
</tr>
<tr>
	<td><strong><a href="http://gruntjs.com/">grunt.js</a></strong></td>
	<td>
		<p>A build and configuration tool.</p>
	</td>
	<td>0.4.x</td>
</tr>
<tr>
	<td><strong><a href="http://lesscss.org/">{less}</a></strong></td>
	<td>
		<p>Extends the CSS with dynamic behavior, utilizing variables, mixins, operations, and functions.</p>
	</td>
	<td>1.3.3</td>
</tr>
</tbody>
</table>

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
	<td><strong><a href="http://visionmedia.github.io/mocha/">Mocha</a></strong></td>
	<td>The JavaScript test framework running on node.js.</td>
	<td>1.10.0</td>
</tr>
<tr>
	<td><strong><a href="http://chaijs.com/">Chai</a></strong></td>
	<td>The assertion library for node.js.</td>
	<td>1.6.1</td>
</tr>
<tr>
	<td><strong><a href="http://www.seleniumhq.org/projects/webdriver/">Selenium</a></strong></td>
	<td>An automated browser component testing.</td>
	<td>2.35.0</td>
</tr>
<tr>
	<td><strong><a href="http://sinonjs.org/">Sinon.JS</a></strong></td>
	<td>A standalone test framework for JavaScript unit testing.</td>
	<td>1.7.3</td>
</tr>
</tbody>
</table>

REACT Reference Storefront Code Structure
---------------------
![codeStructure]({{ site.baseurl  }}/documentation/img/fileStructure.png)

Platform Support
---------------------

<table>
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
