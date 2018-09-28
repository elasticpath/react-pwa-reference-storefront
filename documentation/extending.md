---
layout: master
permalink: /documentation/extending/
title: Customization
weight: 4
---
Customizing Features
====================

The Reference Storefront is divided into Containers (Pages) and React Components. For example, Home, Cart, Categories, Checkout, Registration, and so on are all separate Pages. Those pages consist of various components such as Navigation, Footer, Product List, Product, and so on. This means that each page is comprised of various components to accomplish the page's required purpose.

**Page/Component Creation Guidelines**

There are no concrete rules to creating a Page/Component. However, Elastic Path recommends the following guidelines to consume the reference storefront and to create new components and containers:


* **Base the Page as the page would be visited in the shoppers flow**
We base our pages as the full page a shopper visits in the storefront.
* **Design the components to be fragments of a page**
We design our components as individual units of functionality. This means all functionality for a component (including references to child components) are handled from within the actual component. Components may also accept properties/parameters to perform various actions if required. For example, a shopper navigates to a category page to list products. That category page contains a component responsible for displaying the products within the category, and that component contains a component for each of the products being displayed. The same component responsible for displaying products in a category view may be used to display products on the search results page as there are common elements of functionality between the two shopper flows.
Theming allows you to change the REACT Reference Storefront’s look and feel without having to modify the JavaScript. Themes take advantage of `{less}`, a powerful dynamic stylesheet language, chosen for its ease of use, dynamism, and widespread adoption.

Each theme is a set of individual `{less}` files. On demand, these files are compiled into a single `style.css`. The core theme’s `{less}` files are organized according to the views, which are output representations of the REACT Reference Storefront's features.
For example, `CartPage.less` contains the CSS for the cart’s container page, `cart.main.less` contains the CSS for the cart pages main component, and so on.

By modifying the `{less}` files you can change the Storefront’s look and feel, and create your own themes.
<br/><br/>

## Tutorial: Creating a New Container (Page)
This tutorial shows you the process of creating a Reference Storefront Page in REACT.

To Create a New Container:

1. Create a new folder for your page in `src/containers`.
2. Name the directory the name of your intended page, for example, `MyPage`.
3. Create a new jsx file for your page in the previously created directory, for example, `src/containers/MyPage.jsx`.
4. Copy the contents of any existing page to your newly created page to populate the page with the required structure.
5. Name the class of your page to the desired name of your page.
6. Within `src/components/routes.js`:
	* Import your newly created page.
	* Define your desired routing path for your newly created page.
7. Within your newly created page jsx file:
	* Update the export of your page to export the desired name of your page.
	* Proceed with adding any other components or desired content for your newly created page.
8. Add any custom CSS to style your component in `src/containers/MyPage.less`.
<br/><br/>

## Tutorial: Creating a New Component
This tutorial shows you the process of creating a Reference Storefront component in REACT.

To Create a New Component:

1. Create a new folder for your page in `src/components`.
2. Name the directory the name of your intended component, for example, `mycomponent`.
3. Create a new jsx file for your page in the previously created directory `src/components/mycomponent.main.jsx`.
4. Copy the contents of any existing component to your newly created component to populate it with the required structure.
5. Name the class of your component to the desired name of your component.
6. Within your newly created component jsx file:
	* Update the export of your page to export the desired name of your component.
	* Proceed with adding any other components or desired content for your newly created component.
	* Proceed with importing your component to other components/pages, as needed.
7. Add any custom CSS to style your component in `src/components/mycomponent.main.less`.
<br/><br/>




{% include legal.html %}
