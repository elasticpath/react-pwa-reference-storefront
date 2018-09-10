---
layout: master
permalink: /documentation/extending/
title: Customize
weight: 4
---
Customizing Features
====================
REACT Reference Storefront functionality is divided into modules. For example, profile, cart, authentication, checkout, and so on are all separate modules.
An HTML5 Storefront module is the view, plus the code backing the view. This means that each module is its own Model View Controller (MVC) component.
For example, the profile module contains all code to retrieve and update a customer's profile data (Model and Controller) and contains the HTML and JS code to show the customer's profile data in the Storefront (View).

HTML5 Storefront's Modular Design Benefits:
* Customizable - Add a new feature by creating a new module and adding it to the `module` folder, as opposed to modifying multiple pieces of code throughout the Storefront to create the functionality.
* Maintainable - The Storefront's modular architecture enables you to make changes, i.e. add new functionality and enhance existing functionality, without breaking the entire system.
* Debuggable - Debug individual modules to isolate HTML5 Storefront issues, rather than debugging vast amounts of JS code.
* Updatable - The REACT Reference Storefront is under continual development. With your customized features and enhancements coded in distinct modules, you can more easily update the out-of-the-box code without overwriting your custom code.

**REACT Reference Storefront Modules**

![List of Modules]({{ site.baseurl }}/documentation/img/modulesList.png)

**Components vs Modules**

You'll notice the `modules` folder also contains a `components` folder.
Components are very similar to modules, but their purpose is slightly different. Modules are complete, stand-alone units of functionality, which include a Model, View, and Controller.
Components are units of code that are designed for reuse in other modules. In most cases, components just contain the View and the Controller, not the Model, which is passed to it by the module using the component.
For example, the `address` component provides the Controller and View to create, retrieve, and view customer addresses.
`address` is reused in the `profile` and `receipt` modules to allow customers to create, update, and view their addresses through these module's views.

**Module Creation Guidelines**

We don't have any hard and fast rules for when to create a module, we just have guidelines. You need to determine whether or not to create a new module for
the functionality you are building based on your needs.

Keep in mind Elastic Path's Guidelines for Creating New Modules:

- **Base the module around a view**
We base our modules around views. For example, the `cart` module contains the complete view of the cart, including the cart's lineitems, costs of the cart's contents, total quantity in the cart, and so on.
Designing the module around a view helps you encapsulate HTML5 Storefront functionality.
- **Design the module to be self-contained**
We design our modules so they are complete units of functionality. This means all the functionality for a given feature is encapsulated in the module.
For example, all the profiles functionality, view profile, update profile, and so on is defined in the `profile` module.
This may seem kind of obvious, but we're mentioning it as a reminder for you to try and keep your code modularized. The REACT Reference Storefront is on a rapid-release schedule, meaning that the code is frequently updated.
If your customized code is all over the place, you will have issues upgrading your code base.

## <a name="module-basics"> </a> Module Basics

This section provides an overview of the basic components for a Storefront module using our template module, found in `modules/_templates`, as an example.

**NOTE:** Some of the Cortex API concepts used in the modules, Zoom, Cortex Resources, URIs, Forms, Selectors, ?followLocation, and others are described in the <a href="http://api-cortex-developers.docs.elasticpath.com/drupal/">Cortex API Client Developer Documentation</a>

*Module Components*

![templateModule]({{ site.baseurl  }}/documentation/img/profileModule.png)

**tmpl.controller.js**

The controller orchestrates the creation and population of the module's view and model. The following lists the standard tasks performed by a Storefront module's controller:

* Loads the module's dependencies
* Imports the module's Model and View
* Executes the model's fetch to populate the model's data
* Sets the module's views
* Creates a namespace for the model for reference in the module's template.html
* Sets the model's listeners (if any)

		define(function (require) {
		    var ep = require('ep');                 // import global app functions and variables
		    var EventBus = require('eventbus');     // import event-bus communicating within module
		    var Mediator = require('mediator');     // import global event-bus mediating communication between modules

		    var pace = require('pace');             // import activity indicator function

		    // import the module's model, view and template
		    var Model = require('modules/_template/tmpl.models');
		    var View = require('modules/_template/tmpl.views');
		    var template = require('text!modules/base/_template/base.tmpl.templates.html');

		    // Inject the template into TemplateContainer for the module's views to reference
		    $('#TemplateContainer').append(template);

		    // Create a namespace for the template to reference the model and the viewHelpers
		    _.templateSettings.variable = 'E';

		    /**
		     * Renders the DefaultLayout of template module and fetches the model from the backend.
		     * Upon successfully fetching the model, the views are rendered in the designated regions.
		     */
		    var defaultView = function(){

		        //instantiate the module's View and Model
		        var defaultLayout = new View.DefaultLayout();
		        var templateModel = new Model.TmplModel();

		        //Fetch is a Backbone.Model functionality.
		        //Fetch resets the model's state and retrieves data from Cortex API using an jQuery jqXHR Object.
		        templateModel.fetch({

		            //on success, do something with the retrieved data, like render a view, set values, and so on
		            success: function (response) {
		            },
		            //account for error conditions
		            error: function (response) {
		            }
		        });
		    };

		    return {
		      DefaultView:defaultView
		    };
		  }
		);

**tmpl.models.js**

