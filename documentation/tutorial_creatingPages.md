---
layout: master
permalink: /documentation/tutorial_pages/
title: Tutorial Creating Pages
tutorial: true
weight: 8
---
# Tutorial: Creating Reference Storefront Pages and Components

### Requirements

This tutorial requires:
* A development environment
* An Elastic Path training virtual machine

### Prerequisites

Ensure that you are familiar with the following third-party technologies:
* Git
* Node.js
* Visual Studio Code with the following extensions:
  * Debugger for Chrome
  * ESLint extension
* Javascript
* React

### Example

1. Create new containers in React.<br>
  a) Navigate to `src/containers` directory.<br>
  b) Create a new folder.<br>
  c) Name the directory. <br>
      **Note**: Ensure that the name of the directory and the correpsonding page are the same. For example, if the name of the page is `MyPage`, name the containter `MyPage`.<br>
  d) Create a new `.jsx` file in the `src/containers/<PageName>` directory. <br> 
      For example, `src/containers/MyPage/MyPage.jsx`.<br>
  e) To populate the page with the required structure, copy the contents of an existing page to the new page.<br>
  f) In the `src/components/routes.js` directory:<br>
    i)  Import the new page.<br>
    ii) Define the routing path for the page.<br>
  g) In the `.jsx` file:<br>
    * To view the changes in the storefront, update the export settings with the page name.<br>
    * Add all required components and content.<br>
  h) Add the required custom CSS in the `src/containers/<PageName>/<PageName>.less` directory. <br>
  <br>
2. Create new components in React.<br>
  a) In the `src/components` directory, create a new component directory with the appropriate name.<br>
  Name of the directory and component must be the same. For example, `mycomponent`.<br>
  b) Create a new `.jsx` file in the `src/components/<componentName>` directory. <br> For example, `src/components/mycomponent.main.jsx`.<br>
  d) To populate the file with the required structure, copy the contents of an existing component to the new component.<br>
  e) Name the class of the component with the component name.<br>
  f) In the `.jsx` file of the component:<br>
    i)  To view changes in the storefront, update the export settings with the page name.<br>
    ii)  Add all required components and content.<br>
    iii) Import the component to other components or pages as required.<br>
  g) Add the required custom CSS in the `src/components/mycomponent.main.jsx` file.