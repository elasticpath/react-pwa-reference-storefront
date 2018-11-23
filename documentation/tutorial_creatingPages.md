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

**Warning**:<br/>
  Ensure that the name of the container directory and components directory are the same as the corresponding directories. For example, if the name of the page is `MyPage`, name the container `MyPage`.<br>

1. Navigate to `src/containers` directory.<br>
2. Create a new directory with appropriate name.<br>
3. In the `src/containers/<PageName>` directory, create a new `.jsx` file. <br>
    For example, `src/containers/MyPage/MyPage.jsx`.<br>
4. Populate the page with the required structure by copying the contents of an existing page to the new page.<br>
5. In the `src/components/routes.js` directory:<br>
   a. Import the new page.<br>
   b. Define the routing path for the page.<br>
6. In the `.jsx` file:<br>
   a. To view the changes in the storefront, update the export settings with the page name.<br>
   b. Add all required components and content.<br>
7. In the `src/containers/<PageName>/<PageName>.less` directory, add the required custom CSS. <br>
8. In the `src/components` directory, create a new component directory with the appropriate name.<br>
9. In the `src/components/<componentName>` directory, create a new `.jsx` file. <br> For example, `src/components/mycomponent.main.jsx`.<br>
10. Populate the file with the required structure by copying the contents of an existing component to the new component.<br>
11. Name the class of the component with the component name.<br>For example, for `ProductDisplayItemMain` component, class name is `ProductDisplayItemMain`.<br>
13. In the `.jsx` file:<br>
    a. To view changes in the storefront, update the export settings with the page name.<br>
    b. Add all required components and content.<br>
    c. Import the component to other components or pages as required.<br>
14. In the `src/components/mycomponent.main.less` file, create custom CSS, if any.<br>
15. In the `src/components/mycomponent.main.jsx` file, import the custom CSS file, if any.
