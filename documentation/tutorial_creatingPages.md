---
layout: master
permalink: /documentation/tutorial_pages/
title: Tutorial Creating Pages
tutorial: true
weight: 8
---
# Tutorial: Create Reference Storefront Pages and Components

### Overview

This tutorial demonstrates how to create the pages and components for a React PWA Reference Storefront. The React PWA Reference Storefront is composed of containers (pages) and React components. Each page in the storefront is composed of various components that fulfills the purpose of the page. For example, home, cart, categories, checkout, and registration are separate pages. Each page consists of various components, such as navigation, footer, product list, or products.

### Prerequisites
This tutorial requires an Elastic Path developer environment:

* Your own development environment
* An Elastic Path Training virtual machine

Ensure that you are familiar with the following third-party technologies:

* Git
* Node.js
* Visual Studio Code with the following extensions:
*   * Debugger for Chrome
*   * ESLint extension
* Javascript
* React

### Business Requirements

As a developer, I want to create pages and components for a React PWA Reference Storefront experience so my company can engage customers on multiple touchpoints, such as desktop, tablet and mobile devices.

### Reference Example

The goal of this tutorial is to create a Reference Storefront container and components for a **Terms and Conditions** page.

### Exercise

#### Step 1: Create New Containers in React

To create pages for the storefront, first you have to create containers as a structure for the pages.

1. From the command line, navigate to the `src/containers` directory. Create a new folder for the page.
2. Name the directory. <br>**Note**: Ensure that the name of the directory and the correpsonding page are the same. For example, if the name of the page is `MyPage`, name the containter `MyPage`.
3. In the `src/containers/<PageName>` directory, create a new `.jsx` file for the page. For example, `src/containers/MyPage/MyPage.jsx`.
4. Copy the contents of an existing page to the new page to populate the page with the required structure.
5. Name the class of the page with the page name.
6. In the `src/components/routes.js` directory:
    * Import the new page.
    * Define the desired routing path for the page.
7. In the `.jsx` file of the page:
  * Update the export settings of the page with the page name to view the changes in the storefront.
  * Add all required components and content for the page.
8. In the `src/containers/<PageName>/<PageName>.less` directory, add the required custom CSS.

#### Step 2: Create New Components in React

Create components so you have reusable pieces you can use in the storefront. For example, a component can be the navigation, footer, product list, or products.

1. In the `src/components` directory, create a new component for the page.
2. Name the directory. <br> Name of the directory and component must be the same. For example, `mycomponent`.
3. In the `src/components/<componentName>` directory, create a new `.jsx` file for the page. For example, `src/components/mycomponent.main.jsx`.
4. Copy the contents of an existing component to the new component to populate the component with the required structure.
5. Name the class of the component with the component name.
6. In the jsx file of the component:
* Update the export settings of the page with the component name to view the changes in the storefront.
* Add all required components and content for the component.
* Import the component to other components or pages as required.
7. In the `src/components/mycomponent.main.jsx` file, add the required custom CSS.
