---
layout: master
permalink: /documentation/tutorial_pages/
title: Tutorial Creating Pages
tutorial: true
weight: 8
---
# Tutorial: Creating Reference Storefront Pages and Components

### Requirements

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

In this section, [Extending React Reference Storefront](https://elasticpath.github.io/react-pwa-reference-storefront/documentation/extending/) is explained with an example.

1. Navigate to `src/containers` directory.<br>
2. Create a new folder.<br>
3. Name the directory. <br>
    **Note**: Ensure that the name of the container directory and components directory are the same as the correpsonding directories. For example, if the name of the page is `MyPage`, name the containter `MyPage`.<br>
4. Create a new `.jsx` file in the `src/containers/<PageName>` directory. <br>
    For example, `src/containers/MyPage/MyPage.jsx`.<br>
5. Populate the page with the required structure, copy the contents of an existing page to the new page.<br>
6. In the `src/components/routes.js` directory:<br>
  i)  Import the new page.<br>
  ii) Define the routing path for the page.<br>
7. In the `.jsx` file:<br>
  * To view the changes in the storefront, update the export settings with the page name.<br>
  * Add all required components and content.<br>
8. Add the required custom CSS in the `src/containers/<PageName>/<PageName>.less` directory. <br>
9. In the `src/components` directory, create a new component directory with the appropriate name.<br>
  **Note** Ensure that the name of the container directory and components directory are the same as the corresponding directories. For example, for the page `MyPage`, name the container `MyPage`.<br>
10. Create a new `.jsx` file in the `src/components/<componentName>` directory. <br> For example, `src/components/mycomponent.main.jsx`.<br>
11. Populate the file with the required structure, copy the contents of an existing component to the new component.<br>
12. Name the class of the component with the component name.<br>For example, if the component name is `ProductDisplayItemMain`, use the same name for the class.<br>
13. In the `.jsx` file of the component:<br>
  i)   To view changes in the storefront, update the export settings with the page name.<br>
  ii)  Add all required components and content.<br>
  iii) Import the component to other components or pages as required.<br>
14. Create and add any custom CSS in the `src/components/mycomponent.main.less` file.<br>
15. Import the custom CSS file (if created in the previous step) in the `src/components/mycomponent.main.jsx` file.