The model represents a set of Cortex API data and contains the logic to Create Read Update and Delete the data.
Models extend Backbone.model.
[Backbone.Model](http://backbonejs.org/#Model) provides a basic set of functionality for managing changes in your models, such as `Backbone.model.fetch`.
 `fetch` uses the model's `url:`'s parameters to determine where the model's data is located.
The module's controller calls `fetch` when the model is instantiated.

`base.cortex.controller.js`

	define(function (require) {
	    var Backbone = require('backbone');
	    var ModelHelper = require('modelHelpers');

	    // Array of zoom parameters to pass to Cortex
	    var zoomArray = [
	      'addresses:element',
	      'paymentmethods:element'
	    ];

	    var tmplModel = Backbone.Model.extend({
	      // url to READ data from cortex, includes the zoom
	      // ep.app.config.cortexApi.path   prefix contex path to request to Cortex (e.g. integrator, cortex), configured in ep.config.json,
	      // ep.app.config.cortexApi.scope  store scope (e.g. mobee, telcooperative), configured in ep.config.json,
	      url: ep.io.getApiContext() + '/CORTEX_RESOURCE_NAME/' + ep.app.config.cortexApi.scope + '/default?zoom=' + zoomArray.join(),

	      parse: function (response) {
	        // parsing the raw JSON data from Cortex using JSONPath and set your model values
	       var tmplObj = {
	           data: undefined
	       };
	          if(response)
	          {
	              tmplObj.propertyName = jsonPath(response, 'propertyName')[0];
	          }
	          //log the error
	          else {
	              ep.logger.error("tmpl model wasn't able to fetch valid data for parsing.");
	          }

	          //return the object
	          return tmplObj;
	      }
	    });

	    /**
	     * Collection of helper functions to parse the model.
	     * @type Object collection of modelHelper functions
	     */
	    var modelHelpers = ModelHelper.extend({});

	    //return the model
	    return {
	      TmplModel: tmplModel
	    };
	  }
	);

**base.profile.views.js**

A view defines the regions where the model's data will render. To better understand what regions are, think of the layout of an e-commerce web page. The login, search, title bar, and so on are all regions on the page.
Each region can be comprised of multiple subregions.
The data in the view's regions is populated by the module's model.

**NOTE:** A view defines the regions, not the Storefront's look and feel, which is defined in an HTML5 Storefront [Theme]({{ site.baseurl  }}/documentation/theming/).

A view's regions extend Marionette.Layout.
<a href="https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.layout.md">Marionette.layout</a> provides a set of functionality to define regions, nest layouts, render layouts, organize UI elements, and configure events for the region.

	define(function (require) {
	    var Marionette = require('marionette');
	    var ViewHelpers = require('viewHelpers');


	    /**
	     * Template helper functions
	     */
	    var viewHelpers = ViewHelpers.extend({});

	    var defaultLayout = Marionette.Layout.extend({
	      template:'#[tmpl]MainTemplate',
	      regions:{
	        templateRegion:'[data-region="ATemplateExampleRegion"]'
	      },
	      className:'container',
	      templateHelpers:viewHelpers
	    });


	    return {
	      DefaultLayout: defaultLayout
	    };
	  }
	);

**tmpl.templates.html**

Templates contain the view's regions whose data is populated by the module's model. `<%= E %>` is the model's namespace, from there you can access its values and view helpers.
Namespaces are defined in the module's controller.

	<div id="[tmpl]TemplateContainer">

	  <script type="text/template" id="[tmpl]MainTemplate">

	    <div class="[tmpl]-container" data-region="ATemplateExampleRegion"><%= E.propertyName %></div>

	  </script>

	</div>

Tutorial: Creating a New Module
---------------------
This tutorial walks you through the process of creating a REACT Reference Storefront module.
The basics concepts of how a module works are described in the section above, [Module Basics](#module-basics)
Please reference this section when building your modules.

To Create a New Module:

1. Create a new folder for your module in `public/modules`
2. Copy `tmpl.controller.js`, `tmpl.models.js`, `tmpl.templates.html`, and `tmpl.views.js` from `public/modules/_templates` and paste them into your new module's folder.
3. Rename your new module's files to the name of your module.
4. Define your modules is `public/main.js`, so RequireJS can handle and load your module when required.

	      var dependencies = config.baseDependencyConfig;
	      var basePaths = config.baseDependencyConfig.paths;
	      var extensionPaths = {
	                  'tmpl': 'modules/newModule/tmpl.controller.js',
	                  'tmpl.models': 'modules/newModule/tmpl.models.js',
	                  'tmpl.views': 'modules/newModule/tmpl.views.js',
	      };

5. Add your module to `public/router.js` to allow Marionette to route events to it.

	    var router = Marionette.AppRouter.extend({
	          appRoutes:{
	            '': 'index',
	            'home': 'index',
	            'category' : 'category',
	            ...
	            'newModule' : 'newModule'

6. Define the region where your module's view displays in `public/loadRegionContentEvents`.

	     var loadRegionContentEvents = {
	     ...
	         tmpl: function() {
	               EventBus.trigger('layout.loadRegionContentRequest',{
	                 region:'appMainRegion',
	                 module:'tmpl',
	                 view:'DefaultView'
	               });
	             },

The REACT Reference Storefront has 3 main regions:
![regions]({{ site.baseurl  }}/documentation/img/regions.png)
7. Code your module.

Further Reading
---------------------
Elastic Path uses third party technologies, which are not covered thoroughly in this document.
Below is a list of documents to further your education on these technologies.

* JSONPath - [http://goessner.net/articles/JsonPath/](http://goessner.net/articles/JsonPath/)
* Backbone Tutorials - [http://backbonetutorials.com/](http://backbonetutorials.com/)
* Backbone Documentation - [http://backbonejs.org/](http://backbonejs.org/)
* Backbone Marionette Documentation - [https://github.com/marionettejs/backbone.marionette](https://github.com/marionettejs/backbone.marionette)

{% include legal.html %}
